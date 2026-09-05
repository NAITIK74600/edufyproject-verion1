"use client";

import { useState, useTransition } from "react";
import { inputClass, Field, FormStatus } from "@/components/form";
import { Button } from "@/components/Button";

type Role = "student" | "admin" | "super_admin";

type SafeUser = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: Role;
  created_at: string;
};

const ROLE_LABEL: Record<Role, string> = {
  student: "Student",
  admin: "Admin",
  super_admin: "Super Admin",
};

const ROLE_BADGE: Record<Role, string> = {
  student: "bg-[var(--color-muted)]/50 text-[var(--color-muted-foreground)]",
  admin: "bg-[var(--color-accent)]/15 text-[var(--color-accent)]",
  super_admin: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
};

export function UsersPanel({
  initialUsers,
  initialTotal,
  pageSize,
  viewerRole,
  viewerId,
}: {
  initialUsers: SafeUser[];
  initialTotal: number;
  pageSize: number;
  viewerRole: Role;
  viewerId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [listError, setListError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ full_name: "", email: "", phone: "", password: "", role: "student" as Role });
  const [createState, setCreateState] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [createMsg, setCreateMsg] = useState("");

  const canManageRoles = viewerRole === "super_admin";
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  async function reload(nextPage = page, nextSearch = search) {
    setListError("");
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(nextSearch)}&page=${nextPage}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load users.");
      setUsers(data.users);
      setTotal(data.total);
      setPage(nextPage);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Failed to load users.");
    }
  }

  function onSearchChange(value: string) {
    setSearch(value);
    startTransition(() => reload(1, value));
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateState("loading");
    setCreateMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateState("error");
        setCreateMsg(data.error ?? "Failed to create user.");
        return;
      }
      setCreateState("success");
      setCreateMsg(`Created ${ROLE_LABEL[createForm.role]} account for ${createForm.email}.`);
      setCreateForm({ full_name: "", email: "", phone: "", password: "", role: "student" });
      reload(1, search);
    } catch {
      setCreateState("error");
      setCreateMsg("Network error. Please try again.");
    }
  }

  async function onRoleChange(user: SafeUser, role: Role) {
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)));
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to update role.");
    }
  }

  async function onResetPassword(user: SafeUser) {
    const password = window.prompt(`New password for ${user.email} (min 8 characters):`);
    if (!password) return;
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      alert(`Password updated for ${user.email}.`);
    } else {
      alert(data.error ?? "Failed to reset password.");
    }
  }

  async function onDelete(user: SafeUser) {
    if (!window.confirm(`Delete ${user.full_name} (${user.email})? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      reload(page, search);
    } else {
      alert(data.error ?? "Failed to delete user.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">
          Users <span className="text-[var(--color-muted-foreground)]">({total})</span>
        </h2>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email…"
            className={`${inputClass} w-64`}
          />
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-primary)]/40"
          >
            {showCreate ? "Cancel" : "+ Create user"}
          </button>
        </div>
      </div>

      {showCreate && (
        <form
          onSubmit={onCreate}
          className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:grid-cols-2"
        >
          <Field label="Full name" htmlFor="c-name" required>
            <input
              id="c-name"
              required
              className={inputClass}
              value={createForm.full_name}
              onChange={(e) => setCreateForm((f) => ({ ...f, full_name: e.target.value }))}
            />
          </Field>
          <Field label="Email" htmlFor="c-email" required>
            <input
              id="c-email"
              type="email"
              required
              className={inputClass}
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
            />
          </Field>
          <Field label="Phone" htmlFor="c-phone">
            <input
              id="c-phone"
              className={inputClass}
              value={createForm.phone}
              onChange={(e) => setCreateForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </Field>
          <Field label="Password" htmlFor="c-password" required hint="Minimum 8 characters">
            <input
              id="c-password"
              type="text"
              required
              minLength={8}
              className={inputClass}
              value={createForm.password}
              onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
            />
          </Field>
          {canManageRoles && (
            <Field label="Role" htmlFor="c-role">
              <select
                id="c-role"
                className={inputClass}
                value={createForm.role}
                onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value as Role }))}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </Field>
          )}
          <div className="sm:col-span-2">
            <FormStatus state={createState} message={createMsg} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={createState === "loading"}>
              {createState === "loading" ? "Creating…" : "Create account"}
            </Button>
          </div>
        </form>
      )}

      {listError && <FormStatus state="error" message={listError} />}

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-background-2)]/60 text-xs uppercase tracking-wide text-[var(--color-muted-foreground)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isPrivileged = u.role !== "student";
              const canManageThisUser = canManageRoles || !isPrivileged;
              return (
                <tr key={u.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{u.full_name}</td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)]">{u.email}</td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)]">{u.phone ?? "—"}</td>
                  <td className="px-4 py-3">
                    {canManageRoles ? (
                      <select
                        value={u.role}
                        onChange={(e) => onRoleChange(u, e.target.value as Role)}
                        disabled={u.id === viewerId}
                        className={`rounded-full border-none px-3 py-1 text-xs font-semibold ${ROLE_BADGE[u.role]}`}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    ) : (
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ROLE_BADGE[u.role]}`}>
                        {ROLE_LABEL[u.role]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)]">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onResetPassword(u)}
                        disabled={!canManageThisUser}
                        className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium transition-colors hover:border-[var(--color-primary)]/40 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Reset password
                      </button>
                      <button
                        onClick={() => onDelete(u)}
                        disabled={!canManageThisUser || u.id === viewerId}
                        className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-destructive)] transition-colors hover:border-[var(--color-destructive)]/50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-muted-foreground)]">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <button
            onClick={() => reload(page - 1, search)}
            disabled={page <= 1 || isPending}
            className="rounded-full border border-[var(--color-border)] px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-[var(--color-muted-foreground)]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => reload(page + 1, search)}
            disabled={page >= totalPages || isPending}
            className="rounded-full border border-[var(--color-border)] px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
