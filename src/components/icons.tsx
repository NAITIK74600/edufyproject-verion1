import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
};

export const IconBrain = (p: IconProps) => (
  <svg {...base} {...p}><path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.5A2.5 2.5 0 0 0 4.5 8 2.5 2.5 0 0 0 4 12a2.5 2.5 0 0 0 .5 4A2.5 2.5 0 0 0 7 18.5v.5a2.5 2.5 0 0 0 5 0V4.5A2.5 2.5 0 0 0 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v.5A2.5 2.5 0 0 1 19.5 8 2.5 2.5 0 0 1 20 12a2.5 2.5 0 0 1-.5 4A2.5 2.5 0 0 1 17 18.5v.5a2.5 2.5 0 0 1-5 0"/></svg>
);

export const IconChart = (p: IconProps) => (
  <svg {...base} {...p}><path d="M3 3v18h18"/><path d="M7 15l3-4 3 3 5-7"/></svg>
);

export const IconShield = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg>
);

export const IconUsers = (p: IconProps) => (
  <svg {...base} {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export const IconRocket = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
);

export const IconSparkle = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>
);

export const IconStar = (p: IconProps) => (
  <svg {...base} {...p} fill="currentColor" stroke="none"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2Z"/></svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base} {...p}><path d="M20 6L9 17l-5-5"/></svg>
);

export const IconDownload = (p: IconProps) => (
  <svg {...base} {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
);

export const IconPlay = (p: IconProps) => (
  <svg {...base} {...p} fill="currentColor" stroke="none"><path d="M7 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z"/></svg>
);

export const IconClock = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
);

export const IconTag = (p: IconProps) => (
  <svg {...base} {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/></svg>
);

export const IconLevel = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>
);

export const IconMail = (p: IconProps) => (
  <svg {...base} {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
);

export const IconPhone = (p: IconProps) => (
  <svg {...base} {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
);

export const IconPin = (p: IconProps) => (
  <svg {...base} {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export const IconLinkedin = (p: IconProps) => (
  <svg {...base} {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2" fill="currentColor" stroke="none"/></svg>
);

export const IconInstagram = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>
);

export const IconWhatsapp = (p: IconProps) => (
  <svg {...base} {...p} fill="currentColor" stroke="none" viewBox="0 0 24 24">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.84 14.05c-.24.68-1.4 1.3-1.94 1.38-.49.08-1.11.11-1.8-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.09-4.85-4.28-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.37.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.61-.07.16-.19.68-.79.87-1.06.18-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.46.21.53.33.07.12.07.68-.17 1.36Z"/>
  </svg>
);

export const IconMenu = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 6h16M4 12h16M4 18h16"/></svg>
);

export const IconClose = (p: IconProps) => (
  <svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>
);

export const IconChevronDown = (p: IconProps) => (
  <svg {...base} {...p}><path d="m6 9 6 6 6-6"/></svg>
);

export const IconBot = (p: IconProps) => (
  <svg {...base} {...p}><rect x="4" y="9" width="16" height="11" rx="3"/><path d="M12 9V5"/><circle cx="12" cy="4" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none"/><path d="M2 13v3M22 13v3"/></svg>
);

export const IconSend = (p: IconProps) => (
  <svg {...base} {...p}><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/></svg>
);

export const IconMinus = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 12h14"/></svg>
);

export const IconCode = (p: IconProps) => (
  <svg {...base} {...p}><path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m13 5-2 14"/></svg>
);

export const IconCloud = (p: IconProps) => (
  <svg {...base} {...p}><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.4-1.5A5 5 0 0 0 6.5 19h11Z"/></svg>
);

export const IconPenTool = (p: IconProps) => (
  <svg {...base} {...p}><path d="m12 19 7-7 3 3-7 7-3-3Z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
);

export const IconMobile = (p: IconProps) => (
  <svg {...base} {...p}><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>
);

export const IconCpu = (p: IconProps) => (
  <svg {...base} {...p}><rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>
);

export const IconBriefcase = (p: IconProps) => (
  <svg {...base} {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

export const IconPulse = (p: IconProps) => (
  <svg {...base} {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

export const IconCompass = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="m15 9-2 6-6 2 2-6 6-2Z"/></svg>
);

export const IconCoins = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="9" cy="9" r="6"/><path d="M14.5 8a6 6 0 1 1 0 8.5"/><path d="M9 7v4M7 9h4" strokeWidth="1.5"/></svg>
);

export const IconAtom = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)"/></svg>
);

export const IconMegaphone = (p: IconProps) => (
  <svg {...base} {...p}><path d="M3 11v3a1 1 0 0 0 1 1h1l2 6h2l-1-6h5l7 4V6l-7 4H4a1 1 0 0 0-1 1Z"/></svg>
);

/* ---------- Extra glyphs, one per program, so cards in a shared category
   (e.g. the six "Science & Research" programs) still read as distinct
   subjects rather than repeating the same watermark. ---------- */

export const IconNetwork = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><path d="M6.7 7.3 10.5 11M17.3 7.3 13.5 11M6.7 16.7l3.8-3.7M17.3 16.7l-3.8-3.7"/></svg>
);

export const IconBarChart = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 20V12M10 20V4M16 20v-6M22 20H2"/></svg>
);

