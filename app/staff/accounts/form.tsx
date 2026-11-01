"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { provisionAccount, type ProvisionState } from "./actions";

/**
 * A random temporary password that clears Clerk's breach and strength checks.
 * Ambiguous characters are left out so it survives being read aloud over the
 * phone, which is how the clinic hands it over.
 */
function generatePassword() {
  const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const symbols = "!@#$%^&*";
  const bytes = crypto.getRandomValues(new Uint32Array(19));
  const body = Array.from(bytes, (n) => alphabet[n % alphabet.length]).join("");
  const symbol = symbols[crypto.getRandomValues(new Uint32Array(1))[0] % symbols.length];
  return body + symbol;
}

const field =
  "w-full h-10 px-3 rounded-md border border-input bg-white text-[0.9375rem] " +
  "focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-shadow";
const label = "block text-[0.8125rem] font-medium mb-1.5";

export function ProvisionForm() {
  const [state, action, pending] = useActionState<ProvisionState, FormData>(provisionAccount, {});
  const [password, setPassword] = useState("");

  return (
    <form action={action} className="space-y-3.5">
      {state.error ? (
        <p role="alert" className="flex gap-2 items-start text-[0.8125rem] text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2.5">
          <AlertCircle className="size-4 shrink-0 mt-px" strokeWidth={2} />
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="flex gap-2 items-start text-[0.8125rem] text-secondary bg-accent border border-secondary/20 rounded-md px-3 py-2.5">
          <CheckCircle2 className="size-4 shrink-0 mt-px" strokeWidth={2} />
          {state.success}
        </p>
      ) : null}

      <div>
        <label className={label} htmlFor="role">Account type</label>
        <select id="role" name="role" className={field} defaultValue="PHYSICIAN">
          <option value="PHYSICIAN">Physician</option>
          <option value="STAFF">Clinic staff</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" required className={field} />
        </div>
        <div>
          <label className={label} htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" required className={field} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="email">Work email</label>
        <input id="email" name="email" type="email" required className={field} />
      </div>

      <div>
        <label className={label} htmlFor="specialty">Specialty <span className="text-muted-foreground font-normal">(physicians)</span></label>
        <input id="specialty" name="specialty" className={field} placeholder="General medicine" />
      </div>

      <div>
        <label className={label} htmlFor="password">Temporary password</label>
        <div className="flex gap-2">
          <input
            id="password"
            name="password"
            type="text"
            required
            minLength={15}
            className={field}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 15 characters"
          />
          <button
            type="button"
            onClick={() => setPassword(generatePassword())}
            className="shrink-0 h-10 px-3 rounded-md border border-input bg-white text-[0.8125rem] font-medium hover:bg-muted transition-colors"
          >
            Generate
          </button>
        </div>
        <p className="mt-1.5 text-[12px] text-muted-foreground">
          Share this in person or by phone, not email. Clerk rejects common or
          breached passwords, so use Generate if one is refused.
        </p>
      </div>

      <button type="submit" disabled={pending}
        className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-[0.9375rem] hover:bg-primary/90 disabled:opacity-55 transition-colors">
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
