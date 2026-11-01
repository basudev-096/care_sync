/**
 * Creates an account of any role, bypassing the sign-up page entirely.
 *
 * Clerk's bot protection (Turnstile) applies to SIGN-UP only -- sign-in has no
 * CAPTCHA. So when the sign-up widget is blocked by a browser extension or is
 * looping, accounts created here still work: the person just signs in normally
 * at /sign-in.
 *
 * This also creates the matching profile row, which is what actually grants the
 * role -- a Clerk user with no profile row has no access to anything.
 *
 *   npm run account -- staff     ops@clinic.test  Ada  Reception  "Passw0rd!2026"
 *   npm run account -- physician doc@clinic.test  Raj  Mehta      "Passw0rd!2026"
 *
 * If a Clerk account already exists for that email, the password argument is
 * optional and is ignored -- the existing account keeps its own password and
 * simply gains the role:
 *
 *   npm run account -- staff existing@already.signed.up  Ada  Reception
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { createClerkClient } from "@clerk/backend";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const ROLES = ["patient", "physician", "staff"] as const;
type Role = (typeof ROLES)[number];

const [roleArg, emailArg, firstName, lastName, password] = process.argv.slice(2);

function usage(message: string): never {
  console.error("\n" + message + "\n");
  console.error('Usage: npm run account -- <patient|physician|staff> <email> <first> <last> "<password>"');
  process.exit(1);
}

if (!roleArg || !ROLES.includes(roleArg as Role)) {
  usage("First argument must be one of: " + ROLES.join(", "));
}
if (!emailArg || !firstName || !lastName) {
  usage("Role, email, first name and last name are required.");
}
if (password && password.length < 15) usage("Password must be at least 15 characters (Clerk instance minimum).");

const role = roleArg as Role;
const email = emailArg.trim().toLowerCase();

const secretKey = process.env.CLERK_SECRET_KEY;
const connectionString = process.env.DATABASE_URL;
if (!secretKey) usage("CLERK_SECRET_KEY is missing from .env.local");
if (!connectionString) usage("DATABASE_URL is missing from .env.local");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
const clerk = createClerkClient({ secretKey });

async function main() {
  // One person, one role - refuse if this email is already taken anywhere.
  const [asPatient, asPhysician, asStaff] = await Promise.all([
    prisma.patientProfile.findUnique({ where: { email } }),
    prisma.physicianProfile.findUnique({ where: { email } }),
    prisma.staffProfile.findUnique({ where: { email } }),
  ]);

  const existing = asPatient ? "patient" : asPhysician ? "physician" : asStaff ? "staff" : null;
  if (existing) {
    console.log(`${email} already has a ${existing} profile. Sign in at /sign-in instead.`);
    return;
  }

  // Reuse a Clerk account if one already exists for this email.
  const found = await clerk.users.getUserList({ emailAddress: [email] });
  let clerkUser = found.data[0];

  if (clerkUser) {
    console.log("Reusing the existing Clerk account for " + email + " (password unchanged).");
  } else {
    if (!password) {
      usage(
        "No Clerk account exists for " + email + ", so a password is required to create one.",
      );
    }
    clerkUser = await clerk.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
      // Demo passwords are often in breach lists; this keeps setup unblocked.
      skipPasswordChecks: true,
    });
    console.log("Clerk account created.");
  }

  const verified =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.verification
      ?.status ?? "unknown";

  if (role === "patient") {
    await prisma.patientProfile.create({
      data: { clerkId: clerkUser.id, email, firstName, lastName },
    });
  } else if (role === "physician") {
    await prisma.physicianProfile.create({
      data: { clerkId: clerkUser.id, email, firstName, lastName, specialty: "General medicine" },
    });
  } else {
    await prisma.staffProfile.create({
      data: { clerkId: clerkUser.id, email, firstName, lastName },
    });
  }

  console.log("\n  role      " + role);
  console.log("  email     " + email);
  console.log("  password  " + (password || "(existing account - unchanged)"));
  console.log("  email verification status: " + verified);
  console.log("\nSign in at http://localhost:3000/sign-in - no CAPTCHA on sign-in.");

  if (verified !== "verified") {
    console.log(
      "\nNote: the email is not marked verified, so Clerk may ask for a code on\n" +
        "first sign-in. Dev instances accept the test code 424242.",
    );
  }
}

main()
  .catch((err) => {
    const detail =
      (err?.errors && JSON.stringify(err.errors)) ||
      (err instanceof Error ? err.message : String(err));
    console.error("\nCould not create the account:\n  " + detail);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
