/**
 * Creates the first clinic staff account.
 *
 * Physician and staff accounts are only ever created by existing staff, which
 * leaves no way to create the very first one from inside the app. Run this once
 * per environment, from a trusted machine:
 *
 *   npx tsx scripts/bootstrap-staff.ts "ops@clinic.test" "Ada" "Reception" "<password>"
 *
 * It is deliberately a CLI script and not an HTTP route, so it cannot be
 * reached by anyone on the network.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { createClerkClient } from "@clerk/backend";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const [email, firstName, lastName, password] = process.argv.slice(2);

if (!email || !firstName || !lastName || !password) {
  console.error('Usage: npx tsx scripts/bootstrap-staff.ts "<email>" "<first>" "<last>" "<password>"');
  process.exit(1);
}

const secretKey = process.env.CLERK_SECRET_KEY;
const connectionString = process.env.DATABASE_URL;
if (!secretKey || !connectionString) {
  console.error("CLERK_SECRET_KEY and DATABASE_URL must be set (.env.local).");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
const clerk = createClerkClient({ secretKey });

async function main() {
  const normalised = email.trim().toLowerCase();

  const existing = await prisma.staffProfile.findUnique({ where: { email: normalised } });
  if (existing) {
    console.log(`Staff account already exists for ${normalised} — nothing to do.`);
    return;
  }

  // Reuse the Clerk account if one is already there (e.g. from an earlier run).
  const found = await clerk.users.getUserList({ emailAddress: [normalised] });
  const clerkUser =
    found.data[0] ??
    (await clerk.users.createUser({
      emailAddress: [normalised],
      password,
      firstName,
      lastName,
    }));

  // A bootstrapped operator must not also be a patient.
  const asPatient = await prisma.patientProfile.findUnique({ where: { clerkId: clerkUser.id } });
  if (asPatient) {
    await prisma.patientProfile.delete({ where: { id: asPatient.id } });
    console.log("Removed the patient profile attached to this Clerk account.");
  }

  await prisma.staffProfile.create({
    data: { clerkId: clerkUser.id, email: normalised, firstName, lastName },
  });

  console.log(`Staff account ready: ${normalised}`);
  console.log("Sign in at /sign-in, then issue further accounts at /staff/accounts.");
}

main()
  .catch((err) => {
    console.error("Bootstrap failed:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
