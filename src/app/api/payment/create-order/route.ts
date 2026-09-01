import { getPlan } from "@/lib/pricing";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";
import { enforceRateLimit } from "@/lib/rateLimit";

// Creates a Razorpay order for a given plan. The amount is resolved server-side
// from the plan catalogue — the client only sends a planId, never a price.
export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "create-order", 15, 60_000);
  if (limited) return limited;

  if (!isRazorpayConfigured) {
    return Response.json(
      { error: "Payments aren't live yet. Please check back soon." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const planId = String(body.planId ?? "").trim();
  const plan = getPlan(planId);
  if (!plan) {
    return Response.json({ error: "Unknown plan." }, { status: 400 });
  }

  const courseSlug = body.courseSlug ? String(body.courseSlug).trim() : "";
  const courseTitle = body.courseTitle ? String(body.courseTitle).trim() : "";

  try {
    const order = await getRazorpay().orders.create({
      amount: plan.price * 100, // paise
      currency: "INR",
      receipt: `rcpt_${plan.id}_${Date.now()}`,
      // notes are the trusted record of what was purchased — verify reads them
      // back from Razorpay so the client can't tamper with plan/price.
      notes: { planId: plan.id, planName: plan.name, courseSlug, courseTitle },
    });

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? "",
      planName: plan.name,
    });
  } catch (err) {
    console.error("[api/payment/create-order] failed:", err);
    return Response.json(
      { error: "Could not start the payment. Please try again." },
      { status: 502 }
    );
  }
}
