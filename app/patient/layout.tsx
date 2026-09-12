import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/portal-shell";

const NAV = [
  { href: "/patient/dashboard", label: "Dashboard" },
  { href: "/patient/appointments", label: "Appointments" },
  { href: "/patient/records", label: "Consultations" },
  { href: "/patient/prescriptions", label: "Prescriptions" },
  { href: "/patient/profile", label: "My details" },
];

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole("PATIENT");
  return (
    <PortalShell roleLabel="Patient" userName={`${profile.firstName} ${profile.lastName}`} nav={NAV}>
      {children}
    </PortalShell>
  );
}
