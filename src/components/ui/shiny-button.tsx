/**
 * Shiny Button — adapted from the 21st.dev element by @Shatlyk1011 / @emerald-ui
 * (https://21st.dev/@Shatlyk1011/components/shiny-button, MIT).
 *
 * Re-tuned to the Edufyi "Abyssal" palette: the vivid gradient now runs
 * azure → cyan → azure (echoing the logo ribbons) with a cyan glow halo and
 * inset lighting for a tactile, premium CTA. The gradient slides across on
 * hover. `SHINY_BUTTON_CLASS` is exported so the shared <Button> component can
 * reuse the exact same treatment for its primary / accent variants.
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Visual-only classes (color, gradient, glow) — layout/size is supplied by the caller. */
export const SHINY_BUTTON_CLASS =
  "text-white " +
  "bg-[linear-gradient(325deg,#0b6f9e_0%,#2ad7ea_52%,#0b6f9e_90%)] " +
  "[background-size:280%_auto] [background-position:0%_center] " +
  "hover:[background-position:100%_center] " +
  "transition-[background-position,box-shadow,transform] duration-[700ms] " +
  "shadow-[0_0_22px_rgba(42,215,234,0.45),0_6px_14px_-3px_rgba(14,134,182,0.5),inset_3px_3px_8px_rgba(160,235,255,0.45),inset_-3px_-3px_8px_rgba(11,80,120,0.5)] " +
  "hover:shadow-[0_0_36px_rgba(42,215,234,0.65),0_10px_22px_-4px_rgba(14,134,182,0.6),inset_3px_3px_8px_rgba(160,235,255,0.5),inset_-3px_-3px_8px_rgba(11,80,120,0.55)]";

type ShinyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

/** Standalone premium button primitive (the raw 21st element). */
export function ShinyButton({
  className = "",
  children = "Get Started",
  ...props
}: ShinyButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-12 w-max cursor-pointer items-center justify-center gap-2 rounded-xl px-6 font-semibold ${SHINY_BUTTON_CLASS} focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default ShinyButton;
