import nodemailer from "nodemailer";
import { SITE } from "./config";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SMTP_USER;
const PARTNERSHIPS_EMAIL = process.env.PARTNERSHIPS_EMAIL || ADMIN_EMAIL;

export const mailEnabled = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

// Absolute base URL for links in emails (login button, etc.).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://edufyitechsolutions.in").replace(/\/$/, "");

// Lazily created so the module can be imported even when SMTP isn't configured yet.
let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;
function getTransporter() {
  if (!mailEnabled) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

/** Sends one email; never throws — logs and returns false on failure so a
 *  workflow step never blocks the rest of the automation. */
async function sendMail(opts: { to: string; subject: string; html: string }): Promise<boolean> {
  const t = getTransporter();
  if (!t) return false;
  try {
    await t.sendMail({
      from: `"${SITE.name}" <${SMTP_FROM}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    return true;
  } catch (err) {
    console.error("[mail] send failed:", err);
    return false;
  }
}

/** Shared, email-client-safe (inline styles, no external CSS) branded layout. */
function layout(title: string, bodyHtml: string): string {
  return `
  <div style="background:#f8fbfc;padding:32px 16px;font-family:'Plus Jakarta Sans',Segoe UI,Roboto,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6eef2;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#006bbf,#24c5db);padding:24px 28px;">
        <span style="color:#fff;font-size:20px;font-weight:700;">Edufyi<span style="opacity:.85;">Tech</span></span>
      </div>
      <div style="padding:28px;color:#102a36;">
        <h1 style="margin:0 0 16px;font-size:20px;color:#102a36;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:20px 28px;border-top:1px solid #e6eef2;color:#607d89;font-size:12px;">
        <p style="margin:0 0 4px;">${SITE.parentCompany}</p>
        <p style="margin:0;">${SITE.email} · ${SITE.phone}</p>
      </div>
    </div>
  </div>`;
}

function row(label: string, value?: string | null) {
  if (!value) return "";
  return `<p style="margin:0 0 8px;font-size:14px;"><strong style="color:#607d89;">${label}:</strong> ${value}</p>`;
}

// ---------------------------------------------------------------------------
// Workflow: Register Interest — confirmation to learner + alert to admin
// ---------------------------------------------------------------------------
export async function notifyRegisterInterest(data: {
  program_title: string;
  full_name: string;
  email: string;
  phone: string;
  discount_code?: string;
  message?: string;
}): Promise<{ userSent: boolean; adminSent: boolean }> {
  const userHtml = layout(
    "We've received your interest! 🎉",
    `<p style="font-size:14px;line-height:1.6;">Hi ${data.full_name},</p>
     <p style="font-size:14px;line-height:1.6;">Thanks for registering your interest in
     <strong style="color:#006bbf;">${data.program_title}</strong>. Our admissions team will
     reach out to you shortly at <strong>${data.phone}</strong> to walk you through curriculum,
     fees, and scholarships.</p>
     <p style="font-size:14px;line-height:1.6;">No payment is required at this stage.</p>`
  );

  const adminHtml = layout(
    "New Register Interest lead",
    `${row("Program", data.program_title)}
     ${row("Name", data.full_name)}
     ${row("Email", data.email)}
     ${row("Phone", data.phone)}
     ${row("Discount code", data.discount_code)}
     ${row("Message", data.message)}`
  );

  const [userSent, adminSent] = await Promise.all([
    sendMail({ to: data.email, subject: `You're on the list for ${data.program_title}`, html: userHtml }),
    sendMail({ to: process.env.ADMIN_EMAIL || SMTP_USER || "", subject: `New lead: ${data.full_name} — ${data.program_title}`, html: adminHtml }),
  ]);
  return { userSent, adminSent };
}

// ---------------------------------------------------------------------------
// Workflow: Contact — confirmation to sender + alert to admin
// ---------------------------------------------------------------------------
export async function notifyContact(data: {
  full_name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<{ userSent: boolean; adminSent: boolean }> {
  const userHtml = layout(
    "Thanks for reaching out!",
    `<p style="font-size:14px;line-height:1.6;">Hi ${data.full_name},</p>
     <p style="font-size:14px;line-height:1.6;">We've received your message and our team will
     get back to you soon.</p>
     <blockquote style="margin:16px 0;padding:12px 16px;background:#f8fbfc;border-left:3px solid #006bbf;border-radius:8px;font-size:14px;color:#102a36;">${data.message}</blockquote>`
  );

  const adminHtml = layout(
    "New contact form submission",
    `${row("Name", data.full_name)}
     ${row("Email", data.email)}
     ${row("Phone", data.phone)}
     ${row("Subject", data.subject)}
     ${row("Message", data.message)}`
  );

  const [userSent, adminSent] = await Promise.all([
    sendMail({ to: data.email, subject: "We've received your message", html: userHtml }),
    sendMail({ to: process.env.ADMIN_EMAIL || SMTP_USER || "", subject: `New contact message from ${data.full_name}`, html: adminHtml }),
  ]);
  return { userSent, adminSent };
}

// ---------------------------------------------------------------------------
// Workflow: B2B inquiry — confirmation to contact + alert to partnerships inbox
// ---------------------------------------------------------------------------
export async function notifyB2B(data: {
  org_name: string;
  org_type: string;
  contact_name: string;
  email: string;
  phone?: string;
  interest?: string;
  message: string;
}): Promise<{ userSent: boolean; adminSent: boolean }> {
  const userHtml = layout(
    "We've received your partnership inquiry",
    `<p style="font-size:14px;line-height:1.6;">Hi ${data.contact_name},</p>
     <p style="font-size:14px;line-height:1.6;">Thanks for reaching out on behalf of
     <strong style="color:#006bbf;">${data.org_name}</strong>. Our partnerships team will
     respond within two business days.</p>`
  );

  const adminHtml = layout(
    "New partnership inquiry (B2B)",
    `${row("Organization", data.org_name)}
     ${row("Type", data.org_type)}
     ${row("Contact", data.contact_name)}
     ${row("Email", data.email)}
     ${row("Phone", data.phone)}
     ${row("Interest", data.interest)}
     ${row("Message", data.message)}`
  );

  const [userSent, adminSent] = await Promise.all([
    sendMail({ to: data.email, subject: "Your partnership inquiry — Edufyi Tech Solutions", html: userHtml }),
    sendMail({ to: PARTNERSHIPS_EMAIL || "", subject: `New B2B inquiry: ${data.org_name}`, html: adminHtml }),
  ]);
  return { userSent, adminSent };
}

// ---------------------------------------------------------------------------
// Workflow: Enrolment — payment confirmation + (for a brand-new account) the
// auto-generated login credentials, so a first-time buyer can sign in and
// access their plan.
// ---------------------------------------------------------------------------
export async function notifyEnrollment(data: {
  full_name: string;
  email: string;
  plan_name: string;
  course_title?: string | null;
  amount_inr: number;
  features: string[];
  /** Present only when a new account was created during checkout. */
  generatedPassword?: string;
}): Promise<{ userSent: boolean; adminSent: boolean }> {
  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(data.amount_inr);

  const facilities = data.features.length
    ? `<p style="margin:16px 0 6px;font-size:14px;font-weight:600;color:#102a36;">What's now unlocked for you:</p>
       <ul style="margin:0 0 8px;padding-left:18px;font-size:14px;line-height:1.7;color:#102a36;">
         ${data.features.map((f) => `<li>${f}</li>`).join("")}
       </ul>`
    : "";

  const credentials = data.generatedPassword
    ? `<div style="margin:20px 0;padding:16px;background:#f8fbfc;border:1px solid #d7e6ec;border-radius:12px;">
         <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#102a36;">Your login details</p>
         <p style="margin:0 0 4px;font-size:14px;">Email: <strong>${data.email}</strong></p>
         <p style="margin:0 0 10px;font-size:14px;">Temporary password: <strong>${data.generatedPassword}</strong></p>
         <a href="${SITE_URL}/login" style="display:inline-block;background:linear-gradient(135deg,#006bbf,#24c5db);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 18px;border-radius:10px;">Log in to your dashboard</a>
         <p style="margin:10px 0 0;font-size:12px;color:#607d89;">Please change this password after your first login.</p>
       </div>`
    : `<p style="margin:16px 0;font-size:14px;">Log in any time to access your dashboard: <a href="${SITE_URL}/login" style="color:#006bbf;">${SITE_URL}/login</a></p>`;

  const userHtml = layout(
    "Payment successful — you're enrolled! 🎉",
    `<p style="font-size:14px;line-height:1.6;">Hi ${data.full_name},</p>
     <p style="font-size:14px;line-height:1.6;">Thank you! We've received your payment of
     <strong>${amount}</strong> for the <strong style="color:#006bbf;">${data.plan_name}</strong> plan${
       data.course_title ? ` (${data.course_title})` : ""
     }. Your access is active immediately.</p>
     ${facilities}
     ${credentials}`
  );

  const adminHtml = layout(
    "New enrolment (paid)",
    `${row("Name", data.full_name)}
     ${row("Email", data.email)}
     ${row("Plan", data.plan_name)}
     ${row("Course", data.course_title)}
     ${row("Amount", amount)}`
  );

  const [userSent, adminSent] = await Promise.all([
    sendMail({ to: data.email, subject: `You're enrolled — ${data.plan_name}`, html: userHtml }),
    sendMail({ to: process.env.ADMIN_EMAIL || SMTP_USER || "", subject: `New paid enrolment: ${data.full_name} — ${data.plan_name}`, html: adminHtml }),
  ]);
  return { userSent, adminSent };
}
