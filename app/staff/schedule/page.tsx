import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PageHeader,
  Panel,
  EmptyState,
  StatusBadge,
  inputClass,
  btn,
  formatTime,
  formatDate,
} from "@/components/ui-kit";
import {
  RescheduleForm,
  StaffCancelForm,
  StatusButton,
  ProxyBookForm,
} from "./forms";

export const metadata = { title: "Schedule" };

/** WBS 3.4.1 - centralised master day view, with the full status lifecycle. */
export default async function StaffSchedule({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  await requireRole("STAFF");

  const dayParam = (await searchParams).day;
  const requested = dayParam ? new Date(dayParam) : null;
  const day =
    requested && !Number.isNaN(requested.getTime()) ? requested : new Date();
  day.setHours(0, 0, 0, 0);

  const next = new Date(day);
  next.setDate(next.getDate() + 1);

  const [appointments, patients, physicians] = await Promise.all([
    prisma.appointment.findMany({
      where: { date: { gte: day, lt: next } },
      include: { patient: true, physician: true },
      orderBy: { date: "asc" },
    }),
    prisma.patientProfile.findMany({ orderBy: { lastName: "asc" }, take: 200 }),
    prisma.physicianProfile.findMany({ orderBy: { lastName: "asc" } }),
  ]);

  const physicianOptions = physicians.map((p) => ({
    id: p.id,
    label: `Dr ${p.firstName} ${p.lastName}`,
  }));
  const patientOptions = patients.map((p) => ({
    id: p.id,
    label: `${p.lastName}, ${p.firstName}${p.phone ? " · " + p.phone : ""}`,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Clinic schedule"
        title="Master day view"
        description="Every appointment for the selected day, with check-in and status controls."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] items-start">
        <div className="space-y-6">
          <Panel>
            <form method="get" className="flex flex-wrap gap-2.5 items-end">
              <div>
                <label className="block text-[13px] font-medium mb-1.5" htmlFor="day">Show day</label>
                <input
                  id="day"
                  type="date"
                  name="day"
                  defaultValue={day.toISOString().slice(0, 10)}
                  className={inputClass}
                />
              </div>
              <button type="submit" className={btn.primary}>View</button>
            </form>
          </Panel>

          <Panel title={formatDate(day)} description={`${appointments.length} appointment${appointments.length === 1 ? "" : "s"}`} bodyClassName="">
            {appointments.length === 0 ? (
              <EmptyState title="Nothing scheduled" hint="Pick another day, or book a walk-in." />
            ) : (
              <ul className="divide-y divide-border">
                {appointments.map((a) => {
                  const closed = ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(a.status);
                  return (
                    <li key={a.id} className="px-5 py-4">
                      <div className="flex flex-wrap gap-3 items-start justify-between">
                        <div className="flex gap-4 min-w-0">
                          <span className="text-[14px] font-medium tnum w-14 shrink-0">
                            {formatTime(a.date)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium">
                              {a.patient.firstName} {a.patient.lastName}
                            </p>
                            <p className="mt-0.5 text-[13px] text-muted-foreground">{a.reason}</p>
                            <p className="mt-0.5 text-[13px] text-muted-foreground">
                              {a.physician
                                ? `Dr ${a.physician.firstName} ${a.physician.lastName}`
                                : "No physician assigned"}
                              {a.patient.phone ? ` · ${a.patient.phone}` : ""}
                            </p>
                            {a.cancelReason ? (
                              <p className="mt-0.5 text-[13px] text-muted-foreground">
                                Cancelled: {a.cancelReason}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>

                      {!closed ? (
                        <div className="mt-3.5 flex flex-wrap gap-2 items-start">
                          {a.status !== "CHECKED_IN" ? (
                            <StatusButton appointmentId={a.id} status="CHECKED_IN" label="Check in" variant="secondary" />
                          ) : null}
                          <StatusButton appointmentId={a.id} status="NO_SHOW" label="No show" />
                          <RescheduleForm appointmentId={a.id} />
                          <StaffCancelForm appointmentId={a.id} />
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="Book a walk-in" description="Confirmed immediately — the patient is present.">
          {patientOptions.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">
              Register a patient first on the Patients tab.
            </p>
          ) : (
            <ProxyBookForm patients={patientOptions} physicians={physicianOptions} />
          )}
        </Panel>
      </div>
    </>
  );
}
