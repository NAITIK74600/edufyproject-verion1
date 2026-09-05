import { withBase } from "@/lib/config";

type Logo = { src: string; alt: string };

type Props = {
  items?: string[];
  logos?: Logo[];
  reverse?: boolean;
};

export function Marquee({ items = [], logos, reverse = false }: Props) {
  if (logos && logos.length > 0) {
    const doubled = [...logos, ...logos];
    return (
      <div className="group relative overflow-hidden border-y border-[var(--color-border)]/60 py-4 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div
          className="flex w-max items-center gap-4 animate-marquee group-hover:[animation-play-state:paused]"
          style={reverse ? { animationDirection: "reverse" } : undefined}
        >
          {doubled.map((logo, i) => (
            <div
              key={`${logo.src}-${i}`}
              className="flex h-12 shrink-0 items-center justify-center rounded-xl bg-white px-4 shadow-sm transition-transform duration-300 hover:scale-110 sm:h-14"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withBase(logo.src)}
                alt={logo.alt}
                className="h-7 w-auto object-contain sm:h-8"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const doubled = [...items, ...items];
  return (
    <div className="group relative overflow-hidden border-y border-[var(--color-border)]/60 py-4 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div
        className="flex w-max items-center gap-10 animate-marquee group-hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-3 whitespace-nowrap text-sm font-semibold tracking-wide text-[var(--color-muted-foreground)]/70 transition-colors hover:text-[var(--color-foreground)]"
          >
            {item}
            <span className="h-1 w-1 rotate-45 bg-[var(--color-accent)]/50" />
          </span>
        ))}
      </div>
    </div>
  );
}
