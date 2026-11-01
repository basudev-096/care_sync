import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PageHeader,
  Panel,
  EmptyState,
  DataTable,
  Row,
  Cell,
  LinkButton,
  inputClass,
  btn,
  formatDate,
  age,
} from "@/components/ui-kit";

export const metadata = { title: "Patients" };

/** WBS 4.1.1 - physician searches clinic patients by name or phone. */
export default async function PhysicianPatients({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireRole("PHYSICIAN");

  const q = ((await searchParams).q ?? "").trim();

  const patients = q
    ? await prisma.patientProfile.findMany({
        where: {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
          ],
        },
        orderBy: { lastName: "asc" },
        take: 50,
      })
    : [];

  return (
    <>
      <PageHeader
        eyebrow="Clinical records"
        title="Find a patient"
        description="Search by name or phone number to open a clinical profile."
      />

      <Panel className="mb-6">
        <form method="get" className="flex flex-wrap gap-2.5">
          <input
            name="q"
            defaultValue={q}
            className={`${inputClass} flex-1 min-w-[14rem]`}
            placeholder="Patient name or phone number"
            aria-label="Search patients"
          />
          <button type="submit" className={btn.primary}>
            Search
          </button>
        </form>
      </Panel>

      {q === "" ? (
        <Panel>
          <EmptyState title="Enter a name or phone number" hint="Results appear here." />
        </Panel>
      ) : patients.length === 0 ? (
        <Panel>
          <EmptyState title={`No patients match “${q}”`} hint="Try a different spelling." />
        </Panel>
      ) : (
        <Panel bodyClassName="">
          <DataTable columns={["Patient", "Age", "Phone", "Registered", ""]}>
            {patients.map((p) => {
              const years = age(p.dob);
              return (
                <Row key={p.id}>
                  <Cell className="font-medium">
                    {p.firstName} {p.lastName}
                  </Cell>
                  <Cell className="text-muted-foreground tnum">{years ?? "—"}</Cell>
                  <Cell className="text-muted-foreground tnum">{p.phone ?? "—"}</Cell>
                  <Cell className="text-muted-foreground tnum">{formatDate(p.createdAt)}</Cell>
                  <Cell className="text-right">
                    <LinkButton href={`/physician/patient/${p.id}`}>Open</LinkButton>
                  </Cell>
                </Row>
              );
            })}
          </DataTable>
        </Panel>
      )}
    </>
  );
}
