import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProvisionForm } from "./form";

export const metadata = { title: "Clinic accounts" };

export default async function AccountsPage() {
  // Layer 2: role authorization, re-checked on this page and again inside the
  // server action it renders.
  await requireRole("STAFF");

  const [physicians, staff] = await Promise.all([
    prisma.physicianProfile.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.staffProfile.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow mb-1.5">Access management</p>
        <h1 className="text-[22px] font-semibold tracking-tight">Clinic accounts</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground max-w-[62ch]">
          Physician and staff accounts are issued here. Patients register themselves and never appear on this page.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] items-start">
        <section className="panel-raised p-5">
          <h2 className="text-[15px] font-semibold tracking-tight">Issue an account</h2>
          <p className="mt-1 mb-5 text-[13px] text-muted-foreground">
            The person signs in with this email and temporary password.
          </p>
          <ProvisionForm />
        </section>

        <div className="space-y-6">
          <RosterTable
            title="Physicians"
            empty="No physician accounts yet."
            rows={physicians.map((d) => ({
              id: d.id,
              name: `${d.firstName} ${d.lastName}`,
              email: d.email,
              meta: d.specialty ?? "—",
            }))}
            metaLabel="Specialty"
          />
          <RosterTable
            title="Clinic staff"
            empty="No staff accounts yet."
            rows={staff.map((s) => ({
              id: s.id,
              name: `${s.firstName} ${s.lastName}`,
              email: s.email,
              meta: new Date(s.createdAt).toLocaleDateString(),
            }))}
            metaLabel="Added"
          />
        </div>
      </div>
    </div>
  );
}

function RosterTable({
  title,
  rows,
  metaLabel,
  empty,
}: {
  title: string;
  rows: { id: string; name: string; email: string; meta: string }[];
  metaLabel: string;
  empty: string;
}) {
  return (
    <section className="panel-raised overflow-hidden">
      <div className="flex items-baseline justify-between px-5 py-3.5 border-b border-border">
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        <span className="text-[13px] text-muted-foreground tnum">{rows.length}</span>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-8 text-[13px] text-muted-foreground text-center">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="font-medium px-5 py-2.5 text-[12px]">Name</th>
                <th className="font-medium px-5 py-2.5 text-[12px]">Email</th>
                <th className="font-medium px-5 py-2.5 text-[12px]">{metaLabel}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{r.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.meta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
