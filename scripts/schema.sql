-- Edufyi Tech Solutions — Neon Postgres schema.
-- Idempotent: safe to run repeatedly (CREATE TABLE IF NOT EXISTS).
-- Run with: npm run db:migrate

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- provides gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Content tables (read by src/lib/db.ts; app falls back to seed data in
-- src/lib/seed.ts if these are empty or DATABASE_URL isn't set).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  slug          text PRIMARY KEY,
  title         text NOT NULL,
  category      text NOT NULL,
  level         text NOT NULL,
  duration      text NOT NULL,
  price_inr     integer NOT NULL,
  rating        numeric(2,1) NOT NULL DEFAULT 4.5,
  short_desc    text NOT NULL,
  description   text NOT NULL,
  syllabus      jsonb NOT NULL DEFAULT '[]',
  tags          jsonb NOT NULL DEFAULT '[]',
  image_url     text,
  is_featured   boolean NOT NULL DEFAULT false,
  projects      jsonb NOT NULL DEFAULT '[]',
  mentors       jsonb NOT NULL DEFAULT '[]',
  tools         jsonb NOT NULL DEFAULT '[]',
  outcomes      jsonb NOT NULL DEFAULT '[]',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id          serial PRIMARY KEY,
  name        text NOT NULL,
  role        text NOT NULL,
  company     text,
  quote       text NOT NULL,
  avatar_url  text,
  rating      numeric(2,1) NOT NULL DEFAULT 5
);

CREATE TABLE IF NOT EXISTS career_paths (
  id            serial PRIMARY KEY,
  domain        text NOT NULL UNIQUE,
  tagline       text NOT NULL,
  roles         jsonb NOT NULL DEFAULT '[]',
  industries    jsonb NOT NULL DEFAULT '[]',
  progression   jsonb NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS success_stories (
  id            serial PRIMARY KEY,
  name          text NOT NULL,
  program       text NOT NULL,
  domain        text NOT NULL,
  outcome       text NOT NULL,
  quote         text NOT NULL,
  linkedin_url  text,
  company       text,
  avatar_url    text
);

-- ---------------------------------------------------------------------------
-- Lead-capture tables (written by the /api/* route handlers).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS register_interest (
  id              serial PRIMARY KEY,
  program_slug    text NOT NULL,
  full_name       text NOT NULL,
  email           text NOT NULL,
  phone           text NOT NULL,
  discount_code   text,
  message         text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_leads (
  id          serial PRIMARY KEY,
  full_name   text NOT NULL,
  email       text NOT NULL,
  phone       text,
  subject     text,
  message     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS b2b_leads (
  id            serial PRIMARY KEY,
  org_name      text NOT NULL,
  org_type      text NOT NULL,
  contact_name  text NOT NULL,
  email         text NOT NULL,
  phone         text,
  interest      text,
  message       text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Accounts (real login/registration backend — see src/lib/auth.ts).
-- Passwords are never stored in plain text: password_hash is
-- "<scrypt-salt-hex>:<scrypt-hash-hex>" produced by src/lib/auth.ts.
--
-- role: 'student' (default, self-registers via payment) | 'admin' | 'super_admin'.
-- ponytail: role is plain text, not a CHECK constraint or enum — validated by
-- the app's UserRole TypeScript union instead. Upgrade to a CHECK constraint
-- if this table is ever written to outside the app.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name      text NOT NULL,
  email          text NOT NULL UNIQUE,
  phone          text,
  password_hash  text NOT NULL,
  role           text NOT NULL DEFAULT 'student',
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Idempotent for databases migrated before the role column existed.
ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student';

CREATE INDEX IF NOT EXISTS users_email_idx ON users (lower(email));
CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);

-- ---------------------------------------------------------------------------
-- Enrolments (written after a successful Razorpay payment — see
-- src/app/api/payment/verify/route.ts). One row per purchased plan; grants the
-- student dashboard access to that plan's facilities.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug   text,
  course_title  text,
  plan_id       text NOT NULL,
  plan_name     text NOT NULL,
  amount_inr    integer NOT NULL,
  order_id      text,
  payment_id    text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enrollments_user_idx ON enrollments (user_id);
