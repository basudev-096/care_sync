import Link from "next/link";
import { CalendarPlus, FileText, Pill, UserCog } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PageHeader,
  Panel,
  EmptyState,
  StatusBadge,
  formatDateTime,
} from "@/components/ui-kit";

export const metadata = { title: "Dashboard" };

const QUICK_ACTIONS = [
  { href: "/patient/appointments", label: "Request a consultation", icon: CalendarPlus },
  { href: "/patient/records", label: "View consultations", icon: FileText },
  { href: "/patient/prescriptions", label: "Prescriptions", icon: Pill },
  { href: "/patient/profile", label: "Update my details", icon: UserCog },
];

export default async function PatientDashboard() {
  const { profile } = await requireRole("PATIENT");

  // WBS 2.4.1 / 6.1.1 - upcoming visits only. No statistics or graphs by design.
  const upcoming = await prisma.appointment.findMany({
    where: {
      patientId: profile.id,
      status: { in: ["PENDING", "SCHEDULED", "ACCEPTED", "CHECKED_IN"] },
    },
    include: { physician: true },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  return (
    <>
      <PageHeader
        eyebrow="Patient portal"
        title={`Welcome back, ${profile.firstName}`}
        description="Your upcoming visits and the things you can do right now."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] items-start">
        <Panel title="Upcoming visits" bodyClassName="">
          {upcoming.length === 0 ? (
            <EmptyState
              title="No upcoming visits"
              hint="Request a consultation and reception will assign you a time."
            />
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((a) => (
                <li key={a.id} className="px-5 py-4 flex flex-wrap gap-3 items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium tnum">
                      {a.date ? formatDateTime(a.date) : "Awaiting a date from reception"}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{a.reason}</p>
                    {a.physician ? (
                      <p className="mt-0.5 text-[13px] text-muted-foreground">
                        Dr {a.physician.firstName} {a.physician.lastName}
                      </p>
                    ) : null}
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Quick actions" bodyClassName="p-2.5">
          <ul className="space-y-0.5">
            {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-2.5 px-2.5 h-10 rounded-md text-[14px] hover:bg-muted transition-colors"
                >
                  <Icon className="size-4 text-muted-foreground" strokeWidth={2} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
