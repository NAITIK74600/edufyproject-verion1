import Link from "next/link";
import type { Program } from "@/lib/types";
import { formatINR } from "@/lib/config";
import { programCover } from "@/lib/programCovers";
import {
  IconStar,
  IconClock,
  IconArrowRight,
  domainIcon,
  programIcon,
  IconSparkle,
} from "./icons";

export function ProgramCard({
  program,
  index = 0,
  showPrice = true,
}: {
  program: Program;
  index?: number;
  showPrice?: boolean;
}) {
  const Icon = programIcon[program.slug] ?? domainIcon[program.category] ?? IconSparkle;
  const cover = programCover[program.slug];

  return (
    <Link
      href={`/programs/${program.slug}`}
      data-cursor="View"
      className="program-card-surface group relative isolate flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[var(--color-border)] shadow-[var(--shadow-1)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-4)]"
    >
      {/* Brochure/background image (when the program has one). The generated
          covers already carry the program name/graphic on their left half, so
          we bias the crop toward the right (where the artwork/screen mockup
          lives) and scrim mainly the left where our own text sits, keeping both
          readable instead of stacking duplicate text on a washed-out photo. */}
      {cover && (
        <>
          <img
            src={cover}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-right transition-transform duration-500 group-hover:scale-105"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(6,14,20,0.97)_0%,rgba(6,14,20,0.93)_38%,rgba(6,14,20,0.55)_62%,rgba(6,14,20,0.18)_100%)]"
          />
        </>
      )}

      {/* Oversized category-glyph watermark — only for cards without a real
          cover photo; on photo cards it just adds clutter on top of the image. */}
      {!cover && (
        <Icon
          aria-hidden
          strokeWidth={1}
          className="pointer-events-none absolute -left-6 -bottom-10 h-44 w-44 text-[var(--color-primary)]/[0.09] transition-all duration-500 group-hover:text-[var(--color-primary)]/[0.16] group-hover:-translate-y-1 group-hover:scale-105"
        />
      )}

      {/* Oversized ghost index number — editorial signature, sits top-right */}
      {!cover && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-6 select-none font-heading text-[6rem] font-bold leading-none text-[var(--color-foreground)]/[0.06] transition-colors duration-300 group-hover:text-[var(--color-primary)]/15"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <div className={`relative flex flex-1 flex-col p-6 ${cover ? "max-w-[72%]" : ""}`}>
        <div className="flex items-center gap-2 text-[var(--color-accent)]">
          <Icon className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.15em]">
            {program.category}
          </span>
        </div>

        <h3 className="mt-4 line-clamp-2 min-h-[3.5rem] text-xl font-semibold text-[var(--color-foreground)]">{program.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {program.short_desc}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--color-muted-foreground)]">
          <span className="inline-flex items-center gap-1.5">
            <IconClock className="h-3.5 w-3.5" /> {program.duration}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[var(--color-accent)]">
            <IconStar className="h-3.5 w-3.5" /> {Number(program.rating).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Ticket-stub divider: dashed tear line with punched notches on both edges */}
      <div className="relative mx-6">
        <span
          aria-hidden
          className="absolute -left-9 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[var(--color-background)]"
        />
        <span
          aria-hidden
          className="absolute -right-9 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[var(--color-background)]"
        />
        <div className="border-t border-dashed border-[var(--color-border)]" />
      </div>

      <div className="relative flex items-center justify-between px-6 py-5">
        {showPrice ? (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">
              Program fee
            </p>
            <p className="text-lg font-bold text-[var(--color-foreground)]">{formatINR(program.price_inr)}</p>
          </div>
        ) : (
          <span className="text-sm font-semibold text-[var(--color-foreground)]">View program</span>
        )}
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold text-white
          bg-[linear-gradient(325deg,#0b6f9e_0%,#2ad7ea_52%,#0b6f9e_90%)] [background-size:280%_auto] [background-position:0%_center]
          shadow-[0_0_14px_rgba(42,215,234,0.35),inset_2px_2px_5px_rgba(160,235,255,0.4),inset_-2px_-2px_5px_rgba(11,80,120,0.5)]
          transition-[background-position,box-shadow,transform] duration-500
          group-hover:[background-position:100%_center] group-hover:shadow-[0_0_26px_rgba(42,215,234,0.6),inset_2px_2px_5px_rgba(160,235,255,0.45),inset_-2px_-2px_5px_rgba(11,80,120,0.55)]
          group-active:scale-95"
        >
          Explore <IconArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
