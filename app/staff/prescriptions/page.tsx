import { Download } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseMedicines } from "@/lib/prescription";
import {
  PageHeader,
  Panel,
  EmptyState,
  btn,
  formatDate,
} from "@/components/ui-kit";
import { DigitizeForm } from "./forms";

export const metadata = { title: "Prescriptions · CareClinic" };

/** WBS 5.2 - digitise the handwritten prescription; 5.3 - PDF and print. */
export default async function StaffPrescriptions() {
  await requireRole("STAFF");

  const [awaiting, recent] = await Promise.all([
    // Consultations that have no prescription digitised yet.
    prisma.consultation.findMany({
      where: { prescriptions: { none: {} } },
      include: { patient: true, physician: true, appointment: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    prisma.prescription.findMany({
      include: { patient: true, physician: true },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Prescription desk"
        title="Digitise prescriptions"
        description="Enter the physician's handwritten prescription into the template, then generate the PDF."
      />

      <div className="space-y-6">
        <Panel
          title="Awaiting digitisation"
          description="Consultations with no prescription on file yet."
          bodyClassName=""
        >
          {awaiting.length === 0 ? (
            <EmptyState
              title="Nothing waiting"
              hint="Every consultation note has a prescription recorded."
            />
          ) : (
            <ul className="divide-y divide-border">
              {awaiting.map((c) => (
                <li key={c.id} className="px-5 py-4">
                  <div className="flex flex-wrap gap-2 items-baseline justify-between">
                    <p className="text-[14px] font-medium">
                      {c.patient.firstName} {c.patient.lastName}
                    </p>
                    <p className="text-[13px] text-muted-foreground tnum">
                      {formatDate(c.appointment.date ?? c.createdAt)} · Dr {c.physician.lastName}
                    </p>
                  </div>
                  {c.diagnosis ? (
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      Diagnosis: {c.diagnosis}
                    </p>
                  ) : null}
                  <div className="mt-3">
                    <DigitizeForm consultationId={c.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recently digitised" bodyClassName="">
          {recent.length === 0 ? (
            <EmptyState title="No prescriptions yet" />
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((p) => {
                const medicines = parseMedicines(p.medicineDetails);
                return (
                  <li key={p.id} className="px-5 py-3.5 flex flex-wrap gap-3 items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium">
                        {p.patient.firstName} {p.patient.lastName}
                      </p>
                      <p className="mt-0.5 text-[13px] text-muted-foreground">
                        {medicines.map((m) => m.name).join(", ")}
                      </p>
                      <p className="mt-0.5 text-[12px] text-muted-foreground tnum">
                        {formatDate(p.createdAt)} · Dr {p.physician.lastName}
                      </p>
                    </div>
                    {/* WBS 5.3.1 / 5.3.2 - open the PDF to view or print. */}
                    <a href={`/api/prescriptions/${p.id}/pdf`} target="_blank" className={btn.outline}>
                      <Download className="size-4" strokeWidth={2} />
                      PDF
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
