"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";

export type ActionState = { error?: string; success?: string };

/**
 * WBS 4.2.1 / 4.2.2 - document and save a consultation note.
 *
 * The physician is taken from the session, never from the form, so a note can
 * only ever be filed under the doctor who actually wrote it.
 */
export async function saveConsultation(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let me;
  try {
    me = await authorize("PHYSICIAN");
  } catch {
    return { error: "You do not have permission to do that." };
  }

  const appointmentId = String(formData.get("appointmentId") ?? "");
  const symptoms = String(formData.get("symptoms") ?? "").trim();
  const diagnosis = String(formData.get("diagnosis") ?? "").trim();
  const advice = String(formData.get("advice") ?? "").trim();

  if (!symptoms && !diagnosis && !advice) {
    return { error: "Record at least one of symptoms, diagnosis or advice." };
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { consultation: true },
  });
  if (!appointment) return { error: "That appointment no longer exists." };

  // A physician may only write against an appointment assigned to them, or one
  // with no physician assigned yet (which this note then claims).
  if (appointment.physicianId && appointment.physicianId !== me.profile.id) {
    return { error: "This appointment belongs to another physician." };
  }

  if (appointment.consultation) {
    await prisma.consultation.update({
      where: { id: appointment.consultation.id },
      data: {
        symptoms: symptoms || null,
        diagnosis: diagnosis || null,
        advice: advice || null,
      },
    });
  } else {
    await prisma.consultation.create({
      data: {
        appointmentId,
        patientId: appointment.patientId,
        physicianId: me.profile.id,
        symptoms: symptoms || null,
        diagnosis: diagnosis || null,
        advice: advice || null,
      },
    });
    if (!appointment.physicianId) {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { physicianId: me.profile.id },
      });
    }
  }

  revalidatePath("/physician/dashboard");
  revalidatePath("/physician/consultation/" + appointmentId);
  return { success: "Consultation note saved." };
}

/** WBS 3.5.2 - advance an appointment to Completed after consultation. */
export async function markCompleted(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let me;
  try {
    me = await authorize("PHYSICIAN");
  } catch {
    return { error: "You do not have permission to do that." };
  }

  const id = String(formData.get("appointmentId") ?? "");

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { consultation: true },
  });
  if (!appointment) return { error: "That appointment no longer exists." };
  if (appointment.physicianId && appointment.physicianId !== me.profile.id) {
    return { error: "This appointment belongs to another physician." };
  }
  if (!appointment.consultation) {
    return { error: "Write the consultation note before completing the visit." };
  }

  const updated = await prisma.appointment.updateMany({
    where: { id, status: { in: ["ACCEPTED", "CHECKED_IN", "SCHEDULED"] } },
    data: { status: "COMPLETED" },
  });
  if (updated.count === 0) return { error: "That appointment is already closed." };

  revalidatePath("/physician/dashboard");
  return { success: "Visit marked as completed." };
}

/** WBS 3.5.1 - physician cancels an appointment. */
export async function physicianCancelAppointment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let me;
  try {
    me = await authorize("PHYSICIAN");
  } catch {
    return { error: "You do not have permission to do that." };
  }

  const id = String(formData.get("appointmentId") ?? "");
  const cancelReason = String(formData.get("cancelReason") ?? "").trim();
  if (cancelReason.length < 4) return { error: "Give a reason for the cancellation." };

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) return { error: "That appointment no longer exists." };
  if (appointment.physicianId && appointment.physicianId !== me.profile.id) {
    return { error: "This appointment belongs to another physician." };
  }

  const updated = await prisma.appointment.updateMany({
    where: { id, status: { in: ["SCHEDULED", "ACCEPTED", "CHECKED_IN"] } },
    data: { status: "CANCELLED", cancelReason },
  });
  if (updated.count === 0) return { error: "That appointment is already closed." };

  revalidatePath("/physician/dashboard");
  return { success: "Appointment cancelled." };
}
