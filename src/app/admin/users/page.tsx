import type { Metadata } from "next";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { listUsers, countUsers } from "@/lib/db";
import { UsersPanel } from "./UsersPanel";

export const metadata: Metadata = { title: "Admin · Users" };

const PAGE_SIZE = 20;

export default async function AdminUsersPage() {
  const jar = await cookies();
  const session = verifySessionToken(jar.get(SESSION_COOKIE_NAME)?.value);
  const viewerRole = session?.role === "super_admin" ? "super_admin" : "admin";
  const viewerId = session?.userId ?? "";

  const [users, total] = await Promise.all([listUsers({ limit: PAGE_SIZE }), countUsers()]);
  const initialUsers = users.map(({ password_hash: _drop, ...u }) => u);

  return (
    <UsersPanel
      initialUsers={initialUsers}
      initialTotal={total}
      pageSize={PAGE_SIZE}
      viewerRole={viewerRole}
      viewerId={viewerId}
    />
  );
}
