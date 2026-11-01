import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PageHeader,
  Panel,
  EmptyState,
  StatusBadge,
  LinkButton,
  formatTime,
  formatDate,
} from "@/components/ui-kit";

export const metadata = { title: "Today" };

export default async function PhysicianDashboard() {
  const { profile } = await requireRole("PHYSICIAN");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  // WBS 4.6.1 / 6.2.1 - the day's patient list for this physician.
  const today = await prisma.appointment.findMany({
    where: {
      physicianId: profile.id,
      date: { gte: startOfDay, lt: endOfDay },
      status: { in: ["SCHEDULED", "ACCEPTED", "CHECKED_IN"] },
    },
    include: { patient: true, consultation: true },
    orderBy: { date: "asc" },
  });

  // WBS 4.6.2 / 6.2.2 - visits still waiting on a written note.
  const pendingNotes = await prisma.appointment.findMany({
    where: {
      physicianId: profile.id,
      status: { in: ["CHECKED_IN", "ACCEPTED", "COMPLETED"] },
      consultation: null,
      date: { lt: endOfDay },
    },
    include: { patient: true },
    orderBy: { date: "desc" },
    take: 20,
  });

  return (
    <>
      <PageHeader
        eyebrow="Physician workspace"
        title={`Good day, Dr ${profile.lastName}`}
        description="Your clinic list for today and any notes still outstanding."
      />

      <div className="space-y-6">
        <Panel
          title="Today's patients"
          description={formatDate(startOfDay)}
          bodyClassName=""
        >
          {today.length === 0 ? (
            <EmptyState title="No patients scheduled today" />
          ) : (
            <ul className="divide-y divide-border">
              {today.map((a) => (
                <li key={a.id} className="px-5 py-4 flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-[14px] font-medium tnum w-14 shrink-0">
                      {formatTime(a.date)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium">
                        {a.patient.firstName} {a.patient.lastName}
                      </p>
                      <p className="mt-0.5 text-[13px] text-muted-foreground line-clamp-1">
                        {a.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <StatusBadge status={a.status} />
                    <LinkButton href={`/physician/consultation/${a.id}`} variant="primary">
                      {a.consultation ? "Open note" : "Write note"}
                    </LinkButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Pending notes"
          description="Visits without a consultation note."
          bodyClassName=""
        >
          {pendingNotes.length === 0 ? (
            <EmptyState title="Nothing outstanding" hint="Every visit has a note on file." />
          ) : (
            <ul className="divide-y divide-border">
              {pendingNotes.map((a) => (
                <li key={a.id} className="px-5 py-3.5 flex flex-wrap gap-3 items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium">
                      {a.patient.firstName} {a.patient.lastName}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground tnum">
                      {formatDate(a.date)} · {a.reason}
                    </p>
                  </div>
                  <LinkButton href={`/physician/consultation/${a.id}`}>Write note</LinkButton>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
