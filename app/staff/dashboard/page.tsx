import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Toolbar,
  Panel,
  EmptyState,
  StatusBadge,
  Avatar,
  Stat,
  StatStrip,
  LinkButton,
  formatTime,
  formatDate,
} from "@/components/ui-kit";
import { AssignForm, StatusButton } from "../schedule/forms";

export const metadata = { title: "Dashboard" };

export default async function StaffDashboard() {
  await requireRole("STAFF");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const [todays, pending, physicians, checkedIn] = await Promise.all([
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
    prisma.appointment.count({
      where: { date: { gte: startOfDay, lt: endOfDay }, status: "CHECKED_IN" },
    }),
  ]);

  const physicianOptions = physicians.map((p) => ({
    id: p.id,
    label: `Dr ${p.firstName} ${p.lastName}`,
  }));

  return (
    <>
      <Toolbar title="Today at the clinic" meta={formatDate(startOfDay)}>
        <LinkButton href="/staff/schedule">Full schedule</LinkButton>
      </Toolbar>

      <StatStrip>
        <Stat label="Expected today" value={todays.length} hint="Confirmed and offered slots" />
        <Stat label="Checked in" value={checkedIn} hint="Currently in the waiting room" />
        <Stat label="Awaiting a slot" value={pending.length} hint="Requests to assign" />
      </StatStrip>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr] items-start mt-5">
        <Panel
          title="Arrivals"
          description="Check patients in as they reach the desk."
          bodyClassName=""
        >
          {todays.length === 0 ? (
            <EmptyState title="Nothing booked for today" />
          ) : (
            <ul className="divide-y divide-border">
              {todays.map((a) => (
                <li key={a.id} className="px-5 py-3 row-hover">
                  <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="font-mono text-[13px] tnum w-[3.25rem] shrink-0 text-muted-foreground">
                        {formatTime(a.date)}
                      </span>
                      <Avatar firstName={a.patient.firstName} lastName={a.patient.lastName} />
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-medium truncate">
                          {a.patient.firstName} {a.patient.lastName}
                        </p>
                        <p className="text-[12.5px] text-muted-foreground truncate">
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
                        <StatusButton
                          appointmentId={a.id}
                          status="CHECKED_IN"
                          label="Check in"
                          variant="secondary"
                        />
                      ) : null}
                      <StatusButton
                        appointmentId={a.id}
                        status="NO_SHOW"
                        label="No show"
                        variant="ghost"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Consultation requests"
          description="Assign a date and time from the doctor's schedule."
          bodyClassName=""
        >
          {pending.length === 0 ? (
            <EmptyState title="No pending requests" hint="Every request has a slot." />
          ) : (
            <ul className="divide-y divide-border">
              {pending.map((a) => (
                <li key={a.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <Avatar firstName={a.patient.firstName} lastName={a.patient.lastName} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2 items-baseline justify-between">
                        <p className="text-[13.5px] font-medium">
                          {a.patient.firstName} {a.patient.lastName}
                        </p>
                        <p className="text-[12px] text-muted-foreground tnum">
                          {formatDate(a.createdAt)}
                        </p>
                      </div>
                      <p className="mt-1 text-[13px] text-muted-foreground leading-snug">
                        {a.reason}
                      </p>
                    </div>
                  </div>
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
