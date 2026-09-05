import { getAdminSession } from "@/lib/adminGuard";
import { updateUser, deleteUserById, getUserById, setUserPassword, type UserRole } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rateLimit";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession("admin");
  if (!session) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;

  const limited = enforceRateLimit(request, "admin-update-user", 30, 60_000);
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const target = await getUserById(id);
  if (!target) return Response.json({ error: "User not found." }, { status: 404 });

  const wantsRoleChange = typeof body.role === "string" && body.role !== target.role;
  const targetIsPrivileged = target.role !== "student";
  if ((wantsRoleChange || targetIsPrivileged) && session.role !== "super_admin") {
    return Response.json(
      { error: "Only a super admin can manage admin accounts or change roles." },
      { status: 403 }
    );
  }
  if (wantsRoleChange && !["student", "admin", "super_admin"].includes(body.role as string)) {
    return Response.json({ error: "Invalid role." }, { status: 400 });
  }

  if (typeof body.password === "string" && body.password) {
    if (body.password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    await setUserPassword(id, hashPassword(body.password));
  }

  const updates: { full_name?: string; phone?: string; role?: UserRole } = {};
  if (typeof body.full_name === "string" && body.full_name.trim()) updates.full_name = body.full_name.trim();
  if (typeof body.phone === "string") updates.phone = body.phone.trim();
  if (wantsRoleChange) updates.role = body.role as UserRole;

  const updated = Object.keys(updates).length ? await updateUser(id, updates) : await getUserById(id);
  if (!updated) return Response.json({ error: "User not found." }, { status: 404 });
  const { password_hash: _drop, ...safe } = updated;
  return Response.json({ user: safe });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession("admin");
  if (!session) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;

  if (id === session.userId) {
    return Response.json({ error: "You can't delete your own account." }, { status: 400 });
  }

  const target = await getUserById(id);
  if (!target) return Response.json({ error: "User not found." }, { status: 404 });
  if (target.role !== "student" && session.role !== "super_admin") {
    return Response.json({ error: "Only a super admin can delete admin accounts." }, { status: 403 });
  }

  await deleteUserById(id);
  return Response.json({ ok: true });
}
