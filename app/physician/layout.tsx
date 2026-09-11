import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PhysicianLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  return (
    <div className="min-h-screen bg-[#f8f9ff] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#ffffff] border-r border-[#e2e8f0] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#e2e8f0]">
          <span className="text-[#0b3d20] font-bold text-xl font-inter">CareSync Physician</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/physician/dashboard" className="block px-4 py-2 text-[#0b1c30] hover:bg-[#d9f2e6] rounded-md font-medium text-sm">Clinical Dashboard</Link>
        </nav>
        <div className="p-4 border-t border-[#e2e8f0]">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="h-16 md:hidden bg-[#ffffff] border-b border-[#e2e8f0] flex items-center justify-between px-4">
          <span className="text-[#0b3d20] font-bold text-lg font-inter">CareSync</span>
          <UserButton afterSignOutUrl="/sign-in" />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
