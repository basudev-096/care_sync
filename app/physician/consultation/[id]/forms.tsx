"use client";

import { ActionForm, SubmitButton, Disclosure } from "@/components/forms";
import { textareaClass, inputClass, labelClass } from "@/components/ui-kit";
import { saveConsultation, markCompleted, physicianCancelAppointment } from "../../actions";

export function ConsultationForm({
  appointmentId,
  defaults,
  readOnly,
}: {
  appointmentId: string;
  defaults: { symptoms: string; diagnosis: string; advice: string };
  readOnly: boolean;
}) {
  if (readOnly) {
    return (
      <dl className="grid gap-4 sm:grid-cols-3">
        <ReadOnly label="Symptoms" value={defaults.symptoms} />
        <ReadOnly label="Diagnosis" value={defaults.diagnosis} />
        <ReadOnly label="Advice" value={defaults.advice} />
      </dl>
    );
  }

  return (
    <ActionForm action={saveConsultation}>
      <input type="hidden" name="appointmentId" value={appointmentId} />

      <div>
        <label className={labelClass} htmlFor="symptoms">Symptoms</label>
        <textarea id="symptoms" name="symptoms" rows={3} defaultValue={defaults.symptoms}
          className={textareaClass} placeholder="Presenting complaint and observations" />
      </div>

      <div>
        <label className={labelClass} htmlFor="diagnosis">
          Diagnosis <span className="text-muted-foreground font-normal">(primary and differential)</span>
        </label>
        <textarea id="diagnosis" name="diagnosis" rows={3} defaultValue={defaults.diagnosis}
          className={textareaClass} placeholder="Working diagnosis, and alternatives considered" />
      </div>

      <div>
        <label className={labelClass} htmlFor="advice">Clinical advice</label>
        <textarea id="advice" name="advice" rows={3} defaultValue={defaults.advice}
          className={textareaClass} placeholder="Guidance given to the patient, follow-up, referrals" />
      </div>

      <SubmitButton pendingLabel="Saving…">Save note</SubmitButton>
    </ActionForm>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow mb-1.5">{label}</dt>
      <dd className="text-[14px] leading-relaxed whitespace-pre-wrap">
        {value || <span className="text-muted-foreground">Not recorded</span>}
      </dd>
    </div>
  );
}

export function CompleteForm({ appointmentId }: { appointmentId: string }) {
  return (
    <ActionForm action={markCompleted} className="contents">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <SubmitButton variant="secondary" pendingLabel="Completing…">
        Mark completed
      </SubmitButton>
    </ActionForm>
  );
}

export function CancelForm({ appointmentId }: { appointmentId: string }) {
  return (
    <Disclosure label="Cancel visit" variant="danger">
      <ActionForm action={physicianCancelAppointment} className="space-y-2.5 max-w-sm">
        <input type="hidden" name="appointmentId" value={appointmentId} />
        <div>
          <label className={labelClass} htmlFor={`pcx-${appointmentId}`}>Reason</label>
          <input id={`pcx-${appointmentId}`} name="cancelReason" required minLength={4}
            className={inputClass} placeholder="Required" />
        </div>
        <SubmitButton variant="danger" pendingLabel="Cancelling…">Confirm cancellation</SubmitButton>
      </ActionForm>
    </Disclosure>
  );
}
