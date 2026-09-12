import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PageHeader,
  Panel,
  EmptyState,
  StatusBadge,
  formatDateTime,
} from "@/components/ui-kit";
import { RequestForm, AcceptButton, CancelForm } from "./forms";

export const metadata = { title: "Appointments · CareClinic" };

export default async function PatientAppointments() {
  const { profile } = await requireRole("PATIENT");

  const appointments = await prisma.appointment.findMany({
    where: { patientId: profile.id },
    include: { physician: true },
    orderBy: { createdAt: "desc" },
  });

  const open = appointments.filter((a) =>
    ["PENDING", "SCHEDULED", "ACCEPTED", "CHECKED_IN"].includes(a.status),
  );
  const past = appointments.filter((a) =>
    ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(a.status),
  );

  return (
    <>
      <PageHeader
        eyebrow="Appointments"
        title="Your appointments"
        description="Request a consultation, confirm the time reception assigns, or cancel a visit you can no longer attend."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] items-start">
        <div className="space-y-6">
          <Panel title="Current" description="Visits that are still open." bodyClassName="">
            {open.length === 0 ? (
              <EmptyState title="Nothing open" hint="Request a consultation to get started." />
            ) : (
              <ul className="divide-y divide-border">
                {open.map((a) => (
                  <li key={a.id} className="px-5 py-4">
                    <div className="flex flex-wrap gap-3 items-start justify-between">
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
                    </div>

                    <div className="mt-3.5 flex flex-wrap gap-2 items-start">
                      {/* WBS 3.1.3 - accept the assigned slot. */}
                      {a.status === "SCHEDULED" ? <AcceptButton appointmentId={a.id} /> : null}
                      {/* WBS 3.3.1 / 3.3.2 - cancel, reason mandatory. */}
                      {["PENDING", "SCHEDULED", "ACCEPTED"].includes(a.status) ? (
                        <CancelForm appointmentId={a.id} />
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="History" bodyClassName="">
            {past.length === 0 ? (
              <EmptyState title="No past appointments yet" />
            ) : (
              <ul className="divide-y divide-border">
                {past.map((a) => (
                  <li key={a.id} className="px-5 py-3.5 flex flex-wrap gap-3 items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-[14px] tnum">{formatDateTime(a.date)}</p>
                      <p className="mt-0.5 text-[13px] text-muted-foreground">{a.reason}</p>
                      {a.cancelReason ? (
                        <p className="mt-0.5 text-[13px] text-muted-foreground">
                          Reason given: {a.cancelReason}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel
          title="Request a consultation"
          description="Reception assigns the date and time based on the doctor's schedule."
        >
          <RequestForm hasOpen={open.length > 0} />
        </Panel>
      </div>
    </>
  );
}
