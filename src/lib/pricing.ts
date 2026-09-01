// Pricing catalogue shown on /pricing. Two views (tabs) mirror the two plan
// families the team sells: "Course Pricing" (self-serve → placement ladder) and
// "Professional Course Pricing" (higher-touch professional tracks).
//
// Course-pricing tiers share one ordered feature list so the four cards read as
// a clean comparison matrix — each tier just flips features on/off. Professional
// tiers have bespoke feature lists, so they carry their own `features` array.

export type PlanId =
  | "self-paced"
  | "mentor-led"
  | "professional"
  | "placement-program"
  | "pro-mentor-lead"
  | "pro-certification";

export type MatrixTier = {
  id: PlanId;
  name: string;
  price: number;
  tagline: string;
  /** Accent for the card header — matches the source design's colour coding. */
  accent: string;
  /** Booleans align 1:1 with COURSE_FEATURES below. */
  included: boolean[];
  /** Draw extra emphasis (border/badge) on the recommended tier. */
  highlighted?: boolean;
};

export type ListTier = {
  id: PlanId;
  name: string;
  price: number;
  tagline: string;
  accent: string;
  features: string[];
  highlighted?: boolean;
};

// Shared, ordered feature rows for the four Course-Pricing tiers.
export const COURSE_FEATURES = [
  "Recorded Sessions",
  "Hands-on Projects",
  "Certifications",
  "Live Sessions",
  "Doubt Clearing Sessions",
  "Mentor Guidance",
  "Placement Assistance",
  "Mock Interview",
  "Resume Building Classes",
  "Aptitude Classes",
  "Shortlisting for Placement",
  "MNC Certification",
] as const;

export const COURSE_TIERS: MatrixTier[] = [
  {
    id: "self-paced",
    name: "Self Paced",
    price: 6999,
    tagline: "Learn at your own pace",
    accent: "#3b82f6",
    included: [true, true, true, true, false, false, false, false, false, false, false, false],
  },
  {
    id: "mentor-led",
    name: "Mentor Led",
    price: 11999,
    tagline: "Get real-time assistance",
    accent: "#2dd4bf",
    included: [true, true, true, true, true, true, false, false, false, false, false, true],
  },
  {
    id: "professional",
    name: "Professional",
    price: 16999,
    tagline: "Be placement ready",
    accent: "#f43f5e",
    highlighted: true,
    included: [true, true, true, true, true, true, true, true, true, true, false, true],
  },
  {
    id: "placement-program",
    name: "Placement Program",
    price: 23575,
    tagline: "Be placement ready",
    accent: "#f59e0b",
    included: [true, true, true, true, true, true, true, true, true, true, true, true],
  },
];

export const PROFESSIONAL_TIERS: ListTier[] = [
  {
    id: "pro-mentor-lead",
    name: "Mentor Lead",
    price: 30600,
    tagline: "Professional Course",
    accent: "#7c3aed",
    features: [
      "Recorded Sessions",
      "Live Sessions",
      "Doubt Clearing Sessions",
      "Mentor Guidance",
      "Document Sessions",
      "Mock Interviews",
      "MNC Certification",
      "Short-term Projects",
      "Mentor-lead Projects",
    ],
  },
  {
    id: "pro-certification",
    name: "Certification Program",
    price: 176500,
    tagline: "Elite Professional Course",
    accent: "#ea580c",
    highlighted: true,
    features: [
      "Recorded Sessions",
      "Live Sessions",
      "Doubt Clearance",
      "Mentor Guidance",
      "Practical Support",
      "Mock Interviews",
      "MNC Certification",
      "Real-time Projects",
      "Dedicated Account Manager",
      "Lifetime Access",
    ],
  },
];

const ALL_PLANS: { id: PlanId; name: string; price: number }[] = [
  ...COURSE_TIERS.map((t) => ({ id: t.id, name: t.name, price: t.price })),
  ...PROFESSIONAL_TIERS.map((t) => ({ id: t.id, name: t.name, price: t.price })),
];

/** Server-side source of truth for a plan's price — never trust the client's amount. */
export function getPlan(id: string) {
  return ALL_PLANS.find((p) => p.id === id);
}

/** The facilities/features a purchased plan unlocks — used on the dashboard + in the enrolment email. */
export function getPlanFeatures(id: string): string[] {
  const matrix = COURSE_TIERS.find((t) => t.id === id);
  if (matrix) return COURSE_FEATURES.filter((_, i) => matrix.included[i]);
  const list = PROFESSIONAL_TIERS.find((t) => t.id === id);
  if (list) return [...list.features];
  return [];
}
