export type Project = { title: string; desc: string };
export type Mentor = { name: string; role: string; bio: string };

/** A Program (stored in the `courses` table). */
export type Program = {
  slug: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  price_inr: number;
  rating: number;
  short_desc: string;
  description: string;
  syllabus: string[];
  tags: string[];
  image_url: string | null;
  is_featured: boolean;
  projects: Project[];
  mentors: Mentor[];
  tools: string[];
  outcomes: string[];
};

export type Testimonial = {
  name: string;
  role: string;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number;
};

export type CareerRole = { title: string; desc: string };
export type ProgressionStep = { stage: string; years: string };
export type CareerPath = {
  domain: string;
  tagline: string;
  roles: CareerRole[];
  industries: string[];
  progression: ProgressionStep[];
};

export type SuccessStory = {
  name: string;
  program: string;
  domain: string;
  outcome: string;
  quote: string;
  linkedin_url: string | null;
  company: string | null;
  avatar_url: string | null;
};
