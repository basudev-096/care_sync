"use client";

import { ActionForm, SubmitButton, Disclosure } from "@/components/forms";
import { inputClass, labelClass } from "@/components/ui-kit";
import type { btn } from "@/components/ui-kit";
import {
  assignSlot,
  rescheduleAppointment,
  staffCancelAppointment,
  setAppointmentStatus,
  proxyBookAppointment,
} from "../actions";

type Physician = { id: string; label: string };

/** WBS 3.2.2 - assign a date/time (and optionally a physician) to a request. */
export function AssignForm({
  appointmentId,
  physicians,
}: {
  appointmentId: string;
  physicians: Physician[];
}) {
  return (
    <ActionForm action={assignSlot} className="space-y-2.5">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <div className="flex flex-wrap gap-2.5 items-end">
        <div className="min-w-[13rem]">
          <label className={labelClass} htmlFor={`when-${appointmentId}`}>Date and time</label>
          <input id={`when-${appointmentId}`} type="datetime-local" name="date" required className={inputClass} />
        </div>
        <div className="min-w-[12rem]">
          <label className={labelClass} htmlFor={`doc-${appointmentId}`}>Physician</label>
          <select id={`doc-${appointmentId}`} name="physicianId" className={inputClass} defaultValue="">
            <option value="">Unassigned</option>
            {physicians.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
        <SubmitButton pendingLabel="Assigning…">Assign slot</SubmitButton>
      </div>
    </ActionForm>
  );
}

/** WBS 3.2.4 */
export function RescheduleForm({ appointmentId }: { appointmentId: string }) {
  return (
    <Disclosure label="Reschedule">
      <ActionForm action={rescheduleAppointment} className="space-y-2.5">
        <input type="hidden" name="appointmentId" value={appointmentId} />
        <div className="flex flex-wrap gap-2.5 items-end">
          <div className="min-w-[13rem]">
            <label className={labelClass} htmlFor={`re-${appointmentId}`}>New date and time</label>
            <input id={`re-${appointmentId}`} type="datetime-local" name="date" required className={inputClass} />
          </div>
          <SubmitButton pendingLabel="Moving…">Reschedule</SubmitButton>
        </div>
      </ActionForm>
    </Disclosure>
  );
}

/** WBS 3.2.5 */
export function StaffCancelForm({ appointmentId }: { appointmentId: string }) {
  return (
    <Disclosure label="Cancel" variant="danger">
      <ActionForm action={staffCancelAppointment} className="space-y-2.5 max-w-sm">
        <input type="hidden" name="appointmentId" value={appointmentId} />
        <div>
          <label className={labelClass} htmlFor={`scx-${appointmentId}`}>Reason</label>
          <input id={`scx-${appointmentId}`} name="cancelReason" required minLength={4}
            className={inputClass} placeholder="Required" />
        </div>
        <SubmitButton variant="danger" pendingLabel="Cancelling…">Confirm cancellation</SubmitButton>
      </ActionForm>
    </Disclosure>
  );
}

/** WBS 3.4.2 / 3.4.3 - check-in, no-show, complete. */
export function StatusButton({
  appointmentId,
  status,
  label,
  variant = "outline",
}: {
  appointmentId: string;
  status: string;
  label: string;
  variant?: keyof typeof btn;
}) {
  return (
    <ActionForm action={setAppointmentStatus} className="contents" hideFeedback>
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <input type="hidden" name="status" value={status} />
      <SubmitButton variant={variant} pendingLabel="…">{label}</SubmitButton>
    </ActionForm>
  );
}

/** WBS 3.2.3 - proxy booking for walk-in or calling patients. */
export function ProxyBookForm({
  patients,
  physicians,
}: {
  patients: { id: string; label: string }[];
  physicians: Physician[];
}) {
  return (
    <ActionForm action={proxyBookAppointment}>
      <div>
        <label className={labelClass} htmlFor="pb-patient">Patient</label>
        <select id="pb-patient" name="patientId" required className={inputClass} defaultValue="">
          <option value="" disabled>Choose a registered patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="pb-when">Date and time</label>
        <input id="pb-when" type="datetime-local" name="date" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="pb-doc">Physician</label>
        <select id="pb-doc" name="physicianId" className={inputClass} defaultValue="">
          <option value="">Unassigned</option>
          {physicians.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="pb-reason">Reason for visit</label>
        <input id="pb-reason" name="reason" required className={inputClass} />
      </div>
      <SubmitButton pendingLabel="Booking…" className="w-full">Book appointment</SubmitButton>
    </ActionForm>
  );
}
