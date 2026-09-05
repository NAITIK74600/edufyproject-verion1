import type { Metadata } from "next";
import { getContactLeads, getB2BLeads, getRegisterInterestLeads } from "@/lib/db";
import { LeadsPanel } from "./LeadsPanel";

export const metadata: Metadata = { title: "Admin · Leads" };

export default async function AdminLeadsPage() {
  const [contact, b2b, register] = await Promise.all([
    getContactLeads(),
    getB2BLeads(),
    getRegisterInterestLeads(),
  ]);

  return <LeadsPanel initialContact={contact} initialB2B={b2b} initialRegister={register} />;
}
