"use client";
import { SignUp } from "@clerk/nextjs";
import { useState } from "react";

export default function Page() {
  const [role, setRole] = useState("patient");

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#f8f9ff] p-4">
      <div className="flex flex-col w-full items-center justify-center py-6 px-4 sm:px-6">
        
        {/* Decorative Ambient Glows Behind Modal */}
        <div className="relative w-full max-w-5xl flex flex-col items-center">
          <div className="absolute -top-16 -left-12 w-72 h-72 rounded-full bg-[#a2f0c3]/20 blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute -bottom-16 -right-12 w-80 h-80 rounded-full bg-[#bbefc5]/20 blur-3xl pointer-events-none -z-10"></div>
          
          {/* Top Trust & Security Overline */}
          <div className="flex items-center gap-2 mb-8">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#a2f0c3] text-[#20704c] shadow-sm">
              <span className="material-symbols-outlined text-base leading-none text-[#1a6b48]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="font-sans text-[11px] uppercase tracking-wider font-semibold">HIPAA Compliant & Secure Clinic Portal</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#e5eeff] text-[#717971]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1a6b48] animate-pulse"></span>
              <span className="font-mono text-[13px]">256-Bit Vault SSL</span>
            </div>
          </div>
          
          {/* Main Auth Card Container */}
          <div className="w-full max-w-xl bg-white rounded-[24px] shadow-xl p-8 sm:p-12 flex flex-col relative overflow-hidden">
            
            {/* Subtle Brand Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#0b3d20] flex items-center justify-center text-white shadow-md mb-3">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>vital_signs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-[24px] font-semibold text-[#0b1c30]">CareSync</span>
                <span className="font-sans text-[11px] font-semibold text-[#1a6b48] bg-[#a2f0c3] px-1 py-0.5 rounded">Registration</span>
              </div>
            </div>

            {/* Role Selector Tabs */}
            <div className="w-full p-1 bg-[#e5eeff] rounded-lg flex items-center mb-8">
              <button 
                onClick={() => setRole('patient')}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md font-sans text-[14px] transition-all duration-150 ${role === 'patient' ? 'bg-white text-[#0b3d20] shadow-sm font-semibold' : 'text-[#717971] hover:text-[#0b1c30]'}`}
              >
                <span className="material-symbols-outlined text-sm">person</span>
                <span>Patient</span>
              </button>
              <button 
                onClick={() => setRole('physician')}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md font-sans text-[14px] transition-all duration-150 ${role === 'physician' ? 'bg-white text-[#0b3d20] shadow-sm font-semibold' : 'text-[#717971] hover:text-[#0b1c30]'}`}
              >
                <span className="material-symbols-outlined text-sm">stethoscope</span>
                <span>Physician</span>
              </button>
              <button 
                onClick={() => setRole('staff')}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md font-sans text-[14px] transition-all duration-150 ${role === 'staff' ? 'bg-white text-[#0b3d20] shadow-sm font-semibold' : 'text-[#717971] hover:text-[#0b1c30]'}`}
              >
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                <span>Staff</span>
              </button>
            </div>
            
            {/* AUTH FLOW CONTAINER */}
            <div className="w-full flex justify-center">
              <SignUp 
                unsafeMetadata={{ role }}
                fallbackRedirectUrl="/auth-callback"
                signInUrl="/sign-in"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    cardBox: "w-full shadow-none",
                    card: "bg-transparent shadow-none w-full p-0 flex flex-col items-center",
                    headerTitle: "hidden", 
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "border-[#e2e8f0] font-sans text-[#0b1c30]",
                    formButtonPrimary: "bg-[#0b3d20] text-white hover:bg-[#2f7c57] font-sans font-semibold rounded-lg h-11",
                    formFieldInput: "bg-white border-[#e2e8f0] font-sans text-[#0b1c30] focus:border-[#2f7c57] focus:ring-[#63b995] rounded-lg h-10",
                    formFieldLabel: "font-sans text-[#0b1c30] font-medium text-[13px]",
                    dividerText: "font-sans text-[#717971] text-[13px]",
                    footerAction: "font-sans text-[13px]",
                    footerActionLink: "text-[#1a6b48] hover:text-[#0b3d20] font-semibold",
                    identityPreviewText: "text-[#0b1c30] font-sans",
                    identityPreviewEditButton: "text-[#1a6b48] hover:text-[#0b3d20]",
                    formHeaderTitle: "hidden",
                    formHeaderSubtitle: "hidden"
                  }
                }} 
              />
            </div>
            
          </div>
          
        </div>
      </div>
    </main>
  );
}
