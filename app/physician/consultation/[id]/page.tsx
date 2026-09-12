import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PageHeader,
  Panel,
  EmptyState,
  StatusBadge,
  LinkButton,
  formatDate,
  formatDateTime,
  age,
} from "@/components/ui-kit";
import { ConsultationForm, CompleteForm, CancelForm } from "./forms";

export const metadata = { title: "Consultation · CareClinic" };

/** WBS 4.2.1 / 4.2.2 - document and save the consultation note. */
export default async function ConsultationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { profile } = await requireRole("PHYSICIAN");
  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: true, consultation: true, physician: true },
  });

  if (!appointment) notFound();

  // A physician may only open an appointment that is theirs or unassigned.
  if (appointment.physicianId && appointment.physicianId !== profile.id) {
    notFound();
  }

  const patient = appointment.patient;
  const years = age(patient.dob);

  // WBS 4.3 - previous notes for context while writing this one.
  const previous = await prisma.consultation.findMany({
    where: { patientId: patient.id, appointmentId: { not: id } },
    include: { physician: true, appointment: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const closed = ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(appointment.status);

  return (
    <>
      <PageHeader
        eyebrow="Consultation"
        title={`${patient.firstName} ${patient.lastName}`}
        description={[
          years !== null ? `${years} years` : null,
          patient.sex,
          patient.phone,
        ]
          .filter(Boolean)
          .join(" · ")}
        actions={
          <>
            <LinkButton href={`/physician/patient/${patient.id}`}>Full history</LinkButton>
            <LinkButton href="/physician/dashboard">Back to today</LinkButton>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] items-start">
        <div className="space-y-6">
          <Panel
            title="Clinical note"
            description={
              appointment.date
                ? `Visit on ${formatDateTime(appointment.date)}`
                : "Slot not yet assigned"
            }
            actions={<StatusBadge status={appointment.status} />}
          >
            <ConsultationForm
              appointmentId={appointment.id}
              readOnly={closed}
              defaults={{
                symptoms: appointment.consultation?.symptoms ?? "",
                diagnosis: appointment.consultation?.diagnosis ?? "",
                advice: appointment.consultation?.advice ?? "",
              }}
            />
          </Panel>

          {!closed ? (
            <Panel title="Close the visit">
              <div className="flex flex-wrap gap-2.5 items-start">
                {/* WBS 3.5.2 */}
                <CompleteForm appointmentId={appointment.id} />
                {/* WBS 3.5.1 */}
                <CancelForm appointmentId={appointment.id} />
              </div>
              <p className="mt-3 text-[12px] text-muted-foreground">
                A consultation note must be saved before the visit can be completed.
              </p>
            </Panel>
          ) : null}
        </div>

        <div className="space-y-6">
          <Panel title="Reason for visit">
            <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{appointment.reason}</p>
          </Panel>

          <Panel title="Previous notes" bodyClassName="">
            {previous.length === 0 ? (
              <EmptyState title="No earlier consultations" />
            ) : (
              <ul className="divide-y divide-border">
                {previous.map((c) => (
                  <li key={c.id} className="px-5 py-3">
                    <p className="text-[13px] font-medium tnum">
                      {formatDate(c.appointment.date ?? c.createdAt)}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">
                      {c.diagnosis || c.symptoms || "No detail recorded"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
