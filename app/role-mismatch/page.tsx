"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RoleMismatchPage() {
  const { signOut } = useClerk();
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    // Immediately sign the user out because they tried to access the wrong role
    signOut().then(() => {
      setSignedOut(true);
    });
  }, [signOut]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-[24px] shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[#fee2e2] text-[#ef4444] flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0b1c30] mb-2 font-sans">Role Authorization Failed</h1>
        <p className="text-[#717971] mb-8 font-sans">
          You attempted to sign in with an email address that is registered under a different role. Please sign in using the correct role for your account.
        </p>
        
        {signedOut ? (
          <Link 
            href="/sign-in"
            className="block w-full bg-[#0b3d20] text-white hover:bg-[#2f7c57] py-3 rounded-lg font-semibold transition-colors font-sans"
          >
            Return to Sign In
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
