import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  const jar = await cookies();
  const session = verifySessionToken(jar.get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return Response.json({ user: null }, { status: 200 });
  }
  return Response.json({ user: { fullName: session.fullName, email: session.email, role: session.role } });
}
