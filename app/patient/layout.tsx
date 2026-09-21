import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/portal-shell";

const NAV = [
  { href: "/patient/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/patient/appointments", label: "Appointments", icon: "calendar", section: "Care" },
  { href: "/patient/records", label: "Consultations", icon: "notes", section: "Care" },
  { href: "/patient/prescriptions", label: "Prescriptions", icon: "pill", section: "Care" },
  { href: "/patient/profile", label: "My details", icon: "accounts", section: "Account" },
];

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole("PATIENT");
  return (
    <PortalShell roleLabel="Patient" userName={`${profile.firstName} ${profile.lastName}`} nav={NAV}>
      {children}
    </PortalShell>
  );
}
