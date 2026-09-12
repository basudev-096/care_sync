"use client";

import { ActionForm, SubmitButton } from "@/components/forms";
import { inputClass, labelClass } from "@/components/ui-kit";
import { updateMyProfile } from "../actions";

export function ProfileForm({
  defaults,
}: {
  defaults: { firstName: string; lastName: string; phone: string; sex: string; dob: string };
}) {
  return (
    <ActionForm action={updateMyProfile}>
      <div className="grid sm:grid-cols-2 gap-3.5">
        <div>
          <label className={labelClass} htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" required defaultValue={defaults.firstName} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" required defaultValue={defaults.lastName} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" defaultValue={defaults.phone} className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3.5">
        <div>
          <label className={labelClass} htmlFor="dob">Date of birth</label>
          <input id="dob" name="dob" type="date" defaultValue={defaults.dob} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="sex">Sex</label>
          <select id="sex" name="sex" defaultValue={defaults.sex} className={inputClass}>
            <option value="">Prefer not to say</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
    </ActionForm>
  );
}
