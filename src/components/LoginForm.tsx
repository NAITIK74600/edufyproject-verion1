"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inputClass, Field, FormStatus } from "./form";
import { SHINY_BUTTON_CLASS } from "./ui/shiny-button";

type State = "idle" | "loading" | "error";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setMsg(data.error ?? "Something went wrong.");
        return;
      }
      const next =
        searchParams.get("next") ||
        (data.user?.role === "admin" || data.user?.role === "super_admin" ? "/admin" : "/dashboard");
      router.push(next);
      router.refresh();
    } catch {
      setState("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <Field label="Email" htmlFor="email" required>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          required
          className={inputClass}
          placeholder="you@email.com"
        />
      </Field>
      <Field label="Password" htmlFor="password" required>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          required
          className={inputClass}
          placeholder="••••••••"
        />
      </Field>

      <FormStatus state={state === "error" ? "error" : "idle"} message={msg} />

      <button
        type="submit"
        disabled={state === "loading"}
        className={`w-full cursor-pointer rounded-xl px-6 py-3.5 font-semibold ${SHINY_BUTTON_CLASS} disabled:opacity-60`}
      >
        {state === "loading" ? "Logging in…" : "Log In"}
      </button>
    </form>
  );
}