export const IconBattery = (p: IconProps) => (
  <svg {...base} {...p}><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 10v4"/><path d="M6 10v4"/></svg>
);

export const IconRobot = (p: IconProps) => (
  <svg {...base} {...p}><rect x="5" y="9" width="14" height="10" rx="2"/><circle cx="9.5" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="14" r="1" fill="currentColor" stroke="none"/><path d="M12 9V5M9 5h6M3 12v3M21 12v3"/></svg>
);

export const IconCircuit = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 6h6v6H4zM4 12v6h5"/><circle cx="17" cy="7" r="2"/><path d="M17 9v3h-5M4 3v3M20 12h-3"/></svg>
);

export const IconClipboard = (p: IconProps) => (
  <svg {...base} {...p}><rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M8 12h8M8 16h5"/></svg>
);

export const IconFlag = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 21V4"/><path d="M5 4h13l-3 4 3 4H5"/></svg>
);

export const IconStethoscope = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 3v6a4 4 0 0 0 8 0V3"/><path d="M9 13v2a5 5 0 0 0 10 0v-2.5"/><circle cx="19" cy="8.5" r="2"/></svg>
);

export const IconBuilding = (p: IconProps) => (
  <svg {...base} {...p}><rect x="4" y="3" width="10" height="18"/><path d="M14 8h6v13h-6M7 7h.01M11 7h.01M7 11h.01M11 11h.01M7 15h.01M11 15h.01"/></svg>
);

export const IconDollar = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 2v20"/><path d="M17 6.5c0-1.9-2.2-3.5-5-3.5s-5 1.6-5 3.5S9.2 10 12 10s5 1.6 5 3.5-2.2 3.5-5 3.5-5-1.6-5-3.5"/></svg>
);

export const IconTrendingUp = (p: IconProps) => (
  <svg {...base} {...p}><path d="m3 17 6-6 4 4 8-8"/><path d="M15 6h6v6"/></svg>
);

export const IconDna = (p: IconProps) => (
  <svg {...base} {...p}><path d="M7 3c0 5 10 5 10 10s-10 5-10 10"/><path d="M17 3c0 5-10 5-10 10s10 5 10 10"/><path d="M8 7h8M7.5 12h9M8 17h8"/></svg>
);

export const IconFlask = (p: IconProps) => (
  <svg {...base} {...p}><path d="M9 2h6M10 2v6l-6 11a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3L14 8V2"/><path d="M8 15h8"/></svg>
);

export const IconHeadCircuit = (p: IconProps) => (
  <svg {...base} {...p}><path d="M9 3a6 6 0 0 0-6 6c0 2 1 3 1 5v3h10v-3c0-1 1-2 1-4a6 6 0 0 0-1-3"/><path d="M9 17v3M13 17v3"/><path d="M7 9h1M11 9h1M9 9v3"/></svg>
);

export const IconMicroscope = (p: IconProps) => (
  <svg {...base} {...p}><path d="M6 21h12"/><path d="M9 21v-4a3 3 0 0 1 3-3 3 3 0 0 0 3-3"/><path d="M9 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" transform="rotate(45 12 8)"/><path d="M13.5 3.5 17 7"/></svg>
);

export const IconBarcode = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 4v16M8 4v16M11 4v16M15 4v16M17 4v16M21 4v16" strokeWidth="1.6"/></svg>
);

export const IconPalette = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2H17a4 4 0 0 0 4-4c0-4.4-4-7.4-9-7.4Z"/><circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="11" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none"/></svg>
);

export const domainIcon: Record<string, (p: IconProps) => React.JSX.Element> = {
  "AI/ML": IconBrain,
  "Data Science": IconChart,
  Cybersecurity: IconShield,
  HR: IconUsers,
  "Web Development": IconCode,
  "Cloud & Infrastructure": IconCloud,
  Design: IconPalette,
  Mobile: IconMobile,
  "Electronics & Hardware": IconCpu,
  "Business & Management": IconBriefcase,
  Healthcare: IconPulse,
  "Engineering & Design": IconCompass,
  Finance: IconCoins,
  "Science & Research": IconAtom,
  Marketing: IconMegaphone,
};

/* Per-program glyph overrides — keyed by slug so programs sharing a broad
   category (Electronics & Hardware, Science & Research, Finance...) still
   get a watermark that reads as their own subject, not a repeated stock icon. */
export const programIcon: Record<string, (p: IconProps) => React.JSX.Element> = {
  "machine-learning": IconNetwork,
  "data-analytics": IconBarChart,
  "hybrid-electric-vehicle": IconBattery,
  "iot-robotics": IconRobot,
  "vlsi": IconCpu,
  "embedded-systems": IconCircuit,
  "business-analyst": IconClipboard,
  "product-management": IconFlag,
  "medical-coding": IconStethoscope,
  "construction-planning": IconBuilding,
  "finance": IconDollar,
  "stock-marketing": IconTrendingUp,
  "biotechnology": IconDna,
  "genetic-engineering": IconFlask,
  "psychology-workshop": IconHeadCircuit,
  "microbiology": IconMicroscope,
  "bioinformatics": IconBarcode,
};
