import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";
import { SHINY_BUTTON_CLASS } from "./ui/shiny-button";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "invert" | "outline-invert";
type Size = "sm" | "md" | "lg";

// Matches the EduFyi "Abyssal" dark system button spec:
// Primary & Accent share the premium 21st.dev "Shiny Button" treatment — an
// azure→cyan gradient (logo ribbons) that slides on hover, with a cyan glow halo
// and inset lighting for a tactile, high-end CTA. · Secondary (dark glass +
// cyan-hover outline) · Ghost (text link + arrow) · Invert (solid white, for CTAs
// on a gradient/photo banner) · Outline-invert (transparent + white outline).
const variants: Record<Variant, string> = {
  primary: SHINY_BUTTON_CLASS,
  accent: SHINY_BUTTON_CLASS,
  secondary:
    "glass text-[var(--color-foreground)] hover:border-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)]",
  ghost:
    "text-[var(--color-secondary)] hover:text-[var(--color-accent)] px-0 py-0 hover:underline underline-offset-4",
  invert:
    "btn-tactile bg-white text-[#0b6f9e] hover:bg-[#eafaff]",
  "outline-invert":
    "border-[1.5px] border-white/70 text-white hover:bg-white/10 hover:border-white",
};

// Magnetic pull is reserved for high-emphasis CTAs — not every link, to
// keep the effect meaningful rather than a blanket gimmick.
const magneticVariants: Variant[] = ["primary", "accent", "invert"];

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled,
}: Props) {
  const sizeCls = variant === "ghost" ? "text-sm" : sizes[size];
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizeCls} ${className}`;

  const content = href ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <button type={type} disabled={disabled} className={cls}>
      {children}
    </button>
  );

  if (magneticVariants.includes(variant) && !disabled) {
    return <Magnetic>{content}</Magnetic>;
  }
  return content;
}

