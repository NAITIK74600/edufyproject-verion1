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
          className="flex w-max items-center gap-12 animate-marquee group-hover:[animation-play-state:paused]"
          style={reverse ? { animationDirection: "reverse" } : undefined}
        >
          {doubled.map((logo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${logo.src}-${i}`}
              src={withBase(logo.src)}
              alt={logo.alt}
              className="h-9 w-auto shrink-0 object-contain transition-transform duration-300 hover:scale-105 sm:h-11"
              loading="lazy"
            />
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
