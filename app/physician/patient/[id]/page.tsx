import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseMedicines, describeMedicine } from "@/lib/prescription";
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

export const metadata = { title: "Patient · CareClinic" };

/** WBS 4.1.2 / 4.3 - clinical profile plus full consultation history. */
export default async function PhysicianPatientProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("PHYSICIAN");
  const { id } = await params;

  const patient = await prisma.patientProfile.findUnique({
    where: { id },
    include: {
      appointments: { orderBy: { createdAt: "desc" }, include: { physician: true } },
      consultations: {
        orderBy: { createdAt: "desc" },
        include: { physician: true, appointment: true, prescriptions: true },
      },
    },
  });

  if (!patient) notFound();

  const years = age(patient.dob);

  return (
    <>
      <PageHeader
        eyebrow="Clinical profile"
        title={`${patient.firstName} ${patient.lastName}`}
        description={[
          years !== null ? `${years} years` : null,
          patient.sex,
          patient.phone,
          patient.email,
        ]
          .filter(Boolean)
          .join(" · ")}
        actions={<LinkButton href="/physician/patients">Back to search</LinkButton>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] items-start">
        <div className="space-y-6">
          {/* WBS 4.3.1 / 4.3.2 / 4.3.3 */}
          <Panel title="Consultation history" bodyClassName="">
            {patient.consultations.length === 0 ? (
              <EmptyState title="No consultations recorded" />
            ) : (
              <ul className="divide-y divide-border">
                {patient.consultations.map((c) => (
                  <li key={c.id} className="px-5 py-4">
                    <div className="flex flex-wrap gap-2 items-baseline justify-between">
                      <p className="text-[14px] font-medium tnum">
                        {formatDate(c.appointment.date ?? c.createdAt)}
                      </p>
                      <p className="text-[13px] text-muted-foreground">
                        Dr {c.physician.firstName} {c.physician.lastName}
                      </p>
                    </div>

                    <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                      <Note label="Symptoms" value={c.symptoms} />
                      <Note label="Diagnosis" value={c.diagnosis} />
                      <Note label="Advice" value={c.advice} />
                    </dl>

                    {c.prescriptions.length > 0 ? (
                      <div className="mt-3.5 pt-3.5 border-t border-border">
                        <p className="eyebrow mb-1.5">Prescribed</p>
                        <ul className="space-y-1">
                          {c.prescriptions.flatMap((p) =>
                            parseMedicines(p.medicineDetails).map((m, i) => (
                              <li key={`${p.id}-${i}`} className="text-[13px]">
                                <span className="font-medium">{m.name}</span>
                                {describeMedicine(m) ? (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    — {describeMedicine(m)}
                                  </span>
                                ) : null}
                              </li>
                            )),
                          )}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="Appointments" bodyClassName="">
          {patient.appointments.length === 0 ? (
            <EmptyState title="None on file" />
          ) : (
            <ul className="divide-y divide-border">
              {patient.appointments.slice(0, 12).map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] tnum">
                      {a.date ? formatDateTime(a.date) : "Awaiting slot"}
                    </p>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-0.5 text-[13px] text-muted-foreground line-clamp-2">{a.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

function Note({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="eyebrow mb-1">{label}</dt>
      <dd className="text-[13.5px] leading-relaxed whitespace-pre-wrap">
        {value || <span className="text-muted-foreground">Not recorded</span>}
      </dd>
    </div>
  );
}
