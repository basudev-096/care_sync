import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PageHeader,
  Panel,
  DataTable,
  Row,
  Cell,
  inputClass,
  btn,
  formatDate,
} from "@/components/ui-kit";

export const metadata = { title: "Reports · CareClinic" };

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

  const prevWeek = new Date(from);
  prevWeek.setDate(prevWeek.getDate() - 7);
  const nextWeek = new Date(from);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Weekly summary"
        description={`Clinic activity from ${formatDate(from)} to ${formatDate(
          new Date(to.getTime() - 1),
        )}.`}
      />

      <Panel className="mb-6">
        <form method="get" className="flex flex-wrap gap-2.5 items-end">
          <div>
            <label className="block text-[13px] font-medium mb-1.5" htmlFor="week">
              Week containing
            </label>
            <input
              id="week"
              type="date"
              name="week"
              defaultValue={from.toISOString().slice(0, 10)}
              className={inputClass}
            />
          </div>
          <button type="submit" className={btn.primary}>Show week</button>
          <a href={`/staff/reports?week=${prevWeek.toISOString().slice(0, 10)}`} className={btn.outline}>
            Previous
          </a>
          <a href={`/staff/reports?week=${nextWeek.toISOString().slice(0, 10)}`} className={btn.outline}>
            Next
          </a>
        </form>
      </Panel>

      <div className="grid gap-5 sm:grid-cols-3 mb-6">
        <Metric label="Patient visits" value={visits} hint="Appointments completed" />
        <Metric label="Appointment volume" value={appointments} hint="All appointments booked" />
        <Metric label="Prescriptions" value={prescriptions} hint="Digitised this week" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <Panel title="Day by day" bodyClassName="">
          <DataTable columns={["Day", "Appointments", "Completed"]}>
            {days.map((d) => (
              <Row key={d.date.toISOString()}>
                <Cell>{d.date.toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "short" })}</Cell>
                <Cell className="tnum text-muted-foreground">{d.total}</Cell>
                <Cell className="tnum text-muted-foreground">{d.completed}</Cell>
              </Row>
            ))}
          </DataTable>
        </Panel>

        <Panel title="Outcomes" bodyClassName="">
          {byStatus.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-muted-foreground">
              No appointments in this week.
            </p>
          ) : (
            <DataTable columns={["Status", "Count"]}>
              {byStatus.map((s) => (
                <Row key={s.status}>
                  <Cell>{s.status.replace("_", " ").toLowerCase()}</Cell>
                  <Cell className="tnum text-muted-foreground">{s._count._all}</Cell>
                </Row>
              ))}
            </DataTable>
          )}
        </Panel>
      </div>
    </>
  );
}

function Metric({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="panel-raised p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-[30px] font-semibold tracking-tight tnum leading-none">{value}</p>
      <p className="mt-2 text-[13px] text-muted-foreground">{hint}</p>
    </div>
  );
}
