"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { completeRegistration, type RegistrationState } from "./actions";

// No one is born in the future; browsers enforce this on the picker.
const TODAY = new Date().toISOString().slice(0, 10);

const field =
  "w-full h-10 px-3 rounded-md border border-input bg-white text-[0.9375rem] text-foreground " +
  "placeholder:text-muted-foreground/70 focus:outline-none focus:border-secondary " +
  "focus:ring-2 focus:ring-secondary/15 transition-shadow";
const label = "block text-[0.8125rem] font-medium text-foreground mb-1.5";

export function RegistrationForm() {
  const [state, action, pending] = useActionState<RegistrationState, FormData>(
    completeRegistration,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      {state.error ? (
        <p
          role="alert"
          className="flex gap-2 items-start text-[0.8125rem] text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2.5"
        >
          <AlertCircle className="size-4 shrink-0 mt-px" strokeWidth={2} />
          {state.error}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" required className={field} autoComplete="given-name" />
        </div>
        <div>
          <label className={label} htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" required className={field} autoComplete="family-name" />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" className={field} autoComplete="tel"
          placeholder="Used by reception to reach you" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="dob">Date of birth</label>
          <input id="dob" name="dob" type="date" max={TODAY} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="sex">Sex</label>
          <select id="sex" name="sex" className={field} defaultValue="">
            <option value="">Prefer not to say</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-[0.9375rem]
                   hover:bg-primary/90 disabled:opacity-55 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? "Creating your record…" : "Open my patient record"}
      </button>
    </form>
  );
}
