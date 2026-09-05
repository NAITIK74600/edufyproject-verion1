import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { isRazorpayConfigured, getRazorpay, verifyPaymentSignature } from "@/lib/razorpay";
import { getPlan, getPlanFeatures } from "@/lib/pricing";
import {
  dbEnabled,
  getUserByEmail,
  createUser,
  insertEnrollment,
  type UserRecord,
} from "@/lib/db";
import {
  hashPassword,
  createSessionToken,
  verifySessionToken,
  isValidEmail,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/auth";
import { notifyEnrollment } from "@/lib/mail";

// Generates a friendly-but-random temporary password for auto-created accounts.
function generatePassword(): string {
  return randomBytes(6).toString("base64url"); // ~8 chars, url-safe
}

// Verifies the Razorpay signature, then provisions access: find-or-create the
// student's account (emailing login details for brand-new ones), record the
// enrolment, and log them in. Payment details (plan, amount) are read back from
// the Razorpay order's notes so they can't be tampered with client-side.
export async function POST(request: Request) {
  if (!isRazorpayConfigured) {
    return Response.json({ error: "Payments aren't live yet." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const orderId = String(body.razorpay_order_id ?? "");
  const paymentId = String(body.razorpay_payment_id ?? "");
  const signature = String(body.razorpay_signature ?? "");

  if (!orderId || !paymentId || !signature) {
    return Response.json({ error: "Missing payment details." }, { status: 400 });
  }

  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    return Response.json({ verified: false, error: "Signature mismatch." }, { status: 400 });
  }

  // Trusted purchase details — from the order we created server-side.
  let planId = "";
  let courseSlug = "";
  let courseTitle = "";
  try {
    const order = await getRazorpay().orders.fetch(orderId);
    const notes = (order.notes ?? {}) as Record<string, string>;
    planId = notes.planId ?? "";
    courseSlug = notes.courseSlug ?? "";
    courseTitle = notes.courseTitle ?? "";
  } catch (err) {
    console.error("[api/payment/verify] order fetch failed:", err);
  }

  const plan = getPlan(planId);
  if (!plan) {
    // Payment is genuine but we couldn't resolve the plan — acknowledge success.
    return Response.json({ verified: true, accessProvisioned: false });
  }

  // Identify the buyer: a logged-in session wins; otherwise use the details the
  // guest entered at checkout.
  const jar = await cookies();
  const session = verifySessionToken(jar.get(SESSION_COOKIE_NAME)?.value);

  const fullName = String(body.full_name ?? session?.fullName ?? "").trim() || "Student";
  const email = String(body.email ?? session?.email ?? "").trim();
  const phone = body.phone ? String(body.phone).trim() : undefined;

  if (!email || !isValidEmail(email)) {
    return Response.json({ verified: true, accessProvisioned: false, error: "A valid email is required to grant access." });
  }

  // Without a database we can verify payment but can't persist access.
  if (!dbEnabled) {
    return Response.json({ verified: true, accessProvisioned: false });
  }

  let user: UserRecord | null = null;
  let generatedPassword: string | undefined;
  try {
    user = await getUserByEmail(email);
    if (!user) {
      generatedPassword = generatePassword();
      user = await createUser({
        full_name: fullName,
        email,
        phone,
        password_hash: hashPassword(generatedPassword),
      });
    }

    await insertEnrollment({
      user_id: user.id,
      course_slug: courseSlug || null,
      course_title: courseTitle || null,
      plan_id: plan.id,
      plan_name: plan.name,
      amount_inr: plan.price,
      order_id: orderId,
      payment_id: paymentId,
    });
  } catch (err) {
    console.error("[api/payment/verify] provisioning failed:", err);
    return Response.json({ verified: true, accessProvisioned: false });
  }

  // Log the student in so they land straight on their dashboard.
  const token = createSessionToken({ id: user.id, email: user.email, fullName: user.full_name });
  jar.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  // Best-effort email (confirmation + credentials for new accounts).
  notifyEnrollment({
    full_name: user.full_name,
    email: user.email,
    plan_name: plan.name,
    course_title: courseTitle || null,
    amount_inr: plan.price,
    features: getPlanFeatures(plan.id),
    generatedPassword,
  }).catch((err) => console.error("[api/payment/verify] email failed:", err));

  return Response.json({
    verified: true,
    accessProvisioned: true,
    accountCreated: Boolean(generatedPassword),
  });
}
