import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader, Panel, EmptyState, formatDateTime } from "@/components/ui-kit";

export const metadata = { title: "Consultations" };

export default async function PatientRecords() {
  const { profile } = await requireRole("PATIENT");

  // WBS 4.4.1 - past consultation summaries and clinical notes, own records only.
  const consultations = await prisma.consultation.findMany({
    where: { patientId: profile.id },
    include: { physician: true, appointment: true, prescriptions: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="Clinical records"
        title="Your consultations"
        description="Notes written by your physician at each visit."
      />

      {consultations.length === 0 ? (
        <Panel>
          <EmptyState
            title="No consultations yet"
            hint="Notes appear here after you have been seen by a physician."
          />
        </Panel>
      ) : (
        <div className="space-y-5">
          {consultations.map((c) => (
            <Panel
              key={c.id}
              title={formatDateTime(c.appointment.date ?? c.createdAt)}
              description={`Dr ${c.physician.firstName} ${c.physician.lastName}${
                c.physician.specialty ? " · " + c.physician.specialty : ""
              }`}
            >
              <dl className="grid gap-4 sm:grid-cols-3">
                <Note label="Symptoms" value={c.symptoms} />
                <Note label="Diagnosis" value={c.diagnosis} />
                <Note label="Advice" value={c.advice} />
              </dl>

              {c.prescriptions.length > 0 ? (
                <p className="mt-4 pt-4 border-t border-border text-[13px] text-muted-foreground">
                  {c.prescriptions.length} prescription
                  {c.prescriptions.length === 1 ? "" : "s"} on file — see the Prescriptions tab to
                  download.
                </p>
              ) : null}
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}

function Note({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="eyebrow mb-1.5">{label}</dt>
      <dd className="text-[14px] leading-relaxed whitespace-pre-wrap">
        {value || <span className="text-muted-foreground">Not recorded</span>}
      </dd>
    </div>
  );
}
