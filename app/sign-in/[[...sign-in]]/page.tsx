import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata = { title: "Sign in · CareClinic" };

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Clinic portal"
      title="Sign in to CareClinic"
      subtitle="Patients, physicians and clinic staff sign in here. You'll be taken to your own portal automatically."
      footer={
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Physician and staff accounts are issued by the clinic — contact reception if you need access.
        </p>
      }
    >
      {/*
        withSignUp={false} keeps this a sign-in-only form: an unrecognised email
        gets Clerk's "Couldn't find your account" instead of silently becoming a
        registration. transferable={false} does the same for the OAuth path.
      */}
      <SignIn
        withSignUp={false}
        transferable={false}
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/auth-callback?intent=signin"
        signUpFallbackRedirectUrl="/auth-callback?intent=signin"
        appearance={clerkAppearance}
      />
    </AuthShell>
  );
}
