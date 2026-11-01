"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";
import type { AppointmentStatus } from "@/app/generated/prisma/enums";

export type ActionState = { error?: string; success?: string };

async function guard(): Promise<{ ok: true } | { ok: false; state: ActionState }> {
  try {
    await authorize("STAFF");
    return { ok: true };
  } catch {
    return { ok: false, state: { error: "You do not have permission to do that." } };
  }
}

function refresh() {
  revalidatePath("/staff/dashboard");
  revalidatePath("/staff/schedule");
  revalidatePath("/staff/patients");
}

/** WBS 3.2.2 - assign a date and time to a pending request. */
export async function assignSlot(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return g.state;

  const id = String(formData.get("appointmentId") ?? "");
  const when = String(formData.get("date") ?? "");
  const physicianId = String(formData.get("physicianId") ?? "");

  const date = when ? new Date(when) : null;
  if (!date || Number.isNaN(date.getTime())) return { error: "Choose a valid date and time." };

  const updated = await prisma.appointment.updateMany({
    where: { id, status: { in: ["PENDING", "SCHEDULED"] } },
    data: { date, status: "SCHEDULED", physicianId: physicianId || null },
  });
  if (updated.count === 0) return { error: "That request can no longer be assigned." };

  refresh();
  return { success: "Slot assigned. The patient has been asked to confirm." };
}

/** WBS 3.2.4 - reschedule an already-assigned appointment. */
export async function rescheduleAppointment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return g.state;

  const id = String(formData.get("appointmentId") ?? "");
  const when = String(formData.get("date") ?? "");
  const date = when ? new Date(when) : null;
  if (!date || Number.isNaN(date.getTime())) return { error: "Choose a valid date and time." };

  const updated = await prisma.appointment.updateMany({
    where: { id, status: { in: ["SCHEDULED", "ACCEPTED"] } },
    data: { date, status: "SCHEDULED" },
  });
  if (updated.count === 0) return { error: "That appointment cannot be rescheduled." };

  refresh();
  return { success: "Appointment rescheduled. The patient must confirm the new time." };
}

/** WBS 3.2.5 - staff cancellation. */
export async function staffCancelAppointment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return g.state;

  const id = String(formData.get("appointmentId") ?? "");
  const cancelReason = String(formData.get("cancelReason") ?? "").trim();
  if (cancelReason.length < 4) return { error: "Give a reason for the cancellation." };

  const updated = await prisma.appointment.updateMany({
    where: { id, status: { in: ["PENDING", "SCHEDULED", "ACCEPTED", "CHECKED_IN"] } },
    data: { status: "CANCELLED", cancelReason },
  });
  if (updated.count === 0) return { error: "That appointment is already closed." };

  refresh();
  return { success: "Appointment cancelled." };
}

/** WBS 3.4.2 / 3.4.3 - check-in and the rest of the status lifecycle. */
export async function setAppointmentStatus(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return g.state;

  const id = String(formData.get("appointmentId") ?? "");
  const status = String(formData.get("status") ?? "") as AppointmentStatus;

  const allowed: AppointmentStatus[] = ["CHECKED_IN", "NO_SHOW", "COMPLETED"];
  if (!allowed.includes(status)) return { error: "That status change is not allowed here." };

  const updated = await prisma.appointment.updateMany({
    where: { id, status: { in: ["SCHEDULED", "ACCEPTED", "CHECKED_IN"] } },
    data: { status },
  });
  if (updated.count === 0) return { error: "That appointment is already closed." };

  refresh();
  return { success: "Status updated." };
}

/** WBS 2.3.1 / 2.3.2 - proxy registration for walk-in or phone patients. */
export async function registerPatientByProxy(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return g.state;

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const sex = String(formData.get("sex") ?? "").trim();
  const dobRaw = String(formData.get("dob") ?? "").trim();

  if (!firstName || !lastName || !email) {
    return { error: "Name and email are required." };
  }

  const clash = await prisma.patientProfile.findUnique({ where: { email } });
  if (clash) return { error: "A patient with that email already exists." };

  const dob = dobRaw ? new Date(dobRaw) : null;
  if (dob && Number.isNaN(dob.getTime())) return { error: "Enter a valid date of birth." };
  if (dob && dob.getTime() > Date.now()) {
    return { error: "Date of birth cannot be in the future." };
  }

  // clerkId is a placeholder until the patient registers themselves and claims
  // the record by email. It is unique, so it never collides with a real Clerk id.
  await prisma.patientProfile.create({
    data: {
      clerkId: "proxy:" + email,
      firstName,
      lastName,
      email,
      phone: phone || null,
      sex: sex || null,
      dob,
    },
  });

  refresh();
  return { success: firstName + " " + lastName + " was registered." };
}

/** WBS 3.2.3 - book on behalf of a walk-in patient. */
export async function proxyBookAppointment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return g.state;

  const patientId = String(formData.get("patientId") ?? "");
  const when = String(formData.get("date") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  const physicianId = String(formData.get("physicianId") ?? "");

  const date = when ? new Date(when) : null;
  if (!patientId) return { error: "Choose a patient." };
  if (!date || Number.isNaN(date.getTime())) return { error: "Choose a valid date and time." };
  if (!reason) return { error: "Enter the reason for the visit." };

  const patient = await prisma.patientProfile.findUnique({ where: { id: patientId } });
  if (!patient) return { error: "That patient no longer exists." };

  // Booked in person, so it is confirmed immediately.
  await prisma.appointment.create({
    data: { patientId, date, reason, status: "ACCEPTED", physicianId: physicianId || null },
  });

  refresh();
  return { success: "Appointment booked." };
}

/** WBS 2.1.3 - staff updates a patient's contact details. */
export async function staffUpdatePatient(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return g.state;

  const id = String(formData.get("patientId") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  if (!firstName || !lastName) return { error: "Name cannot be empty." };

  await prisma.patientProfile.update({
    where: { id },
    data: { firstName, lastName, phone: phone || null },
  });

  refresh();
  return { success: "Patient details updated." };
}

/** WBS 5.2.2-5.2.4 - digitize the handwritten prescription. */
export async function digitizePrescription(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return g.state;

  const consultationId = String(formData.get("consultationId") ?? "");
  const instructions = String(formData.get("instructions") ?? "").trim();

  const names = formData.getAll("medicine").map(String);
  const dosages = formData.getAll("dosage").map(String);
  const frequencies = formData.getAll("frequency").map(String);
  const timings = formData.getAll("timing").map(String);
  const durations = formData.getAll("duration").map(String);

  const medicines = names
    .map((name, i) => ({
      name: name.trim(),
      dosage: (dosages[i] ?? "").trim(),
      frequency: (frequencies[i] ?? "").trim(),
      timing: (timings[i] ?? "").trim(),
      duration: (durations[i] ?? "").trim(),
    }))
    .filter((m) => m.name.length > 0);

  if (medicines.length === 0) return { error: "Add at least one medicine." };

  const consultation = await prisma.consultation.findUnique({ where: { id: consultationId } });
  if (!consultation) return { error: "That consultation no longer exists." };

  // medicineDetails holds the structured lines as JSON so the existing column
  // carries name/dosage/frequency/timing/duration without a schema change.
  await prisma.prescription.create({
    data: {
      consultationId,
      patientId: consultation.patientId,
      physicianId: consultation.physicianId,
      medicineDetails: JSON.stringify(medicines),
      instructions: instructions || null,
    },
  });

  revalidatePath("/staff/prescriptions");
  return { success: "Prescription digitized. The PDF is ready to print or download." };
}
