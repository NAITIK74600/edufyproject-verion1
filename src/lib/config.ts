export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Prefix for files in /public when deployed under a GitHub Pages project path.
// next/link and next/image handle basePath automatically, but raw asset URLs
// (<video src>, <source>, CSS background url, poster) do not — use withBase for those.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const withBase = (path: string) => `${BASE_PATH}${path}`;

// URL slug for a career-path domain, e.g. "AI/ML" → "ai-ml", "Data Science" → "data-science".
export const careerPathSlug = (domain: string) =>
  domain
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Related program slug for each career-path domain, used to link a path to its program.
export const careerPathProgramSlug: Record<string, string> = {
  "AI/ML": "ai-ml",
  "Data Science": "data-science-ml",
  Cybersecurity: "cybersecurity-essentials",
  HR: "hr-management",
};

export const SITE = {
  name: "Edufyi Tech Solutions",
  shortName: "Edufyi",
  parentCompany: "Elythra Edufyi Tech Solutions Pvt Ltd",
  tagline: "Transforming Education into Opportunity",
  heroTagline: "Learn. Build. Get Placed.",
  email: "edufyi@edufyitechsolutions.in",
  phone: "+91 63632 09993",
  phoneHref: "+916363209993",
  whatsapp: "https://wa.me/6363209993",
  location: "Bengaluru & Ernakulam, India",
  linkedin: "https://www.linkedin.com/company/edufyi-tech-solutions/",
  instagram: "https://www.instagram.com/edufyi_tech_solutions",
};

export const BRANCHES = [
  {
    label: "Bengaluru (HQ)",
    address:
      "Third Floor, 7 Hills, #424, 10th Cross, 27th Main, Sector 1, HSR Layout, Bengaluru, Karnataka 560102",
  },
  {
    label: "Ernakulam",
    address:
      "Liju Mahal, ARA 10, Building No. 41/2053-A, First Floor, Village Office Road, Alinchuvadu, Vennala, Ernakulam, Kerala 682028",
  },
];

export const FOUNDERS = [
  { name: "D. Jagadish Babu", role: "Founder & Director" },
  { name: "G. Venkata Avinash", role: "Founder & Director" },
  { name: "M. Raja", role: "Founder & Director" },
  { name: "D. Manjula", role: "Founder & Director" },
];

export type NavChild = { href: string; label: string; badge?: string };
export type NavItem = { href?: string; label: string; children?: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Programs",
    href: "/programs",
    children: [
      { href: "/programs/ai-ml", label: "AI & Machine Learning" },
      { href: "/programs/data-science-ml", label: "Data Science & ML" },
      { href: "/programs/cybersecurity-essentials", label: "Cybersecurity Essentials" },
      { href: "/programs/hr-management", label: "HR Management & Analytics" },
      { href: "/programs", label: "View all programs" },
    ],
  },
  {
    label: "Software",
    children: [
      { href: "/employee", label: "Employee Portal", badge: "Coming soon" },
      { href: "/aira", label: "AIRA", badge: "Coming soon" },
    ],
  },
  { href: "/partners", label: "Colleges & Companies" },
  { href: "/jobs", label: "Jobs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
