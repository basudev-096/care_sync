/**
 * One command to get a working clinic you can actually click through.
 *
 * Creates a staff, physician and patient account (all with the same password),
 * plus appointments at every stage of the WBS lifecycle, a consultation note
 * and a digitised prescription -- so every page has something on it.
 *
 * Sign-up is CAPTCHA-protected; sign-in is not. These accounts are made through
 * Clerk's Backend API, so they sidestep the sign-up widget completely.
 *
 *   npm run seed:demo -- "Passw0rd!2026"
 *
 * Re-running is safe: existing accounts are reused, and demo clinical rows are
 * cleared and rebuilt. Remove everything with: npm run seed:demo -- --clean
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { createClerkClient } from "@clerk/backend";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const arg = process.argv[2];
const CLEAN = arg === "--clean";
const PASSWORD = CLEAN ? "" : arg;

if (!CLEAN && (!PASSWORD || PASSWORD.length < 15)) {
  console.error('\nUsage: npm run seed:demo -- "<password, 15+ chars>"');
  console.error("       npm run seed:demo -- --clean\n");
  process.exit(1);
}

const secretKey = process.env.CLERK_SECRET_KEY;
const connectionString = process.env.DATABASE_URL;
if (!secretKey || !connectionString) {
  console.error("CLERK_SECRET_KEY and DATABASE_URL must be set in .env.local");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
const clerk = createClerkClient({ secretKey });

const PEOPLE = {
  staff: { email: "staff@careclinic.test", firstName: "Ada", lastName: "Reception" },
  physician: { email: "physician@careclinic.test", firstName: "Raj", lastName: "Mehta" },
  patient: { email: "patient@careclinic.test", firstName: "Mia", lastName: "Turner" },
};

/** Create the Clerk user if missing, and return its id. */
async function ensureClerkUser(p: { email: string; firstName: string; lastName: string }) {
  const found = await clerk.users.getUserList({ emailAddress: [p.email] });
  if (found.data[0]) return found.data[0].id;

  const created = await clerk.users.createUser({
    emailAddress: [p.email],
    password: PASSWORD,
    firstName: p.firstName,
    lastName: p.lastName,
    skipPasswordChecks: true,
  });
  return created.id;
}

async function clean() {
  const emails = Object.values(PEOPLE).map((p) => p.email);

  const patients = await prisma.patientProfile.findMany({ where: { email: { in: emails } } });
  for (const p of patients) {
    await prisma.prescription.deleteMany({ where: { patientId: p.id } });
    await prisma.consultation.deleteMany({ where: { patientId: p.id } });
    await prisma.appointment.deleteMany({ where: { patientId: p.id } });
  }
  await prisma.patientProfile.deleteMany({ where: { email: { in: emails } } });
  await prisma.physicianProfile.deleteMany({ where: { email: { in: emails } } });
  await prisma.staffProfile.deleteMany({ where: { email: { in: emails } } });

  for (const p of Object.values(PEOPLE)) {
    const found = await clerk.users.getUserList({ emailAddress: [p.email] });
    for (const u of found.data) await clerk.users.deleteUser(u.id).catch(() => {});
  }
  console.log("Demo accounts and data removed.");
}

async function main() {
  if (CLEAN) return clean();

  console.log("Creating accounts...");

  const staffId = await ensureClerkUser(PEOPLE.staff);
  const physicianId = await ensureClerkUser(PEOPLE.physician);
  const patientId = await ensureClerkUser(PEOPLE.patient);

  const staff = await prisma.staffProfile.upsert({
    where: { email: PEOPLE.staff.email },
    update: { clerkId: staffId },
    create: { clerkId: staffId, ...PEOPLE.staff },
  });

  const physician = await prisma.physicianProfile.upsert({
    where: { email: PEOPLE.physician.email },
    update: { clerkId: physicianId },
    create: { clerkId: physicianId, ...PEOPLE.physician, specialty: "General medicine" },
  });

  const patient = await prisma.patientProfile.upsert({
    where: { email: PEOPLE.patient.email },
    update: { clerkId: patientId },
    create: {
      clerkId: patientId,
      ...PEOPLE.patient,
      phone: "555 0142",
      sex: "Female",
      dob: new Date("1991-03-14"),
    },
  });

  // Rebuild clinical data so re-running gives a predictable state.
  await prisma.prescription.deleteMany({ where: { patientId: patient.id } });
  await prisma.consultation.deleteMany({ where: { patientId: patient.id } });
  await prisma.appointment.deleteMany({ where: { patientId: patient.id } });

  console.log("Creating clinical data...");

  const at = (dayOffset: number, hour: number) => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  // 3.1.1 - a request with no slot, waiting on reception.
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      reason: "Persistent cough for two weeks, worse at night.",
      status: "PENDING",
      date: null,
    },
  });

  // 3.2.2 - reception assigned a slot; patient has not confirmed yet.
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      physicianId: physician.id,
      reason: "Follow-up on blood pressure readings.",
      status: "SCHEDULED",
      date: at(2, 10),
    },
  });

  // Confirmed and on today's list for both physician and reception.
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      physicianId: physician.id,
      reason: "Annual review and repeat prescription.",
      status: "ACCEPTED",
      date: at(0, 15),
    },
  });

  // A completed visit with a note and a digitised prescription.
  const completed = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      physicianId: physician.id,
      reason: "Sore throat and fever.",
      status: "COMPLETED",
      date: at(-9, 11),
    },
  });

  const consultation = await prisma.consultation.create({
    data: {
      appointmentId: completed.id,
      patientId: patient.id,
      physicianId: physician.id,
      symptoms: "Sore throat for four days, fever to 38.4C, no cough.",
      diagnosis: "Acute bacterial tonsillitis. Differential: viral pharyngitis.",
      advice: "Complete the antibiotic course. Return if fever persists beyond 48 hours.",
    },
  });

  await prisma.prescription.create({
    data: {
      consultationId: consultation.id,
      patientId: patient.id,
      physicianId: physician.id,
      medicineDetails: JSON.stringify([
        { name: "Amoxicillin", dosage: "500 mg", frequency: "3 times daily", timing: "After food", duration: "5 days" },
        { name: "Paracetamol", dosage: "500 mg", frequency: "As needed", timing: "Max 4 doses daily", duration: "3 days" },
      ]),
      instructions: "Finish the full antibiotic course even if symptoms improve.",
    },
  });

  // A second completed visit with no note yet -- shows in "Pending notes".
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      physicianId: physician.id,
      reason: "Ankle sprain review.",
      status: "CHECKED_IN",
      date: at(0, 9),
    },
  });

  console.log("\nDone. Sign in at http://localhost:3000/sign-in\n");
  console.log("  Staff      " + staff.email);
  console.log("  Physician  " + physician.email);
  console.log("  Patient    " + patient.email);
  console.log("  Password   " + PASSWORD + "  (all three)");
  console.log("\nSign-in has no CAPTCHA, so the Turnstile problem does not apply here.");
  console.log("If Clerk asks for an email code on a dev instance, use 424242.");
}

main()
  .catch((err) => {
    const detail =
      (err?.errors && JSON.stringify(err.errors)) ||
      (err instanceof Error ? err.message : String(err));
    console.error("\nSeed failed:\n  " + detail);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
