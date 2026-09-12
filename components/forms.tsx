"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { btn } from "./ui-kit";

export type FormState = { error?: string; success?: string };
type Action = (prev: FormState, data: FormData) => Promise<FormState>;

export function Feedback({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p
        role="alert"
        className="flex gap-2 items-start text-[13px] text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2.5"
      >
        <AlertCircle className="size-4 shrink-0 mt-px" strokeWidth={2} />
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p
        role="status"
        className="flex gap-2 items-start text-[13px] text-secondary bg-accent border border-secondary/20 rounded-md px-3 py-2.5"
      >
        <CheckCircle2 className="size-4 shrink-0 mt-px" strokeWidth={2} />
        {state.success}
      </p>
    );
  }
  return null;
}

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: keyof typeof btn;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${btn[variant]} ${className}`}>
      {pending ? (pendingLabel ?? "Working…") : children}
    </button>
  );
}

/**
 * Wraps a server action with its own state so any page can drop in a form that
 * reports its own errors without each page re-implementing useActionState.
 */
export function ActionForm({
  action,
  children,
  className = "space-y-3.5",
  hideFeedback = false,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  hideFeedback?: boolean;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  return (
    <form action={formAction} className={className}>
      {hideFeedback ? null : <Feedback state={state} />}
      {children}
    </form>
  );
}

/** Collapsible inline form, used for the "cancel with a reason" flows. */
export function Disclosure({
  label,
  variant = "outline",
  children,
}: {
  label: string;
  variant?: keyof typeof btn;
  children: React.ReactNode;
}) {
  return (
    <details className="group">
      <summary className={`${btn[variant]} cursor-pointer list-none select-none`}>{label}</summary>
      <div className="mt-2.5">{children}</div>
    </details>
  );
}
