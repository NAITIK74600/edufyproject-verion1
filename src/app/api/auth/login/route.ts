import { cookies } from "next/headers";
import { getUserByEmail } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rateLimit";
import {
  verifyPassword,
  createSessionToken,
  isValidEmail,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/auth";

export async function POST(request: Request) {
  // Tight limit — this is the brute-force surface.
  const limited = enforceRateLimit(request, "login", 8, 60_000);
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  if (!email || !password || !isValidEmail(email)) {
    return Response.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  let user;
  try {
    user = await getUserByEmail(email);
  } catch (err) {
    console.error("[api/auth/login] lookup failed:", err);
    return Response.json({ error: "Login is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }

  // Same generic message whether the email is unknown or the password is
  // wrong — never reveal which one it was.
  if (!user || !verifyPassword(password, user.password_hash)) {
    return Response.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const token = createSessionToken({ id: user.id, email: user.email, fullName: user.full_name, role: user.role });
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return Response.json({ user: { fullName: user.full_name, email: user.email, role: user.role } });
}
