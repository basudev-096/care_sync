import "server-only";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type {
  PatientProfile,
  PhysicianProfile,
  StaffProfile,
} from "@/app/generated/prisma/client";

/**
 * Roles come from the database, never from the client.
 *
 * A user's role is decided by which profile table holds their Clerk id. That
 * makes the role unforgeable: there is no client-writable field (Clerk
 * `unsafeMetadata` is writable from the browser) and no request header a user
 * could tamper with. Per the WBS, only patients self-register (1.1.1) -- a
 * physician (1.2.1) or staff (1.3.1) row is created for them by clinic staff.
 */
export type AppRole = "PATIENT" | "PHYSICIAN" | "STAFF";

export type SessionUser =
  | { clerkId: string; role: "PATIENT"; profile: PatientProfile }
  | { clerkId: string; role: "PHYSICIAN"; profile: PhysicianProfile }
  | { clerkId: string; role: "STAFF"; profile: StaffProfile };

export const HOME_BY_ROLE: Record<AppRole, string> = {
  PATIENT: "/patient/dashboard",
  PHYSICIAN: "/physician/dashboard",
  STAFF: "/staff/dashboard",
};

export const ROLE_LABEL: Record<AppRole, string> = {
  PATIENT: "Patient",
  PHYSICIAN: "Physician",
  STAFF: "Clinic Staff",
};

/**
 * Resolve the signed-in user and their role straight from the database on every
 * call. Returns null when nobody is signed in, and a `role: null` result when
 * the Clerk account has no profile row yet (a patient mid-registration).
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const [patient, physician, staff] = await Promise.all([
    prisma.patientProfile.findUnique({ where: { clerkId: userId } }),
    prisma.physicianProfile.findUnique({ where: { clerkId: userId } }),
    prisma.staffProfile.findUnique({ where: { clerkId: userId } }),
  ]);

  // Staff outranks physician outranks patient if rows ever overlap, so a
  // duplicate row can never silently widen access beyond one role.
  if (staff) return { clerkId: userId, role: "STAFF", profile: staff };
  if (physician) return { clerkId: userId, role: "PHYSICIAN", profile: physician };
  if (patient) return { clerkId: userId, role: "PATIENT", profile: patient };

  return null;
}

/** True when a Clerk session exists but no profile row does yet. */
export async function isAwaitingRegistration(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;
  return (await getSessionUser()) === null;
}

/**
 * Require a signed-in user with a profile. Use at the top of any protected page,
 * layout, route handler or server action.
 */
export async function requireUser(): Promise<SessionUser> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getSessionUser();
  if (!user) redirect("/complete-registration");

  return user;
}

/**
 * Require one of `allowed`. Renders nothing and exposes no data for a user whose
 * role is not permitted -- the redirect happens before the page body runs.
 */
export async function requireRole<R extends AppRole>(
  ...allowed: R[]
): Promise<Extract<SessionUser, { role: R }>> {
  const user = await requireUser();

  if (!allowed.includes(user.role as R)) {
    redirect(`/unauthorized?from=${encodeURIComponent(HOME_BY_ROLE[user.role])}`);
  }

  return user as Extract<SessionUser, { role: R }>;
}

/**
 * Server-action / route-handler variant. Throws instead of redirecting so a
 * mutation fails loudly rather than returning a redirect a client could ignore.
 */
export async function authorize<R extends AppRole>(
  ...allowed: R[]
): Promise<Extract<SessionUser, { role: R }>> {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  if (!allowed.includes(user.role as R)) {
    throw new Error("FORBIDDEN");
  }

  return user as Extract<SessionUser, { role: R }>;
}
