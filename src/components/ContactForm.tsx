"use client";

import { useState } from "react";
import { inputClass, Field, FormStatus } from "./form";
import { SHINY_BUTTON_CLASS } from "./ui/shiny-button";

type State = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/contact", {
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
      setState("success");
      setMsg(data.message ?? "Thanks for reaching out! We'll reply soon.");
      setForm({ full_name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setState("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="full_name" required>
          <input
            id="full_name"
            name="full_name"
            autoComplete="name"
            value={form.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            required
            className={inputClass}
            placeholder="Your name"
          />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            spellCheck={false}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
            placeholder="+91 98765 43210"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" required>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            className={inputClass}
            placeholder="you@email.com"
          />
        </Field>
        <Field label="Subject" htmlFor="subject">
          <input
            id="subject"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            className={inputClass}
            placeholder="How can we help?"
          />
        </Field>
      </div>

      <Field label="Message" htmlFor="message" required>
        <textarea
          id="message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          required
          rows={5}
          className={inputClass}
          placeholder="Write your message…"
        />
      </Field>

      <FormStatus state={state} message={msg} />

      <button
        type="submit"
        disabled={state === "loading"}
        className={`w-full cursor-pointer rounded-xl px-6 py-3.5 font-semibold ${SHINY_BUTTON_CLASS} disabled:opacity-60`}
      >
        {state === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
