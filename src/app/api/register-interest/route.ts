import { cookies } from "next/headers";
import { insertRegisterInterest, getProgram, getUserByEmail, createUser } from "@/lib/db";
import { notifyRegisterInterest } from "@/lib/mail";
import { enforceRateLimit } from "@/lib/rateLimit";
import {
  hashPassword,
  createSessionToken,
  isValidEmail,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/auth";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "register", 5, 60_000);
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const program_slug = String(body.program_slug ?? "").trim();
  const full_name = String(body.full_name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const password = String(body.password ?? "");
  const discount_code = body.discount_code ? String(body.discount_code).trim() : undefined;
  const message = body.message ? String(body.message).trim() : undefined;

  if (!program_slug || !full_name || !email || !phone) {
    return Response.json(
      { error: "Program, name, email, and phone are required." },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password && password.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const program = await getProgram(program_slug);
  if (!program) {
    return Response.json({ error: "That program doesn't exist." }, { status: 400 });
  }

  try {
    await insertRegisterInterest({ program_slug, full_name, email, phone, discount_code, message });
  } catch (err) {
    console.error("[api/register-interest] insert failed:", err);
    return Response.json(
      { error: "We couldn't save your registration right now. Please try again shortly." },
      { status: 503 }
    );
  }

  notifyRegisterInterest({ program_title: program.title, full_name, email, phone, discount_code, message }).catch(
    (err) => console.error("[api/register-interest] email notify failed:", err)
  );

  // Registering also creates (or reuses) a real account, so the learner can
  // log in afterward to track their registration on /dashboard.
  let accountCreated = false;
  if (password) {
    try {
      const existing = await getUserByEmail(email);
      if (!existing) {
        const user = await createUser({ full_name, email, phone, password_hash: hashPassword(password) });
        const token = createSessionToken({ id: user.id, email: user.email, fullName: user.full_name });
        const jar = await cookies();
        jar.set(SESSION_COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: SESSION_COOKIE_MAX_AGE,
        });
        accountCreated = true;
      }
    } catch (err) {
      // Non-fatal: the registration itself already succeeded above.
      console.error("[api/register-interest] account creation failed:", err);
    }
  }

  return Response.json({
    message: "Thank you! Our team will reach out shortly to help you enroll.",
    accountCreated,
  });
}
