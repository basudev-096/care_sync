/**
 * Exercises every database query the portal pages run, against the real
 * database, using temporary rows that are removed again at the end.
 *
 * Page rendering needs a Clerk session, but these queries do not -- and a bad
 * filter or groupBy shape only fails at runtime, so this catches the class of
 * bug a type-check cannot.
 *
 *   npx tsx scripts/verify-queries.ts
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const TAG = "verify-" + Date.now();
let passed = 0;
const failures: string[] = [];

async function check(name: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    passed++;
    console.log("  ok   " + name);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    failures.push(name + " -> " + msg.split("\n")[0]);
    console.log("  FAIL " + name + "\n       " + msg.split("\n")[0]);
  }
}

async function main() {
  console.log("Seeding temporary rows...");

  const patient = await prisma.patientProfile.create({
    data: {
      clerkId: TAG + "-patient",
      email: TAG + "-patient@example.test",
      firstName: "Verify",
      lastName: "Patient",
      phone: "5550001",
      sex: "Other",
      dob: new Date("1990-05-02"),
    },
  });

  const physician = await prisma.physicianProfile.create({
    data: {
      clerkId: TAG + "-doc",
      email: TAG + "-doc@example.test",
      firstName: "Verify",
      lastName: "Physician",
      specialty: "General medicine",
    },
  });

  const staff = await prisma.staffProfile.create({
    data: {
      clerkId: TAG + "-staff",
      email: TAG + "-staff@example.test",
      firstName: "Verify",
      lastName: "Staff",
    },
  });

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      physicianId: physician.id,
      date: new Date(),
      reason: "Verification visit",
      status: "COMPLETED",
    },
  });

  const consultation = await prisma.consultation.create({
    data: {
      appointmentId: appointment.id,
      patientId: patient.id,
      physicianId: physician.id,
      symptoms: "Verification symptoms",
      diagnosis: "Verification diagnosis",
      advice: "Verification advice",
    },
  });

  const prescription = await prisma.prescription.create({
    data: {
      consultationId: consultation.id,
      patientId: patient.id,
      physicianId: physician.id,
      medicineDetails: JSON.stringify([
        { name: "Amoxicillin", dosage: "500mg", frequency: "3x daily", timing: "After food", duration: "5 days" },
      ]),
      instructions: "Complete the full course.",
    },
  });

  // A pending request with no slot -- the shape WBS 3.1.1 creates.
  const pending = await prisma.appointment.create({
    data: { patientId: patient.id, reason: "Slotless request", status: "PENDING", date: null },
  });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  console.log("\nRole resolution (lib/auth.ts)");
  await check("getSessionUser lookup across three profile tables", () =>
    Promise.all([
      prisma.patientProfile.findUnique({ where: { clerkId: patient.clerkId } }),
      prisma.physicianProfile.findUnique({ where: { clerkId: physician.clerkId } }),
      prisma.staffProfile.findUnique({ where: { clerkId: staff.clerkId } }),
    ]),
  );

  console.log("\nPatient portal");
  await check("dashboard: upcoming visits", () =>
    prisma.appointment.findMany({
      where: { patientId: patient.id, status: { in: ["PENDING", "SCHEDULED", "ACCEPTED", "CHECKED_IN"] } },
      include: { physician: true },
      orderBy: [{ date: "asc" }, { createdAt: "asc" }],
    }),
  );
  await check("appointments: full list", () =>
    prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: { physician: true },
      orderBy: { createdAt: "desc" },
    }),
  );
  await check("records: consultations with prescriptions", () =>
    prisma.consultation.findMany({
      where: { patientId: patient.id },
      include: { physician: true, appointment: true, prescriptions: true },
      orderBy: { createdAt: "desc" },
    }),
  );
  await check("prescriptions: own only", () =>
    prisma.prescription.findMany({
      where: { patientId: patient.id },
      include: { physician: true, consultation: { include: { appointment: true } } },
      orderBy: { createdAt: "desc" },
    }),
  );

  console.log("\nPhysician portal");
  await check("dashboard: today's list", () =>
    prisma.appointment.findMany({
      where: {
        physicianId: physician.id,
        date: { gte: startOfDay, lt: endOfDay },
        status: { in: ["SCHEDULED", "ACCEPTED", "CHECKED_IN"] },
      },
      include: { patient: true, consultation: true },
      orderBy: { date: "asc" },
    }),
  );
  await check("dashboard: pending notes (consultation is null)", () =>
    prisma.appointment.findMany({
      where: {
        physicianId: physician.id,
        status: { in: ["CHECKED_IN", "ACCEPTED", "COMPLETED"] },
        consultation: null,
        date: { lt: endOfDay },
      },
      include: { patient: true },
      orderBy: { date: "desc" },
      take: 20,
    }),
  );
  await check("patient search by name/phone (case-insensitive)", () =>
    prisma.patientProfile.findMany({
      where: {
        OR: [
          { firstName: { contains: "verify", mode: "insensitive" } },
          { lastName: { contains: "verify", mode: "insensitive" } },
          { phone: { contains: "5550001" } },
        ],
      },
      orderBy: { lastName: "asc" },
      take: 50,
    }),
  );
  await check("clinical profile with history", () =>
    prisma.patientProfile.findUnique({
      where: { id: patient.id },
      include: {
        appointments: { orderBy: { createdAt: "desc" }, include: { physician: true } },
        consultations: {
          orderBy: { createdAt: "desc" },
          include: { physician: true, appointment: true, prescriptions: true },
        },
      },
    }),
  );
  await check("consultation page: previous notes excluding this visit", () =>
    prisma.consultation.findMany({
      where: { patientId: patient.id, appointmentId: { not: appointment.id } },
      include: { physician: true, appointment: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  );

  console.log("\nStaff portal");
  await check("dashboard: arrivals + pending requests + physicians", () =>
    Promise.all([
      prisma.appointment.findMany({
        where: { date: { gte: startOfDay, lt: endOfDay }, status: { in: ["SCHEDULED", "ACCEPTED", "CHECKED_IN"] } },
        include: { patient: true, physician: true },
        orderBy: { date: "asc" },
      }),
      prisma.appointment.findMany({
        where: { status: "PENDING" },
        include: { patient: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.physicianProfile.findMany({ orderBy: { lastName: "asc" } }),
    ]),
  );
  await check("schedule: master day view", () =>
    prisma.appointment.findMany({
      where: { date: { gte: startOfDay, lt: endOfDay } },
      include: { patient: true, physician: true },
      orderBy: { date: "asc" },
    }),
  );
  await check("patients: registry search incl. email", () =>
    prisma.patientProfile.findMany({
      where: {
        OR: [
          { firstName: { contains: "ver", mode: "insensitive" } },
          { lastName: { contains: "ver", mode: "insensitive" } },
          { phone: { contains: "555" } },
          { email: { contains: "ver", mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
  );
  await check("prescriptions: consultations awaiting digitisation", () =>
    prisma.consultation.findMany({
      where: { prescriptions: { none: {} } },
      include: { patient: true, physician: true, appointment: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  );
  await check("consultation log (4.5.1)", () =>
    prisma.consultation.findMany({
      include: {
        patient: true,
        physician: true,
        appointment: true,
        prescriptions: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  );

  console.log("\nWeekly report (6.4)");
  const from = new Date(startOfDay);
  from.setDate(from.getDate() - ((from.getDay() + 6) % 7));
  const to = new Date(from);
  to.setDate(to.getDate() + 7);

  await check("counts: visits / volume / prescriptions", () =>
    Promise.all([
      prisma.appointment.count({ where: { date: { gte: from, lt: to }, status: "COMPLETED" } }),
      prisma.appointment.count({ where: { date: { gte: from, lt: to } } }),
      prisma.prescription.count({ where: { createdAt: { gte: from, lt: to } } }),
    ]),
  );
  await check("groupBy status", () =>
    prisma.appointment.groupBy({
      by: ["status"],
      where: { date: { gte: from, lt: to } },
      _count: { _all: true },
    }),
  );

  console.log("\nPDF route data shape");
  await check("prescription with patient/physician/appointment", () =>
    prisma.prescription.findUnique({
      where: { id: prescription.id },
      include: { patient: true, physician: true, consultation: { include: { appointment: true } } },
    }),
  );

  console.log("\nMutation guards (ownership is in the where clause)");
  await check("foreign patient cannot cancel: updateMany matches 0 rows", async () => {
    const res = await prisma.appointment.updateMany({
      where: { id: pending.id, patientId: "some-other-patient-id", status: { in: ["PENDING"] } },
      data: { status: "CANCELLED", cancelReason: "should not apply" },
    });
    if (res.count !== 0) throw new Error("expected 0 rows updated, got " + res.count);
    const still = await prisma.appointment.findUnique({ where: { id: pending.id } });
    if (still?.status !== "PENDING") throw new Error("row was modified by a foreign patient id");
  });
  await check("owner can cancel: updateMany matches 1 row", async () => {
    const res = await prisma.appointment.updateMany({
      where: { id: pending.id, patientId: patient.id, status: { in: ["PENDING", "SCHEDULED", "ACCEPTED"] } },
      data: { status: "CANCELLED", cancelReason: "verified" },
    });
    if (res.count !== 1) throw new Error("expected 1 row updated, got " + res.count);
  });

  console.log("\nCleaning up...");
  await prisma.prescription.deleteMany({ where: { patientId: patient.id } });
  await prisma.consultation.deleteMany({ where: { patientId: patient.id } });
  await prisma.appointment.deleteMany({ where: { patientId: patient.id } });
  await prisma.patientProfile.delete({ where: { id: patient.id } });
  await prisma.physicianProfile.delete({ where: { id: physician.id } });
  await prisma.staffProfile.delete({ where: { id: staff.id } });

  console.log("\n" + passed + " passed, " + failures.length + " failed");
  if (failures.length > 0) {
    failures.forEach((f) => console.log("  - " + f));
    process.exitCode = 1;
  }
}

main()
  .catch((err) => {
    console.error("Verification aborted:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
