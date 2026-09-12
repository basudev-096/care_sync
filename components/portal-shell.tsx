import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Activity } from "lucide-react";
import { NavLink } from "./nav-link";

export type NavItem = { href: string; label: string };

/**
 * Shared chrome for all three portals: a dark rail on desktop, a horizontal
 * scroll strip on mobile. Nav links are a UI convenience only -- every route
 * behind them re-checks the role server-side.
 */
export function PortalShell({
  roleLabel,
  userName,
  nav,
  children,
}: {
  roleLabel: string;
  userName: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[15rem_1fr]">
      {/* Desktop rail */}
      <aside className="hidden lg:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-sidebar-border">
          <span className="grid place-items-center size-7 rounded-md bg-secondary text-white">
            <Activity className="size-4" strokeWidth={2.25} />
          </span>
          <span className="font-semibold text-[14px] tracking-tight text-white">CareClinic</span>
        </div>

        <div className="px-5 py-4 border-b border-sidebar-border">
          <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-sidebar-foreground/45">
            {roleLabel}
          </p>
          <p className="mt-0.5 text-[13px] text-white truncate">{userName}</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border flex items-center gap-2.5">
          <UserButton />
          <span className="text-[13px] text-sidebar-foreground/60">Account</span>
        </div>
      </aside>

      <div className="flex flex-col min-w-0">
        {/* Mobile bar */}
        <header className="lg:hidden bg-sidebar text-white">
          <div className="h-14 flex items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid place-items-center size-7 rounded-md bg-secondary">
                <Activity className="size-4" strokeWidth={2.25} />
              </span>
              <span className="font-semibold text-[14px]">CareClinic</span>
            </Link>
            <UserButton />
          </div>
          <nav className="flex gap-1 px-3 pb-2.5 overflow-x-auto">
            {nav.map((item) => (
              <NavLink key={item.href} href={item.href} compact>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-5 py-7 sm:px-7 lg:px-9 lg:py-9 max-w-[1500px] w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
