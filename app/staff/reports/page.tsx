import { ChevronLeft, ChevronRight } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Toolbar,
  Panel,
  DataTable,
  Row,
  Cell,
  Stat,
  StatStrip,
  StatusBadge,
  btn,
  formatDate,
} from "@/components/ui-kit";

export const metadata = { title: "Reports" };

function startOfWeek(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  // Monday as the first day of the clinic week.
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  return date;
}

/** WBS 6.4 - weekly administrative summary. */
export default async function StaffReports({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  await requireRole("STAFF");

  const weekParam = (await searchParams).week;
  const anchor = weekParam ? new Date(weekParam) : new Date();
  const from = startOfWeek(Number.isNaN(anchor.getTime()) ? new Date() : anchor);
  const to = new Date(from);
  to.setDate(to.getDate() + 7);

  const [visits, appointments, prescriptions, byStatus, byDay] = await Promise.all([
    // 6.4.1 - completed visits in the week.
    prisma.appointment.count({
      where: { date: { gte: from, lt: to }, status: "COMPLETED" },
    }),
    // 6.4.2 - total appointment volume booked for the week.
    prisma.appointment.count({ where: { date: { gte: from, lt: to } } }),
    // 6.4.3 - prescriptions digitised in the week.
    prisma.prescription.count({ where: { createdAt: { gte: from, lt: to } } }),
    prisma.appointment.groupBy({
      by: ["status"],
      where: { date: { gte: from, lt: to } },
      _count: { _all: true },
    }),
    prisma.appointment.findMany({
      where: { date: { gte: from, lt: to } },
      select: { date: true, status: true },
    }),
  ]);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const dayRows = byDay.filter(
      (a) => a.date && new Date(a.date).toDateString() === d.toDateString(),
    );
    return {
      date: d,
      total: dayRows.length,
      completed: dayRows.filter((a) => a.status === "COMPLETED").length,
    };
  });

  // The busiest day sets the bar scale, so the shape of the week is readable
  // without axes or a charting library.
  const busiest = Math.max(1, ...days.map((d) => d.total));
  const totalInWeek = byStatus.reduce((sum, s) => sum + s._count._all, 0);

  const shift = (weeks: number) => {
    const d = new Date(from);
    d.setDate(d.getDate() + weeks * 7);
    return d.toISOString().slice(0, 10);
  };

  const isThisWeek = from.getTime() === startOfWeek(new Date()).getTime();

  return (
    <>
      <Toolbar
        title="Weekly summary"
        meta={`${formatDate(from)} — ${formatDate(new Date(to.getTime() - 1))}`}
      >
        <div className="flex items-center gap-1.5">
          <a
            href={`/staff/reports?week=${shift(-1)}`}
            className={`${btn.outline} px-2.5`}
            aria-label="Previous week"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
          </a>
          <a
            href={`/staff/reports?week=${shift(1)}`}
            className={`${btn.outline} px-2.5`}
            aria-label="Next week"
          >
            <ChevronRight className="size-4" strokeWidth={2} />
          </a>
          {!isThisWeek ? (
            <a href="/staff/reports" className={btn.ghost}>
              This week
            </a>
          ) : null}
        </div>
      </Toolbar>

      <StatStrip>
        <Stat label="Patient visits" value={visits} hint="Appointments completed" />
        <Stat label="Appointment volume" value={appointments} hint="All appointments booked" />
        <Stat label="Prescriptions" value={prescriptions} hint="Digitised this week" />
      </StatStrip>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] items-start mt-5">
        <Panel title="Day by day" description="Appointments booked, and how many completed.">
          {totalInWeek === 0 ? (
            <p className="py-10 text-center text-[13px] text-muted-foreground">
              No appointments in this week.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {days.map((d) => {
                const isToday = d.date.toDateString() === new Date().toDateString();
                return (
                  <li key={d.date.toISOString()} className="flex items-center gap-3">
                    <span
                      className={`w-[3.25rem] shrink-0 text-[12.5px] ${
                        isToday ? "font-semibold text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {d.date.toLocaleDateString(undefined, { weekday: "short" })}
                    </span>

                    {/* Proportional bar: booked in full, completed in evergreen. */}
                    <span className="flex-1 h-6 bg-surface-sunken rounded-[3px] overflow-hidden relative">
                      <span
                        className="absolute inset-y-0 left-0 bg-border-strong"
                        style={{ width: `${(d.total / busiest) * 100}%` }}
                      />
                      <span
                        className="absolute inset-y-0 left-0 bg-secondary"
                        style={{ width: `${(d.completed / busiest) * 100}%` }}
                      />
                    </span>

                    <span className="w-16 shrink-0 text-right text-[12.5px] tnum text-muted-foreground">
                      {d.completed}/{d.total}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px] bg-secondary" aria-hidden />
              Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px] bg-border-strong" aria-hidden />
              Booked
            </span>
          </div>
        </Panel>

        <Panel title="Outcomes" bodyClassName="">
          {byStatus.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] text-muted-foreground">
              No appointments in this week.
            </p>
          ) : (
            <DataTable columns={["Status", "Count", "Share"]}>
              {byStatus
                .slice()
                .sort((a, b) => b._count._all - a._count._all)
                .map((s) => (
                  <Row key={s.status}>
                    <Cell>
                      <StatusBadge status={s.status} />
                    </Cell>
                    <Cell className="tnum text-muted-foreground">{s._count._all}</Cell>
                    <Cell className="tnum text-muted-foreground">
                      {Math.round((s._count._all / totalInWeek) * 100)}%
                    </Cell>
                  </Row>
                ))}
            </DataTable>
          )}
        </Panel>
      </div>
    </>
  );
}
