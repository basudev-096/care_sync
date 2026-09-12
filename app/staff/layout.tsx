import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/portal-shell";

const NAV = [
  { href: "/staff/dashboard", label: "Dashboard" },
  { href: "/staff/schedule", label: "Schedule" },
  { href: "/staff/patients", label: "Patients" },
  { href: "/staff/consultations", label: "Consultations" },
  { href: "/staff/prescriptions", label: "Prescriptions" },
  { href: "/staff/reports", label: "Reports" },
  { href: "/staff/accounts", label: "Accounts" },
];

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole("STAFF");
  return (
    <PortalShell
      roleLabel="Clinic staff"
      userName={`${profile.firstName} ${profile.lastName}`}
      nav={NAV}
    >
      {children}
    </PortalShell>
  );
}
