"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconArrowRight } from "./icons";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors hover:border-[var(--color-destructive)]/50 hover:text-[var(--color-destructive)] disabled:opacity-60"
    >
      {loading ? "Logging out…" : "Log out"} <IconArrowRight className="h-3.5 w-3.5" />
    </button>
  );
}
