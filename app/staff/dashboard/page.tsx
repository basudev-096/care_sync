import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PageHeader,
  Panel,
  EmptyState,
  StatusBadge,
  LinkButton,
  formatTime,
  formatDate,
} from "@/components/ui-kit";
import { AssignForm, StatusButton } from "../schedule/forms";

export const metadata = { title: "Dashboard · CareClinic" };

export default async function StaffDashboard() {
  await requireRole("STAFF");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const [todays, pending, physicians] = await Promise.all([
    // WBS 6.3.1 - daily check-in view.
    prisma.appointment.findMany({
      where: {
        date: { gte: startOfDay, lt: endOfDay },
        status: { in: ["SCHEDULED", "ACCEPTED", "CHECKED_IN"] },
      },
      include: { patient: true, physician: true },
      orderBy: { date: "asc" },
    }),
    // WBS 3.2.1 / 6.3.2 - pending requests waiting for a slot.
    prisma.appointment.findMany({
      where: { status: "PENDING" },
      include: { patient: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.physicianProfile.findMany({ orderBy: { lastName: "asc" } }),
  ]);

  const physicianOptions = physicians.map((p) => ({
    id: p.id,
    label: `Dr ${p.firstName} ${p.lastName}`,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Reception"
        title="Today at the clinic"
        description="Check patients in as they arrive, and assign times to new consultation requests."
        actions={<LinkButton href="/staff/schedule">Full schedule</LinkButton>}
      />

      <div className="space-y-6">
        <Panel title="Arrivals today" description={formatDate(startOfDay)} bodyClassName="">
          {todays.length === 0 ? (
            <EmptyState title="Nothing booked for today" />
          ) : (
            <ul className="divide-y divide-border">
              {todays.map((a) => (
                <li key={a.id} className="px-5 py-3.5 flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-[14px] font-medium tnum w-14 shrink-0">
                      {formatTime(a.date)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium">
                        {a.patient.firstName} {a.patient.lastName}
                      </p>
                      <p className="mt-0.5 text-[13px] text-muted-foreground">
                        {a.physician
                          ? `Dr ${a.physician.firstName} ${a.physician.lastName}`
                          : "No physician assigned"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={a.status} />
                    {/* WBS 3.4.2 / 3.4.3 */}
                    {a.status !== "CHECKED_IN" ? (
                      <StatusButton appointmentId={a.id} status="CHECKED_IN" label="Check in" variant="secondary" />
                    ) : null}
                    <StatusButton appointmentId={a.id} status="NO_SHOW" label="No show" variant="ghost" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Consultation requests"
          description="Patients waiting for a date and time."
          bodyClassName=""
        >
          {pending.length === 0 ? (
            <EmptyState title="No pending requests" />
          ) : (
            <ul className="divide-y divide-border">
              {pending.map((a) => (
                <li key={a.id} className="px-5 py-4">
                  <div className="flex flex-wrap gap-2 items-baseline justify-between">
                    <p className="text-[14px] font-medium">
                      {a.patient.firstName} {a.patient.lastName}
                    </p>
                    <p className="text-[13px] text-muted-foreground tnum">
                      Requested {formatDate(a.createdAt)}
                    </p>
                  </div>
                  <p className="mt-1 text-[13px] text-muted-foreground">{a.reason}</p>
                  <div className="mt-3">
                    {/* WBS 3.2.2 */}
                    <AssignForm appointmentId={a.id} physicians={physicianOptions} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
