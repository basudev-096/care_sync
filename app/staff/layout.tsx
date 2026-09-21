import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/portal-shell";

const NAV = [
  { href: "/staff/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/staff/schedule", label: "Schedule", icon: "calendar", section: "Front desk" },
  { href: "/staff/patients", label: "Patients", icon: "users", section: "Front desk" },
  { href: "/staff/consultations", label: "Consultations", icon: "notes", section: "Records" },
  { href: "/staff/prescriptions", label: "Prescriptions", icon: "pill", section: "Records" },
  { href: "/staff/reports", label: "Reports", icon: "reports", section: "Administration" },
  { href: "/staff/accounts", label: "Accounts", icon: "accounts", section: "Administration" },
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
