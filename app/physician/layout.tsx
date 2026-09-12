import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/portal-shell";

const NAV = [
  { href: "/physician/dashboard", label: "Today" },
  { href: "/physician/patients", label: "Patients" },
];

export default async function PhysicianLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole("PHYSICIAN");
  return (
    <PortalShell
      roleLabel="Physician"
      userName={`Dr ${profile.firstName} ${profile.lastName}`}
      nav={NAV}
    >
      {children}
    </PortalShell>
  );
}
