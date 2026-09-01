/**
 * AIRA — Edufyi's on-site assistant brain.
 *
 * The site is a static export (see next.config.ts: `output: "export"`), so
 * there is no server to call an LLM through. AIRA is instead a deterministic,
 * zero-dependency intent + keyword-search engine that runs entirely in the
 * browser: it knows every route, every program, and every career path
 * (bundled at build time from ./seed and ./config) and can answer questions
 * or hand back a direct navigation action for the widget to execute.
 */
import { seedPrograms, seedCareerPaths } from "./seed";
import { SITE, careerPathSlug, formatINR } from "./config";
import type { Program } from "./types";

export type AiraAction =
  | { type: "navigate"; href: string }
  | { type: "external"; href: string }
  | { type: "prompt"; text: string };

export type AiraChip = { label: string; action: AiraAction };
export type AiraCard = { title: string; subtitle: string; href: string };

export type AiraReply = {
  text: string;
  chips?: AiraChip[];
  cards?: AiraCard[];
};

const nav = (href: string, label: string): AiraChip => ({ label, action: { type: "navigate", href } });
const prompt = (text: string): AiraChip => ({ label: text, action: { type: "prompt", text } });

const MAIN_MENU: AiraChip[] = [
  nav("/programs", "Explore programs"),
  nav("/career-paths", "Career paths"),
  nav("/success-stories", "Success stories"),
  nav("/contact", "Contact us"),
];

/** Synonym keywords per program category, so "cyber stuff" or "ML course" both resolve. */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "AI/ML": ["ai", "artificial intelligence", "machine learning", "ml", "deep learning", "neural", "llm", "gpt"],
  "Data Science": ["data science", "data analytics", "statistics", "analytics", "data analyst"],
  Cybersecurity: ["cyber", "security", "hacking", "ethical hacking", "pentest", "infosec"],
  HR: ["hr", "human resources", "people ops", "talent", "recruit"],
  "Web Development": ["web dev", "website", "frontend", "backend", "full stack", "fullstack", "react", "node", "javascript"],
  "Cloud & Infrastructure": ["cloud", "devops", "aws", "azure", "infra", "infrastructure", "kubernetes"],
  Design: ["design", "ui", "ux", "figma", "product design"],
  Mobile: ["mobile", "app development", "android", "ios", "react native", "flutter"],
  "Electronics & Hardware": ["electronics", "hardware", "embedded", "iot", "robotics", "vlsi", "chip", "circuit", "ev", "hybrid", "vehicle"],
  "Business & Management": ["business", "management", "product management", "analyst", "operations"],
  Healthcare: ["health", "medical", "coding", "clinical"],
  "Engineering & Design": ["engineering", "cad", "construction", "civil", "autocad"],
  Finance: ["finance", "stock", "market", "trading", "accounting", "investment"],
  "Science & Research": ["science", "research", "biotech", "genetic", "psychology", "microbiology", "nano", "bioinformatics", "lab"],
  Marketing: ["marketing", "digital marketing", "seo", "social media", "ads", "branding"],
};

const STATIC_ROUTES: { patterns: string[]; href: string; label: string }[] = [
  { patterns: ["home", "homepage", "main page"], href: "/", label: "Home" },
  { patterns: ["about", "who are you as a company", "your company", "founders"], href: "/about", label: "About Us" },
  { patterns: ["contact", "reach you", "get in touch", "support"], href: "/contact", label: "Contact" },
  { patterns: ["partner", "college", "companies", "institution", "b2b"], href: "/partners", label: "Colleges & Companies" },
  { patterns: ["success stor", "alumni", "placed student", "testimonial"], href: "/success-stories", label: "Success Stories" },
  { patterns: ["register", "enroll", "enrol", "admission", "apply", "sign up", "signup"], href: "/register", label: "Register Interest" },
  { patterns: ["login", "log in", "sign in"], href: "/login", label: "Login" },
  { patterns: ["employee portal", "employee login"], href: "/employee", label: "Employee Portal" },
  { patterns: ["career path", "job", "career option", "role after"], href: "/career-paths", label: "Career Paths" },
  { patterns: ["program", "course", "curriculum"], href: "/programs", label: "Programs" },
  { patterns: ["privacy"], href: "/legal/privacy", label: "Privacy Policy" },
  { patterns: ["terms"], href: "/legal/terms", label: "Terms" },
];

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s/&]/g, " ").replace(/\s+/g, " ");
}

function scoreMatch(haystack: string, needleTokens: string[]): number {
  const h = normalize(haystack);
  let score = 0;
  for (const t of needleTokens) {
    if (t.length < 2) continue;
    if (h.includes(t)) score += t.length; // longer/more-specific token matches weigh more
  }
  return score;
}

