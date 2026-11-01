import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PageHeader,
  Panel,
  EmptyState,
  DataTable,
  Row,
  Cell,
  StatusBadge,
  formatDateTime,
} from "@/components/ui-kit";

export const metadata = { title: "Consultations" };

/**
 * WBS 4.5.1 - staff view of consultation timestamps and metadata.
 *
 * Deliberately metadata only: reception needs to know that a consultation
 * happened and when, not what was written in the clinical note.
 */
export default async function StaffConsultations() {
  await requireRole("STAFF");

  const consultations = await prisma.consultation.findMany({
    include: {
      patient: true,
      physician: true,
      appointment: true,
      prescriptions: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <PageHeader
        eyebrow="Clinical activity"
        title="Consultation log"
        description="When each consultation took place and who recorded it. Clinical notes are not shown here."
      />

      <Panel bodyClassName="">
        {consultations.length === 0 ? (
          <EmptyState title="No consultations recorded yet" />
        ) : (
          <DataTable
            columns={["Visit", "Patient", "Physician", "Recorded", "Prescription", "Status"]}
          >
            {consultations.map((c) => (
              <Row key={c.id}>
                <Cell className="tnum whitespace-nowrap">
                  {formatDateTime(c.appointment.date ?? c.createdAt)}
                </Cell>
                <Cell className="font-medium">
                  {c.patient.firstName} {c.patient.lastName}
                </Cell>
                <Cell className="text-muted-foreground">
                  Dr {c.physician.firstName} {c.physician.lastName}
                </Cell>
                <Cell className="text-muted-foreground tnum whitespace-nowrap">
                  {formatDateTime(c.createdAt)}
                </Cell>
                <Cell className="text-muted-foreground">
                  {c.prescriptions.length > 0 ? "Digitised" : "Not yet"}
                </Cell>
                <Cell>
                  <StatusBadge status={c.appointment.status} />
                </Cell>
              </Row>
            ))}
          </DataTable>
        )}
      </Panel>
    </>
  );
}
