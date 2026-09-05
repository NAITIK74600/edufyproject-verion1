"use client";

import { useState } from "react";

type ContactLead = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
};

type B2BLead = {
  id: number;
  org_name: string;
  org_type: string;
  contact_name: string;
  email: string;
  phone: string | null;
  interest: string | null;
  message: string;
  created_at: string;
};

type RegisterInterestLead = {
  id: number;
  program_slug: string;
  full_name: string;
  email: string;
  phone: string;
  discount_code: string | null;
  message: string | null;
  created_at: string;
};

type Tab = "register" | "contact" | "b2b";

function fmt(date: string) {
  return new Date(date).toLocaleString();
}

export function LeadsPanel({
  initialContact,
  initialB2B,
  initialRegister,
}: {
  initialContact: ContactLead[];
  initialB2B: B2BLead[];
  initialRegister: RegisterInterestLead[];
}) {
  const [tab, setTab] = useState<Tab>("register");

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "register", label: "Register Interest", count: initialRegister.length },
    { id: "contact", label: "Contact", count: initialContact.length },
    { id: "b2b", label: "B2B / Partnerships", count: initialB2B.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/40"
            }`}
          >
            {t.label} <span className="opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      {tab === "register" && (
        <LeadTable
          rows={initialRegister}
          empty="No register-interest submissions yet."
          columns={["Program", "Name", "Email", "Phone", "Discount code", "Message", "Submitted"]}
          render={(r) => [
            r.program_slug,
            r.full_name,
            r.email,
            r.phone,
            r.discount_code ?? "—",
            r.message ?? "—",
            fmt(r.created_at),
          ]}
        />
      )}

      {tab === "contact" && (
        <LeadTable
          rows={initialContact}
          empty="No contact submissions yet."
          columns={["Name", "Email", "Phone", "Subject", "Message", "Submitted"]}
          render={(r) => [r.full_name, r.email, r.phone ?? "—", r.subject ?? "—", r.message, fmt(r.created_at)]}
        />
      )}

      {tab === "b2b" && (
        <LeadTable
          rows={initialB2B}
          empty="No B2B / partnership submissions yet."
          columns={["Organization", "Type", "Contact", "Email", "Phone", "Interest", "Message", "Submitted"]}
          render={(r) => [
            r.org_name,
            r.org_type,
            r.contact_name,
            r.email,
            r.phone ?? "—",
            r.interest ?? "—",
            r.message,
            fmt(r.created_at),
          ]}
        />
      )}
    </div>
  );
}

function LeadTable<T extends { id: number }>({
  rows,
  columns,
  render,
  empty,
}: {
  rows: T[];
  columns: string[];
  render: (row: T) => (string | number)[];
  empty: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-[var(--color-border)] bg-[var(--color-background-2)]/60 text-xs uppercase tracking-wide text-[var(--color-muted-foreground)]">
          <tr>
            {columns.map((c) => (
              <th key={c} className="whitespace-nowrap px-4 py-3">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[var(--color-border)] last:border-0 align-top">
              {render(row).map((cell, i) => (
                <td key={i} className="max-w-[240px] px-4 py-3 text-[var(--color-muted-foreground)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-[var(--color-muted-foreground)]">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
