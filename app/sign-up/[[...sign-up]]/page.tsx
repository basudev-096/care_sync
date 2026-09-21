import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata = { title: "Create your patient account" };

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Patient registration"
      title="Create your patient account"
      subtitle="Register to request consultations, follow your appointments and download prescriptions."
      footer={
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Physicians and clinic staff don&apos;t register here — those accounts are provisioned by the clinic.
        </p>
      }
    >
      {/*
        Self sign-up creates a PATIENT and nothing else (WBS 1.1.1). There is no
        role selector: physician (1.2.1) and staff (1.3.1) accounts are created
        by clinic staff, so a role can never be chosen by the person signing up.
      */}
      <SignUp
        signInUrl="/sign-in"
        fallbackRedirectUrl="/auth-callback?intent=signup"
        signInFallbackRedirectUrl="/auth-callback?intent=signup"
        appearance={clerkAppearance}
      />
    </AuthShell>
  );
}
