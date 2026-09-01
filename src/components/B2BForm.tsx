"use client";

import { useState } from "react";
import { inputClass, Field, FormStatus } from "./form";
import { SHINY_BUTTON_CLASS } from "./ui/shiny-button";

type State = "idle" | "loading" | "success" | "error";

export function B2BForm() {
  const [form, setForm] = useState({
    org_name: "",
    org_type: "College",
    contact_name: "",
    email: "",
    phone: "",
    interest: "Training",
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
      const res = await fetch("/api/b2b", {
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
      setMsg(data.message ?? "Thank you! Our partnerships team will be in touch.");
      setForm((f) => ({
        ...f,
        org_name: "",
        contact_name: "",
        email: "",
        phone: "",
        message: "",
      }));
    } catch {
      setState("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organization name" htmlFor="org_name" required>
          <input
            id="org_name"
            value={form.org_name}
            onChange={(e) => update("org_name", e.target.value)}
            required
            className={inputClass}
            placeholder="Acme University / Acme Corp"
          />
        </Field>
        <Field label="Organization type" htmlFor="org_type" required>
          <select
            id="org_type"
            value={form.org_type}
            onChange={(e) => update("org_type", e.target.value)}
            className={inputClass}
          >
            <option>College</option>
            <option>Company</option>
            <option>Government</option>
            <option>NGO / Other</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Contact name" htmlFor="contact_name" required>
          <input
            id="contact_name"
            name="contact_name"
            autoComplete="name"
            value={form.contact_name}
            onChange={(e) => update("contact_name", e.target.value)}
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
        <Field label="Work email" htmlFor="email" required>
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
            placeholder="you@org.com"
          />
        </Field>
        <Field label="Area of interest" htmlFor="interest">
          <select
            id="interest"
            value={form.interest}
            onChange={(e) => update("interest", e.target.value)}
            className={inputClass}
          >
            <option>Training</option>
            <option>Hiring / Placements</option>
            <option>Collaborative Program</option>
            <option>Tech Solutions</option>
          </select>
        </Field>
      </div>

      <Field label="How can we help?" htmlFor="message" required>
        <textarea
          id="message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          required
          rows={4}
          className={inputClass}
          placeholder="Tell us about your goals, cohort size, timelines…"
        />
      </Field>

      <FormStatus state={state} message={msg} />

      <button
        type="submit"
        disabled={state === "loading"}
        className={`w-full cursor-pointer rounded-xl px-6 py-3.5 font-semibold ${SHINY_BUTTON_CLASS} disabled:opacity-60`}
      >
        {state === "loading" ? "Sending…" : "Submit Inquiry"}
      </button>
    </form>
  );
}
