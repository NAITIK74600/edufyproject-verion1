import { getAdminSession } from "@/lib/adminGuard";
import { getContactLeads, getB2BLeads, getRegisterInterestLeads } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession("admin");
  if (!session) return Response.json({ error: "Unauthorized." }, { status: 401 });

  const [contact, b2b, register] = await Promise.all([
    getContactLeads(),
    getB2BLeads(),
    getRegisterInterestLeads(),
  ]);

  return Response.json({ contact, b2b, register });
}
