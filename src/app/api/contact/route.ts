import { insertContactLead } from "@/lib/db";
import { notifyContact } from "@/lib/mail";
import { isValidEmail } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "contact", 5, 60_000);
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const full_name = String(body.full_name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = body.phone ? String(body.phone).trim() : undefined;
  const subject = body.subject ? String(body.subject).trim() : undefined;
  const message = String(body.message ?? "").trim();

  if (!full_name || !email || !message) {
    return Response.json({ error: "Full name, email, and message are required." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await insertContactLead({ full_name, email, phone, subject, message });
  } catch (err) {
    console.error("[api/contact] insert failed:", err);
    return Response.json(
      { error: "We couldn't save your message right now. Please try again shortly." },
      { status: 503 }
    );
  }

  // Email delivery is best-effort — a submission is never lost just because SMTP is down.
  notifyContact({ full_name, email, phone, subject, message }).catch((err) =>
    console.error("[api/contact] email notify failed:", err)
  );

  return Response.json({ message: "Thanks for reaching out! We'll reply soon." });
}
