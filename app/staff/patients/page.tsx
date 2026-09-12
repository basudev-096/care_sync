import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PageHeader,
  Panel,
  EmptyState,
  DataTable,
  Row,
  Cell,
  inputClass,
  btn,
  formatDate,
  age,
} from "@/components/ui-kit";
import { ProxyRegisterForm, EditPatientForm } from "./forms";

export const metadata = { title: "Patients · CareClinic" };

/** WBS 2.2.1 / 2.2.2 - search by name or phone. 2.3 - proxy registration. */
export default async function StaffPatients({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireRole("STAFF");

  const q = ((await searchParams).q ?? "").trim();

  const patients = await prisma.patientProfile.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <>
      <PageHeader
        eyebrow="Patient registry"
        title="Patients"
        description="Search the registry, correct contact details, or register a walk-in patient."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_21rem] items-start">
        <div className="space-y-6">
          <Panel>
            <form method="get" className="flex flex-wrap gap-2.5">
              <input
                name="q"
                defaultValue={q}
                className={`${inputClass} flex-1 min-w-[14rem]`}
                placeholder="Name, phone number or email"
                aria-label="Search patients"
              />
              <button type="submit" className={btn.primary}>Search</button>
            </form>
          </Panel>

          <Panel
            title={q ? `Results for “${q}”` : "All patients"}
            description={`${patients.length} record${patients.length === 1 ? "" : "s"}`}
            bodyClassName=""
          >
            {patients.length === 0 ? (
              <EmptyState
                title={q ? "No patients match that search" : "No patients registered yet"}
                hint={q ? "Try a phone number instead." : "Register one on the right."}
              />
            ) : (
              <DataTable columns={["Patient", "Age", "Phone", "Email", "Registered", ""]}>
                {patients.map((p) => {
                  const years = age(p.dob);
                  return (
                    <Row key={p.id}>
                      <Cell className="font-medium">{p.firstName} {p.lastName}</Cell>
                      <Cell className="text-muted-foreground tnum">{years ?? "—"}</Cell>
                      <Cell className="text-muted-foreground tnum">{p.phone ?? "—"}</Cell>
                      <Cell className="text-muted-foreground">{p.email}</Cell>
                      <Cell className="text-muted-foreground tnum">{formatDate(p.createdAt)}</Cell>
                      <Cell className="text-right">
                        {/* WBS 2.1.3 */}
                        <EditPatientForm
                          patient={{
                            id: p.id,
                            firstName: p.firstName,
                            lastName: p.lastName,
                            phone: p.phone ?? "",
                          }}
                        />
                      </Cell>
                    </Row>
                  );
                })}
              </DataTable>
            )}
          </Panel>
        </div>

        <Panel
          title="Register a patient"
          description="For walk-in or over-the-phone patients."
        >
          <ProxyRegisterForm />
        </Panel>
      </div>
    </>
  );
}
