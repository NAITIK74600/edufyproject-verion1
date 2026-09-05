// Bootstraps (or promotes) a Super Admin / Admin account directly in the
// database. There's no UI for this because creating the very first admin
// can't depend on an admin already existing to grant that access.
//
// Usage:
//   npm run admin:create -- <email> <password> ["Full Name"] [role]
//   role defaults to "super_admin"; the only other valid value is "admin".
//
// Example:
//   npm run admin:create -- owner@edufyitechsolutions.in "Str0ngPassw0rd!" "Naitik Raj"
import { scryptSync, randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set (check .env.local). Aborting.");
  process.exit(1);
}

const [, , email, password, fullName = "Super Admin", role = "super_admin"] = process.argv;

if (!email || !password) {
  console.error('Usage: npm run admin:create -- <email> <password> ["Full Name"] [admin|super_admin]');
  process.exit(1);
}
if (!["admin", "super_admin"].includes(role)) {
  console.error('Role must be "admin" or "super_admin".');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

// Same scrypt scheme as src/lib/auth.ts hashPassword — duplicated here since
// this script runs standalone via plain Node (node --env-file=...), outside
// Next's TypeScript build, so it can't import src/lib/auth.ts directly.
function hashPassword(pw) {
  const salt = randomBytes(16);
  const hash = scryptSync(pw, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

const sql = neon(connectionString);
const passwordHash = hashPassword(password);

const existing = await sql`SELECT id FROM users WHERE lower(email) = lower(${email}) LIMIT 1`;

if (existing.length > 0) {
  await sql`UPDATE users SET password_hash = ${passwordHash}, role = ${role}, full_name = ${fullName}
    WHERE id = ${existing[0].id}`;
  console.log(`✓ Existing account promoted to ${role}: ${email}`);
} else {
  await sql`INSERT INTO users (full_name, email, password_hash, role)
    VALUES (${fullName}, ${email}, ${passwordHash}, ${role})`;
  console.log(`✓ Created new ${role} account: ${email}`);
}
console.log("You can now log in at /login with this email and password.");
