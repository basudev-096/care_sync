"use client";

import { ActionForm, SubmitButton, Disclosure } from "@/components/forms";
import { textareaClass, inputClass, labelClass } from "@/components/ui-kit";
import { requestConsultation, acceptSlot, cancelMyAppointment } from "../actions";

/** WBS 3.1.1 - submit a consultation request with no slot. */
export function RequestForm({ hasOpen }: { hasOpen: boolean }) {
  if (hasOpen) {
    return (
      <p className="text-[13px] text-muted-foreground">
        You already have an open appointment. Cancel it first if you need a different visit.
      </p>
    );
  }

  return (
    <ActionForm action={requestConsultation}>
      <div>
        <label className={labelClass} htmlFor="reason">
          What do you need to be seen for?
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={4}
          required
          minLength={4}
          className={textareaClass}
          placeholder="Describe your symptoms or the reason for the visit."
        />
      </div>
      <SubmitButton pendingLabel="Sending…" className="w-full">
        Send request
      </SubmitButton>
    </ActionForm>
  );
}

export function AcceptButton({ appointmentId }: { appointmentId: string }) {
  return (
    <ActionForm action={acceptSlot} className="contents">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <SubmitButton variant="secondary" pendingLabel="Confirming…">
        Confirm this time
      </SubmitButton>
    </ActionForm>
  );
}

/** WBS 3.3.2 - cancellation cannot be submitted without an explicit reason. */
export function CancelForm({ appointmentId }: { appointmentId: string }) {
  return (
    <Disclosure label="Cancel" variant="danger">
      <ActionForm action={cancelMyAppointment} className="space-y-2.5 max-w-sm">
        <input type="hidden" name="appointmentId" value={appointmentId} />
        <div>
          <label className={labelClass} htmlFor={`why-${appointmentId}`}>
            Reason for cancelling
          </label>
          <input
            id={`why-${appointmentId}`}
            name="cancelReason"
            required
            minLength={4}
            className={inputClass}
            placeholder="Required"
          />
        </div>
        <SubmitButton variant="danger" pendingLabel="Cancelling…">
          Confirm cancellation
        </SubmitButton>
      </ActionForm>
    </Disclosure>
  );
}
