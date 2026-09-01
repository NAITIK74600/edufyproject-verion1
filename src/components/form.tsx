import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-2)] px-4 py-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30";

export function Field({
  label,
  htmlFor,
  required,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]/90"
      >
        {label}
        {required && <span className="ml-0.5 text-[var(--color-destructive)]">*</span>}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{hint}</p>
      )}
    </div>
  );
}

export function FormStatus({
  state,
  message,
}: {
  state: "idle" | "loading" | "success" | "error";
  message?: string;
}) {
  if (state === "idle" || state === "loading") return null;
  const isSuccess = state === "success";
  return (
    <p
      role="status"
      className={`rounded-xl px-4 py-3 text-sm ${
        isSuccess
          ? "bg-[var(--color-accent-2)]/15 text-[var(--color-accent-2)]"
          : "bg-[var(--color-destructive)]/15 text-[var(--color-destructive)]"
      }`}
    >
      {message}
    </p>
  );
}
