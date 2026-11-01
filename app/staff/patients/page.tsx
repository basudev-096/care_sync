import { Search, UserPlus } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Toolbar,
  Panel,
  EmptyState,
  DataTable,
  Row,
  Cell,
  Avatar,
  searchInputClass,
  formatDate,
  age,
} from "@/components/ui-kit";
import { Sheet } from "@/components/sheet";
import { ProxyRegisterForm, EditPatientForm } from "./forms";

export const metadata = { title: "Patients" };

/** WBS 2.2.1 / 2.2.2 - search by name or phone. 2.3 - proxy registration. */
export default async function StaffPatients({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireRole("STAFF");

  const q = ((await searchParams).q ?? "").trim();

  const [patients, total] = await Promise.all([
    prisma.patientProfile.findMany({
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
      take: 100,
    }),
    prisma.patientProfile.count(),
  ]);

  return (
    <>
      <Toolbar
        title="Patients"
        meta={q ? `${patients.length} of ${total}` : `${total} registered`}
      >
        <form method="get" className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 pointer-events-none"
            strokeWidth={2}
          />
          <input
            name="q"
            defaultValue={q}
            className={`${searchInputClass} w-[16rem]`}
            placeholder="Search name, phone or email"
            aria-label="Search patients"
          />
        </form>

        <Sheet
          trigger={
            <>
              <UserPlus className="size-4" strokeWidth={2} />
              Register patient
            </>
          }
          title="Register a patient"
          description="For walk-in or over-the-phone patients."
        >
          <ProxyRegisterForm />
        </Sheet>
      </Toolbar>

      <Panel bodyClassName="">
        {patients.length === 0 ? (
          <EmptyState
            title={q ? `No patients match “${q}”` : "No patients registered yet"}
            hint={
              q
                ? "Try a phone number, or part of the surname."
                : "Use Register patient to add a walk-in, or wait for someone to sign up."
            }
          />
        ) : (
          <DataTable columns={["Patient", "Age", "Phone", "Registered", ""]}>
            {patients.map((p) => {
              const years = age(p.dob);
              return (
                <Row key={p.id}>
                  <Cell>
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar firstName={p.firstName} lastName={p.lastName} />
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {p.firstName} {p.lastName}
                        </p>
                        <p className="text-[12.5px] text-muted-foreground truncate">{p.email}</p>
                      </div>
                    </div>
                  </Cell>
                  <Cell className="text-muted-foreground tnum whitespace-nowrap">
                    {years !== null ? `${years} yrs` : "—"}
                  </Cell>
                  <Cell className="text-muted-foreground tnum whitespace-nowrap font-mono text-[12.5px]">
                    {p.phone ?? "—"}
                  </Cell>
                  <Cell className="text-muted-foreground tnum whitespace-nowrap">
                    {formatDate(p.createdAt)}
                  </Cell>
                  <Cell className="text-right">
                    {/* WBS 2.1.3 */}
                    <Sheet
                      trigger="Edit"
                      triggerVariant="ghost"
                      title={`${p.firstName} ${p.lastName}`}
                      description="Correct the patient's contact details."
                    >
                      <EditPatientForm
                        patient={{
                          id: p.id,
                          firstName: p.firstName,
                          lastName: p.lastName,
                          phone: p.phone ?? "",
                        }}
                      />
                    </Sheet>
                  </Cell>
                </Row>
              );
            })}
          </DataTable>
        )}
      </Panel>

      {q ? (
        <p className="mt-4 text-[13px] text-muted-foreground">
          Showing results for “{q}”.{" "}
          <a href="/staff/patients" className="text-secondary hover:underline font-medium">
            Clear search
          </a>
        </p>
      ) : null}

    </>
  );
}
