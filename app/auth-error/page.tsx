"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

const REASONS = {
  "account-exists": {
    title: "Account Already Exists",
    message:
      "An account with this email is already registered. Registration is only for new accounts \u2014 please use the sign in page instead.",
    href: "/sign-in",
    cta: "Go to Sign In",
  },
  "no-account": {
    title: "No Account Found",
    message:
      "We couldn't find a CareSync account for this email. New accounts can only be created from the sign up page.",
    href: "/sign-up",
    cta: "Go to Sign Up",
  },
} as const;

type Reason = keyof typeof REASONS;

const FALLBACK = {
  title: "Authentication Failed",
  message: "We couldn't complete that request. Please try signing in again.",
  href: "/sign-in",
  cta: "Return to Sign In",
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { reason } = use(searchParams);
  const { signOut } = useClerk();
  const [signedOut, setSignedOut] = useState(false);

  const details =
    typeof reason === "string" && reason in REASONS
      ? REASONS[reason as Reason]
      : FALLBACK;

  useEffect(() => {
    // The attempt used the wrong page, so the session it created must not stand.
    signOut().then(() => {
      setSignedOut(true);
    });
  }, [signOut]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-[24px] shadow-xl p-8 max-w-md w-full text-center">
        <span className="grid place-items-center size-11 rounded-md bg-destructive/8 text-destructive border border-destructive/15 mx-auto mb-6">
          <AlertTriangle className="size-[22px]" strokeWidth={2} />
        </span>
        <h1 className="text-2xl font-bold text-[#0b1c30] mb-2 font-sans">{details.title}</h1>
        <p className="text-[#717971] mb-8 font-sans">{details.message}</p>

        {signedOut ? (
          <Link
            href={details.href}
            className="block w-full bg-[#0b3d20] text-white hover:bg-[#2f7c57] py-3 rounded-lg font-semibold transition-colors font-sans"
          >
            {details.cta}
          </Link>
        ) : (
          <button
            disabled
            className="block w-full bg-gray-300 text-white py-3 rounded-lg font-semibold font-sans cursor-not-allowed"
          >
            Signing out...
          </button>
        )}
      </div>
    </div>
  );
}
