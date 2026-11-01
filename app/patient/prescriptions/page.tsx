import { Download } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseMedicines, describeMedicine } from "@/lib/prescription";
import { PageHeader, Panel, EmptyState, formatDate, btn } from "@/components/ui-kit";

export const metadata = { title: "Prescriptions" };

export default async function PatientPrescriptions() {
  const { profile } = await requireRole("PATIENT");

  // WBS 5.4.1 - the patient sees only their own prescriptions.
  const prescriptions = await prisma.prescription.findMany({
    where: { patientId: profile.id },
    include: { physician: true, consultation: { include: { appointment: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="Prescriptions"
        title="Your prescriptions"
        description="Digitised copies of the prescriptions written during your visits."
      />

      {prescriptions.length === 0 ? (
        <Panel>
          <EmptyState
            title="No prescriptions yet"
            hint="Reception digitises the handwritten prescription after your visit."
          />
        </Panel>
      ) : (
        <div className="space-y-5">
          {prescriptions.map((p) => {
            const medicines = parseMedicines(p.medicineDetails);
            return (
              <Panel
                key={p.id}
                title={formatDate(p.consultation.appointment.date ?? p.createdAt)}
                description={`Dr ${p.physician.firstName} ${p.physician.lastName}`}
                actions={
                  /* WBS 5.4.2 - download the official PDF. */
                  <a href={`/api/prescriptions/${p.id}/pdf`} className={btn.outline}>
                    <Download className="size-4" strokeWidth={2} />
                    PDF
                  </a>
                }
                bodyClassName=""
              >
                <ul className="divide-y divide-border">
                  {medicines.map((m, i) => (
                    <li key={i} className="px-5 py-3">
                      <p className="text-[14px] font-medium">{m.name}</p>
                      {describeMedicine(m) ? (
                        <p className="mt-0.5 text-[13px] text-muted-foreground">
                          {describeMedicine(m)}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {p.instructions ? (
                  <div className="px-5 py-3 border-t border-border">
                    <p className="eyebrow mb-1">Instructions</p>
                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                      {p.instructions}
                    </p>
                  </div>
                ) : null}
              </Panel>
            );
          })}
        </div>
      )}
    </>
  );
}
