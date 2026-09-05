import { getAdminSession } from "@/lib/adminGuard";
import { listUsers, countUsers, createUser, getUserByEmail, type UserRole } from "@/lib/db";
import { hashPassword, isValidEmail } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rateLimit";

const PAGE_SIZE = 20;

export async function GET(request: Request) {
  const session = await getAdminSession("admin");
  if (!session) return Response.json({ error: "Unauthorized." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [users, total] = await Promise.all([
    listUsers({ search, limit: PAGE_SIZE, offset }),
    countUsers(search),
  ]);

  // Never send password hashes to the client.
  const safe = users.map(({ password_hash: _drop, ...u }) => u);
  return Response.json({ users: safe, total, page, pageSize: PAGE_SIZE });
}

export async function POST(request: Request) {
  const session = await getAdminSession("admin");
  if (!session) return Response.json({ error: "Unauthorized." }, { status: 401 });

  const limited = enforceRateLimit(request, "admin-create-user", 20, 60_000);
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
  const password = String(body.password ?? "");
  const requestedRole = String(body.role ?? "student") as UserRole;

  if (!full_name || !email || !isValidEmail(email) || password.length < 8) {
    return Response.json(
      { error: "Full name, a valid email, and a password of at least 8 characters are required." },
      { status: 400 }
    );
  }

  if (!["student", "admin", "super_admin"].includes(requestedRole)) {
    return Response.json({ error: "Invalid role." }, { status: 400 });
  }
  if (requestedRole !== "student" && session.role !== "super_admin") {
    return Response.json({ error: "Only a super admin can create admin accounts." }, { status: 403 });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return Response.json({ error: "A user with that email already exists." }, { status: 409 });
  }

  const user = await createUser({
    full_name,
    email,
    phone,
    password_hash: hashPassword(password),
    role: requestedRole,
  });
  const { password_hash: _drop, ...safe } = user;
  return Response.json({ user: safe }, { status: 201 });
}