/** Finds programs matching free-text input, ranked by relevance. */
export function searchPrograms(query: string, limit = 3): Program[] {
  const q = normalize(query);
  const tokens = q.split(" ").filter(Boolean);
  const scored = seedPrograms.map((p) => {
    let score = 0;
    score += scoreMatch(p.title, tokens) * 2;
    score += scoreMatch(p.category, tokens) * 2;
    score += scoreMatch(p.tags.join(" "), tokens);
    score += scoreMatch(p.short_desc, tokens) * 0.5;
    const synonyms = CATEGORY_KEYWORDS[p.category] ?? [];
    for (const syn of synonyms) {
      if (q.includes(syn)) score += syn.length * 1.5;
    }
    return { program: p, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.program);
}

function programCard(p: Program): AiraCard {
  return { title: p.title, subtitle: `${p.duration} · ${formatINR(p.price_inr)}`, href: `/programs/${p.slug}` };
}

function findCareerPath(query: string) {
  const q = normalize(query);
  return seedCareerPaths.find((cp) => {
    const domain = normalize(cp.domain);
    if (q.includes(domain)) return true;
    const synonyms = CATEGORY_KEYWORDS[cp.domain] ?? [];
    return synonyms.some((syn) => q.includes(syn));
  });
}

function matchesAny(q: string, patterns: string[]): boolean {
  return patterns.some((p) => q.includes(p));
}

/** Core entry point: given raw user text, returns AIRA's reply. */
export function getAiraReply(rawInput: string): AiraReply {
  const q = normalize(rawInput);

  if (!q) {
    return { text: "I didn't catch that — could you type your question?", chips: MAIN_MENU };
  }

  // Greetings
  if (matchesAny(q, ["hi", "hello", "hey", "namaste", "yo "]) && q.length < 20) {
    return {
      text: `Hey! I'm AIRA, Edufyi's AI guide. I can point you to any program, career path, or page on the site — what are you looking for?`,
      chips: MAIN_MENU,
    };
  }

  // Thanks / bye
  if (matchesAny(q, ["thank", "thanks", "thx"])) {
    return { text: "Anytime! Ping me if you need anything else.", chips: MAIN_MENU };
  }
  if (matchesAny(q, ["bye", "goodbye", "see you"])) {
    return { text: "Good luck! Come back if you have more questions." };
  }

  // Self-identity
  if (matchesAny(q, ["who are you", "what are you", "what can you do", "help"])) {
    return {
      text:
        "I'm AIRA — I can search our programs and career paths, tell you fees and durations, and take you straight to any page on the site. Try asking things like \"cybersecurity fees\" or \"take me to career paths\".",
      chips: MAIN_MENU,
    };
  }

  // WhatsApp / call / email
  if (matchesAny(q, ["whatsapp", "chat on whatsapp"])) {
    return { text: "Opening WhatsApp for you.", chips: [{ label: "Open WhatsApp", action: { type: "external", href: SITE.whatsapp } }] };
  }
  if (matchesAny(q, ["call", "phone number", "phone"])) {
    return { text: `You can reach us at ${SITE.phone}.`, chips: [{ label: `Call ${SITE.phone}`, action: { type: "external", href: `tel:${SITE.phoneHref}` } }] };
  }
  if (matchesAny(q, ["email", "mail id", "e-mail"])) {
    return { text: `Our email is ${SITE.email}.`, chips: [{ label: "Send an email", action: { type: "external", href: `mailto:${SITE.email}` } }] };
  }

  // Placement / outcomes
  if (matchesAny(q, ["placement", "job guarantee", "get a job", "hire"])) {
    return {
      text: "Every program includes mentor-led projects and placement assistance. Explore a career path to see the roles, industries, and salary progression it unlocks.",
      chips: [nav("/career-paths", "See career paths"), nav("/success-stories", "Read success stories")],
    };
  }

  // Fee / price question about a specific program
  if (matchesAny(q, ["fee", "price", "cost", "how much"])) {
    const matches = searchPrograms(q, 3);
    if (matches.length) {
      return {
        text: matches.length === 1
          ? `${matches[0].title} costs ${formatINR(matches[0].price_inr)} for ${matches[0].duration}.`
          : `Here are fees for the closest matches:`,
        cards: matches.map(programCard),
        chips: [nav(`/programs/${matches[0].slug}`, `View ${matches[0].title}`)],
      };
    }
    return { text: "Which program's fee would you like to know? You can browse them all here.", chips: [nav("/programs", "View all programs")] };
  }

  // Duration question
  if (matchesAny(q, ["duration", "how long", "weeks", "how many months"])) {
    const matches = searchPrograms(q, 3);
    if (matches.length) {
      return {
        text: matches.length === 1
          ? `${matches[0].title} runs for ${matches[0].duration}.`
          : `Here's the duration for the closest matches:`,
        cards: matches.map(programCard),
      };
    }
  }

  // Career path lookup
  const careerPath = findCareerPath(q);
  if (careerPath && matchesAny(q, ["career", "role", "job", "salary", "progression", "industr"])) {
    return {
      text: `${careerPath.domain}: ${careerPath.tagline}`,
      chips: [nav(`/career-paths/${careerPathSlug(careerPath.domain)}`, `See ${careerPath.domain} career path`)],
    };
  }

  // Explicit navigation phrasing ("take me to...", "open...", "go to...")
  const wantsNavigation = matchesAny(q, ["take me to", "go to", "open ", "show me", "navigate to"]);
  for (const route of STATIC_ROUTES) {
    if (matchesAny(q, route.patterns)) {
      return {
        text: wantsNavigation ? `Taking you to ${route.label}.` : `Here's the ${route.label} page.`,
        chips: [nav(route.href, `Open ${route.label}`)],
      };
    }
  }

  // Program / category search (broadest net, tried after specific intents)
  const programMatches = searchPrograms(q, 3);
  if (programMatches.length) {
    return {
      text: programMatches.length === 1
        ? `Found it — ${programMatches[0].title}.`
        : `Found a few programs that match "${rawInput.trim()}":`,
      cards: programMatches.map(programCard),
    };
  }

  // Nothing matched
  return {
    text: `I couldn't find anything for "${rawInput.trim()}". Try a program name, a category like "cybersecurity" or "web development", or ask me to open a page.`,
    chips: MAIN_MENU,
  };
}

/** Starter prompts shown the first time the chat opens. */
export const AIRA_STARTERS: AiraChip[] = [
  prompt("What programs do you offer?"),
  prompt("Cybersecurity course fees"),
  prompt("Take me to career paths"),
  prompt("How do I contact you?"),
];
