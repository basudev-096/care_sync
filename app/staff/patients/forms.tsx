"use client";

import { ActionForm, SubmitButton, Disclosure } from "@/components/forms";
import { inputClass, labelClass } from "@/components/ui-kit";
import { registerPatientByProxy, staffUpdatePatient } from "../actions";

/** WBS 2.3.1 / 2.3.2 - register a walk-in or calling patient. */
export function ProxyRegisterForm() {
  return (
    <ActionForm action={registerPatientByProxy}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="pr-first">First name</label>
          <input id="pr-first" name="firstName" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="pr-last">Last name</label>
          <input id="pr-last" name="lastName" required className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="pr-email">Email</label>
        <input id="pr-email" name="email" type="email" required className={inputClass} />
        <p className="mt-1.5 text-[12px] text-muted-foreground">
          The patient can later register with this email to claim their record.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="pr-phone">Phone</label>
        <input id="pr-phone" name="phone" type="tel" className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="pr-dob">Date of birth</label>
          <input id="pr-dob" name="dob" type="date" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="pr-sex">Sex</label>
          <select id="pr-sex" name="sex" className={inputClass} defaultValue="">
            <option value="">Not recorded</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <SubmitButton pendingLabel="Registering…" className="w-full">Register patient</SubmitButton>
    </ActionForm>
  );
}

/** WBS 2.1.3 - staff corrects a patient's contact details. */
export function EditPatientForm({
  patient,
}: {
  patient: { id: string; firstName: string; lastName: string; phone: string };
}) {
  return (
    <Disclosure label="Edit" variant="ghost">
      <ActionForm action={staffUpdatePatient} className="space-y-2.5 text-left w-60">
        <input type="hidden" name="patientId" value={patient.id} />
        <div>
          <label className={labelClass} htmlFor={`ef-${patient.id}`}>First name</label>
          <input id={`ef-${patient.id}`} name="firstName" required defaultValue={patient.firstName} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor={`el-${patient.id}`}>Last name</label>
          <input id={`el-${patient.id}`} name="lastName" required defaultValue={patient.lastName} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor={`ep-${patient.id}`}>Phone</label>
          <input id={`ep-${patient.id}`} name="phone" type="tel" defaultValue={patient.phone} className={inputClass} />
        </div>
        <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
      </ActionForm>
    </Disclosure>
  );
}
