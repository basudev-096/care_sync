"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";

export type ProvisionState = { error?: string; success?: string };

/**
 * Provision a physician (WBS 1.2.1) or staff (WBS 1.3.1) account.
 *
 * Guarded with authorize("STAFF"): the check runs server-side inside the action
 * itself, so it holds even if the caller never renders the page -- a direct POST
 * from a patient session throws FORBIDDEN before any Clerk or database write.
 */
export async function provisionAccount(
  _prev: ProvisionState,
  formData: FormData,
): Promise<ProvisionState> {
  try {
    await authorize("STAFF");
  } catch {
    return { error: "You don't have permission to create accounts." };
  }

  const role = String(formData.get("role") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const specialty = String(formData.get("specialty") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (role !== "PHYSICIAN" && role !== "STAFF") {
    return { error: "Choose whether this is a physician or a staff account." };
  }
  if (!email || !firstName || !lastName) {
    return { error: "Name and email are required." };
  }
  if (password.length < 8) {
    return { error: "The temporary password must be at least 8 characters." };
  }

  // One person, one role: reject an email that already exists anywhere.
  const [p, ph, st] = await Promise.all([
    prisma.patientProfile.findUnique({ where: { email } }),
    prisma.physicianProfile.findUnique({ where: { email } }),
    prisma.staffProfile.findUnique({ where: { email } }),
  ]);
  if (p || ph || st) {
    return { error: "An account with these credentials already exists. Ask them to sign in instead." };
  }

  const client = await clerkClient();

  let clerkUserId: string | undefined;
  try {
    const created = await client.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
    });
    clerkUserId = created.id;

    if (role === "PHYSICIAN") {
      await prisma.physicianProfile.create({
        data: { clerkId: created.id, email, firstName, lastName, specialty: specialty || null },
      });
    } else {
      await prisma.staffProfile.create({
        data: { clerkId: created.id, email, firstName, lastName },
      });
    }
  } catch (err) {
    // Never leave a Clerk account without a profile row -- that account would
    // otherwise fall through to patient self-registration on first sign-in.
    if (clerkUserId) {
      await client.users.deleteUser(clerkUserId).catch(() => {});
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return { error: `Could not create the account: ${message}` };
  }

  revalidatePath("/staff/accounts");
  return {
    success: `${role === "PHYSICIAN" ? "Physician" : "Staff"} account created for ${firstName} ${lastName}. Share the temporary password securely.`,
  };
}
