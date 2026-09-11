import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="h-16 flex items-center justify-between px-6 lg:px-12 bg-white border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0b3d20] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-lg">vital_signs</span>
          </div>
          <span className="text-[#0b1c30] font-bold text-xl">CareSync</span>
        </div>
        
        <div className="flex items-center gap-4">
          {userId ? (
            <>
              <Link 
                href="/auth-callback" 
                className="text-[#0b3d20] bg-[#d9f2e6] hover:bg-[#a2f0c3] px-4 py-2 rounded-md font-semibold text-sm transition-colors"
              >
                Go to Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link 
                href="/sign-in" 
                className="text-[#0b1c30] hover:text-[#0b3d20] font-semibold text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="bg-[#0b3d20] text-white hover:bg-[#2f7c57] px-4 py-2 rounded-md font-semibold text-sm transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#a2f0c3] text-[#20704c] shadow-sm mb-6">
          <span className="material-symbols-outlined text-base leading-none text-[#1a6b48]">verified_user</span>
          <span className="text-[11px] uppercase tracking-wider font-semibold">HIPAA Compliant Platform</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-[#0b1c30] tracking-tight max-w-3xl mb-6">
          Clinical Precision Meets <span className="text-[#2f7c57]">Human Warmth</span>
        </h1>
        
        <p className="text-[#414941] text-lg md:text-xl max-w-2xl mb-10">
          The all-in-one clinic management system designed for practitioners, administrators, and patients. Streamline your workflows with enterprise-grade security.
        </p>
        
        {!userId && (
          <Link 
            href="/sign-up" 
            className="bg-[#0b3d20] text-white hover:bg-[#2f7c57] px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg flex items-center gap-2"
          >
            <span>Get Started Today</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        )}
      </main>
    </div>
  );
}
