import { neon } from "@neondatabase/serverless";
import { cache } from "react";
import type {
  Program,
  Testimonial,
  CareerPath,
  SuccessStory,
} from "./types";
import {
  seedPrograms,
  seedTestimonials,
  seedCareerPaths,
  seedSuccessStories,
} from "./seed";

const connectionString = process.env.DATABASE_URL;

export const dbEnabled = Boolean(connectionString);

const sql = connectionString ? neon(connectionString) : null;

// Read helpers are wrapped in React's `cache()` so that multiple calls for the
// same data within a single request/render (e.g. a page body + its
// generateMetadata both calling getProgram) collapse into ONE database query.
// Combined with per-page ISR (`export const revalidate`), the database is hit
// at most once per revalidation window instead of once per visitor — the key
// to serving 10k+ concurrent users cheaply.
export const getPrograms = cache(async (): Promise<Program[]> => {
  if (!sql) return seedPrograms;
  try {
    return (await sql`SELECT * FROM courses ORDER BY is_featured DESC, rating DESC`) as Program[];
  } catch {
    return seedPrograms;
  }
});

export const getFeaturedPrograms = cache(async (): Promise<Program[]> => {
  const programs = await getPrograms();
  const featured = programs.filter((p) => p.is_featured);
  return featured.length ? featured : programs.slice(0, 4);
});

export const getProgram = cache(async (slug: string): Promise<Program | null> => {
  if (!sql) return seedPrograms.find((p) => p.slug === slug) ?? null;
  try {
    const rows = (await sql`SELECT * FROM courses WHERE slug = ${slug} LIMIT 1`) as Program[];
    return rows[0] ?? seedPrograms.find((p) => p.slug === slug) ?? null;
  } catch {
    return seedPrograms.find((p) => p.slug === slug) ?? null;
  }
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  if (!sql) return seedTestimonials;
  try {
    return (await sql`SELECT * FROM testimonials ORDER BY id`) as Testimonial[];
  } catch {
    return seedTestimonials;
  }
});

export const getCareerPaths = cache(async (): Promise<CareerPath[]> => {
  if (!sql) return seedCareerPaths;
  try {
    return (await sql`SELECT * FROM career_paths ORDER BY id`) as CareerPath[];
  } catch {
    return seedCareerPaths;
  }
});

export const getSuccessStories = cache(async (): Promise<SuccessStory[]> => {
  if (!sql) return seedSuccessStories;
  try {
    return (await sql`SELECT * FROM success_stories ORDER BY id`) as SuccessStory[];
  } catch {
    return seedSuccessStories;
  }
});

export async function insertRegisterInterest(data: {
  program_slug: string;
  full_name: string;
  email: string;
  phone: string;
  discount_code?: string;
  message?: string;
}) {
  if (!sql) throw new Error("DATABASE_NOT_CONFIGURED");
  await sql`INSERT INTO register_interest (program_slug, full_name, email, phone, discount_code, message)
    VALUES (${data.program_slug}, ${data.full_name}, ${data.email}, ${data.phone}, ${data.discount_code ?? null}, ${data.message ?? null})`;
}

export async function insertContactLead(data: {
  full_name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  if (!sql) throw new Error("DATABASE_NOT_CONFIGURED");
  await sql`INSERT INTO contact_leads (full_name, email, phone, subject, message)
    VALUES (${data.full_name}, ${data.email}, ${data.phone ?? null}, ${data.subject ?? null}, ${data.message})`;
}

export async function insertB2BLead(data: {
  org_name: string;
  org_type: string;
  contact_name: string;
  email: string;
  phone?: string;
  interest?: string;
  message: string;
}) {
  if (!sql) throw new Error("DATABASE_NOT_CONFIGURED");
  await sql`INSERT INTO b2b_leads (org_name, org_type, contact_name, email, phone, interest, message)
    VALUES (${data.org_name}, ${data.org_type}, ${data.contact_name}, ${data.email}, ${data.phone ?? null}, ${data.interest ?? null}, ${data.message})`;
}

// ---------------------------------------------------------------------------
// Accounts — real login/registration backend (see src/lib/auth.ts for the
// password hashing + session token helpers used alongside these).
// ---------------------------------------------------------------------------
export type UserRecord = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  created_at: string;
};

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  if (!sql) throw new Error("DATABASE_NOT_CONFIGURED");
  const rows = (await sql`SELECT * FROM users WHERE lower(email) = lower(${email}) LIMIT 1`) as UserRecord[];
  return rows[0] ?? null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  if (!sql) throw new Error("DATABASE_NOT_CONFIGURED");
  const rows = (await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`) as UserRecord[];
  return rows[0] ?? null;
}

export async function createUser(data: {
  full_name: string;
  email: string;
  phone?: string;
  password_hash: string;
}): Promise<UserRecord> {
  if (!sql) throw new Error("DATABASE_NOT_CONFIGURED");
  const rows = (await sql`INSERT INTO users (full_name, email, phone, password_hash)
    VALUES (${data.full_name}, ${data.email}, ${data.phone ?? null}, ${data.password_hash})
    RETURNING *`) as UserRecord[];
  return rows[0];
}

// ---------------------------------------------------------------------------
// Enrolments — created after a verified Razorpay payment.
// ---------------------------------------------------------------------------
export type EnrollmentRecord = {
  id: string;
  user_id: string;
  course_slug: string | null;
  course_title: string | null;
  plan_id: string;
  plan_name: string;
  amount_inr: number;
  order_id: string | null;
  payment_id: string | null;
  created_at: string;
};

export async function insertEnrollment(data: {
  user_id: string;
  course_slug?: string | null;
  course_title?: string | null;
  plan_id: string;
  plan_name: string;
  amount_inr: number;
  order_id?: string | null;
  payment_id?: string | null;
}): Promise<EnrollmentRecord> {
  if (!sql) throw new Error("DATABASE_NOT_CONFIGURED");
  const rows = (await sql`INSERT INTO enrollments
    (user_id, course_slug, course_title, plan_id, plan_name, amount_inr, order_id, payment_id)
    VALUES (${data.user_id}, ${data.course_slug ?? null}, ${data.course_title ?? null},
      ${data.plan_id}, ${data.plan_name}, ${data.amount_inr}, ${data.order_id ?? null}, ${data.payment_id ?? null})
    RETURNING *`) as EnrollmentRecord[];
  return rows[0];
}

export async function getEnrollmentsByUserId(userId: string): Promise<EnrollmentRecord[]> {
  if (!sql) return [];
  try {
    return (await sql`SELECT * FROM enrollments WHERE user_id = ${userId} ORDER BY created_at DESC`) as EnrollmentRecord[];
  } catch {
    return [];
  }
}

