"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser, HOME_BY_ROLE } from "@/lib/auth";

export type RegistrationState = { error?: string };

/**
 * Completes patient registration (WBS 1.1.1 / 2.3.2).
 *
 * The role is not a parameter and cannot be influenced by the submitted form --
 * self-registration always produces a PATIENT. Physician and staff rows are
 * created only by clinic staff.
 */
export async function completeRegistration(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const { userId } = await auth();
  if (!userId) return { error: "Your session expired. Please sign in again." };

  // Never create a second profile for an account that already has one.
  const existing = await getSessionUser();
  if (existing) redirect(HOME_BY_ROLE[existing.role]);

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const sex = String(formData.get("sex") ?? "").trim();
  const dobRaw = String(formData.get("dob") ?? "").trim();

  if (!firstName || !lastName) {
    return { error: "Please enter your first and last name." };
  }

  const dob = dobRaw ? new Date(dobRaw) : null;
  if (dob && Number.isNaN(dob.getTime())) {
    return { error: "Please enter a valid date of birth." };
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const email = clerkUser.primaryEmailAddress?.emailAddress;

  if (!email) {
    return { error: "No verified email is attached to this account." };
  }

  // An email already on a profile means the person already has an account.
  const emailTaken = await prisma.patientProfile.findUnique({ where: { email } });
  if (emailTaken) {
    redirect("/auth-error?reason=account-exists");
  }

  await prisma.patientProfile.create({
    data: {
      clerkId: userId,
      email,
      firstName,
      lastName,
      phone: phone || null,
      sex: sex || null,
      dob,
    },
  });

  redirect("/patient/dashboard");
}
