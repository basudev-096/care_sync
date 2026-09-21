"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";

export type ActionState = { error?: string; success?: string };

/** WBS 3.1.1 — request a consultation without choosing a slot. */
export async function requestConsultation(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let me;
  try {
    me = await authorize("PATIENT");
  } catch {
    return { error: "You don't have permission to do that." };
  }

  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 4) {
    return { error: "Please describe the reason for your visit." };
  }

  // One open request at a time keeps the reception queue meaningful.
  const open = await prisma.appointment.findFirst({
    where: { patientId: me.profile.id, status: { in: ["PENDING", "SCHEDULED", "ACCEPTED", "CHECKED_IN"] } },
  });
  if (open) {
    return { error: "You already have an open appointment. Cancel it before requesting another." };
  }

  await prisma.appointment.create({
    data: { patientId: me.profile.id, reason, status: "PENDING", date: null },
  });

  revalidatePath("/patient/appointments");
  revalidatePath("/patient/dashboard");
  return { success: "Request sent. Reception will assign a date and time." };
}

/** WBS 3.1.3 — accept the slot reception assigned. */
export async function acceptSlot(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let me;
  try {
    me = await authorize("PATIENT");
  } catch {
    return { error: "You don't have permission to do that." };
  }

  const id = String(formData.get("appointmentId") ?? "");

  // Ownership is part of the where clause: a patient can only ever touch their
  // own appointment, whatever id they submit.
  const updated = await prisma.appointment.updateMany({
    where: { id, patientId: me.profile.id, status: "SCHEDULED" },
    data: { status: "ACCEPTED" },
  });

  if (updated.count === 0) {
    return { error: "That appointment can no longer be accepted." };
  }

  revalidatePath("/patient/appointments");
  revalidatePath("/patient/dashboard");
  return { success: "Appointment confirmed." };
}

/** WBS 3.3.1 / 3.3.2 — cancel an upcoming appointment, reason mandatory. */
export async function cancelMyAppointment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let me;
  try {
    me = await authorize("PATIENT");
  } catch {
    return { error: "You don't have permission to do that." };
  }

  const id = String(formData.get("appointmentId") ?? "");
  const cancelReason = String(formData.get("cancelReason") ?? "").trim();

  if (cancelReason.length < 4) {
    return { error: "A reason is required to cancel." };
  }

  const updated = await prisma.appointment.updateMany({
    where: {
      id,
      patientId: me.profile.id,
      status: { in: ["PENDING", "SCHEDULED", "ACCEPTED"] },
    },
    data: { status: "CANCELLED", cancelReason },
  });

  if (updated.count === 0) {
    return { error: "That appointment can no longer be cancelled." };
  }

  revalidatePath("/patient/appointments");
  revalidatePath("/patient/dashboard");
  return { success: "Appointment cancelled." };
}

/** WBS 2.1.2 — patient updates their own demographics. */
export async function updateMyProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let me;
  try {
    me = await authorize("PATIENT");
  } catch {
    return { error: "You don't have permission to do that." };
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const sex = String(formData.get("sex") ?? "").trim();
  const dobRaw = String(formData.get("dob") ?? "").trim();

  if (!firstName || !lastName) return { error: "Name cannot be empty." };

  const dob = dobRaw ? new Date(dobRaw) : null;
  if (dob && Number.isNaN(dob.getTime())) return { error: "Enter a valid date of birth." };
  if (dob && dob.getTime() > Date.now()) {
    return { error: "Date of birth cannot be in the future." };
  }

  // Email is intentionally not editable here: it is the Clerk identity.
  await prisma.patientProfile.update({
    where: { id: me.profile.id },
    data: { firstName, lastName, phone: phone || null, sex: sex || null, dob },
  });

  revalidatePath("/patient/profile");
  return { success: "Your details were updated." };
}
