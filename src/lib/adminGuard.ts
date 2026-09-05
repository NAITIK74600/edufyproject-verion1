import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME, type SessionPayload } from "./auth";

/**
 * Reads and verifies the session cookie, returning it only if the caller has
 * at least `minRole`'s privilege ("admin" also accepts "super_admin"). Used by
 * every /api/admin/* route handler and /admin/* server page — the single
 * choke point for who may reach the admin panel.
 */
export async function getAdminSession(
  minRole: "admin" | "super_admin" = "admin"
): Promise<SessionPayload | null> {
  const jar = await cookies();
  const session = verifySessionToken(jar.get(SESSION_COOKIE_NAME)?.value);
  if (!session) return null;
  if (session.role !== "admin" && session.role !== "super_admin") return null;
  if (minRole === "super_admin" && session.role !== "super_admin") return null;
  return session;
}
