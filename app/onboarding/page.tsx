"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("patient");

  const completeOnboarding = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await user.update({
        unsafeMetadata: { role },
      });
      // After updating, redirect them through the callback to route correctly
      router.push("/auth-callback");
    } catch (error) {
      console.error("Error updating role:", error);
      setLoading(false);
    }
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">Loading...</div>;

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#f8f9ff] p-4">
      <div className="flex flex-col w-full items-center justify-center py-6 px-4 sm:px-6">
        
        {/* Decorative Ambient Glows */}
        <div className="relative w-full max-w-5xl flex flex-col items-center">
          <div className="absolute -top-16 -left-12 w-72 h-72 rounded-full bg-[#a2f0c3]/20 blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute -bottom-16 -right-12 w-80 h-80 rounded-full bg-[#bbefc5]/20 blur-3xl pointer-events-none -z-10"></div>
          
          {/* Main Auth Card Container */}
          <div className="w-full max-w-xl bg-white rounded-[24px] shadow-xl p-8 sm:p-12 flex flex-col relative overflow-hidden">
            
            {/* Subtle Brand Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#0b3d20] flex items-center justify-center text-white shadow-md mb-3">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>vital_signs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-[24px] font-semibold text-[#0b1c30]">CareSync</span>
                <span className="font-sans text-[11px] font-semibold text-[#1a6b48] bg-[#a2f0c3] px-1 py-0.5 rounded">Setup</span>
              </div>
              <p className="font-sans text-[14px] text-[#717971] mt-1">Please select your account type to continue.</p>
            </div>

            {/* Role Selector Tabs */}
            <div className="w-full p-1 bg-[#e5eeff] rounded-lg flex items-center mb-8">
              <button 
                onClick={() => setRole('patient')}
                className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 rounded-md font-sans transition-all duration-150 ${role === 'patient' ? 'bg-white text-[#0b3d20] shadow-sm font-semibold' : 'text-[#717971] hover:text-[#0b1c30]'}`}
              >
                <span className="material-symbols-outlined text-2xl">person</span>
                <span className="text-[14px]">Patient</span>
              </button>
              <button 
                onClick={() => setRole('physician')}
                className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 rounded-md font-sans transition-all duration-150 ${role === 'physician' ? 'bg-white text-[#0b3d20] shadow-sm font-semibold' : 'text-[#717971] hover:text-[#0b1c30]'}`}
              >
                <span className="material-symbols-outlined text-2xl">stethoscope</span>
                <span className="text-[14px]">Physician</span>
              </button>
              <button 
                onClick={() => setRole('staff')}
                className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 rounded-md font-sans transition-all duration-150 ${role === 'staff' ? 'bg-white text-[#0b3d20] shadow-sm font-semibold' : 'text-[#717971] hover:text-[#0b1c30]'}`}
              >
                <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                <span className="text-[14px]">Staff</span>
              </button>
            </div>
            
            <button 
              onClick={completeOnboarding}
              disabled={loading}
              className="w-full bg-[#0b3d20] text-white hover:bg-[#2f7c57] font-sans font-semibold rounded-lg h-11 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue to Dashboard"}
            </button>
            
          </div>
        </div>
      </div>
    </main>
  );
}
