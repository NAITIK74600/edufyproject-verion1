import { insertB2BLead } from "@/lib/db";
import { notifyB2B } from "@/lib/mail";
import { isValidEmail } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "b2b", 5, 60_000);
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const org_name = String(body.org_name ?? "").trim();
  const org_type = String(body.org_type ?? "").trim();
  const contact_name = String(body.contact_name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = body.phone ? String(body.phone).trim() : undefined;
  const interest = body.interest ? String(body.interest).trim() : undefined;
  const message = String(body.message ?? "").trim();

  if (!org_name || !org_type || !contact_name || !email || !message) {
    return Response.json(
      { error: "Organization, contact name, email, and message are required." },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await insertB2BLead({ org_name, org_type, contact_name, email, phone, interest, message });
  } catch (err) {
    console.error("[api/b2b] insert failed:", err);
    return Response.json(
      { error: "We couldn't save your inquiry right now. Please try again shortly." },
      { status: 503 }
    );
  }

  notifyB2B({ org_name, org_type, contact_name, email, phone, interest, message }).catch((err) =>
    console.error("[api/b2b] email notify failed:", err)
  );

  return Response.json({ message: "Thank you! Our partnerships team will be in touch." });
}
