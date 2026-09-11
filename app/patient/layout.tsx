import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Top Navbar */}
      <header className="h-16 bg-[#0b3d20] flex items-center justify-between px-6 border-b border-[#0b3d20]/10">
        <div className="flex items-center space-x-4">
          <span className="text-white font-bold text-xl font-inter">CareSync</span>
          <nav className="hidden md:flex space-x-6 ml-8">
            <a href="/patient/dashboard" className="text-white/80 hover:text-white font-inter text-sm">Dashboard</a>
            <a href="/patient/appointments" className="text-white/80 hover:text-white font-inter text-sm">Appointments</a>
            <a href="/patient/records" className="text-white/80 hover:text-white font-inter text-sm">Records</a>
            <a href="/patient/profile" className="text-white/80 hover:text-white font-inter text-sm">Profile</a>
          </nav>
        </div>
        <div>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </header>
      
      <main className="p-6 md:p-8 max-w-[1600px] mx-auto">
        {children}
      </main>
    </div>
  );
}
