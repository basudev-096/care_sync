import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { NavLink } from "./nav-link";

export type NavItem = { href: string; label: string; icon: string; section?: string };

/** The mark: a clinical waveform cut from a square. Not a stock icon. */
export function Mark({ className = "size-7" }: { className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-[5px] bg-secondary text-white shrink-0 ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[60%]">
        <path
          d="M3 13.2h4.4L9.6 8l3.1 8.6 2.3-5.1h6"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * Shared chrome for all three portals. Desktop gets a dark rail with grouped,
 * icon-led navigation; mobile gets a compact bar and a scrolling tab strip.
 *
 * Navigation is a convenience only -- every route behind it re-checks the role
 * server-side.
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
  // Preserve declaration order while grouping under section headings.
  const sections: { name: string | undefined; items: NavItem[] }[] = [];
  for (const item of nav) {
    const last = sections[sections.length - 1];
    if (last && last.name === item.section) last.items.push(item);
    else sections.push({ name: item.section, items: [item] });
  }

  const initials = userName
    .replace(/^Dr\s+/i, "")
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[15rem_1fr]">
      {/* Desktop rail */}
      <aside className="hidden lg:flex flex-col bg-sidebar text-sidebar-foreground sticky top-0 h-screen">
        <div className="h-[57px] flex items-center gap-2.5 px-4 border-b border-sidebar-border shrink-0">
          <Mark />
          <span className="font-semibold text-[14.5px] tracking-[-0.01em] text-white">
            CareClinic
          </span>
          <span className="ml-auto text-[10px] font-medium uppercase tracking-[0.08em] text-white/35 px-1.5 py-0.5 rounded border border-white/12">
            {roleLabel}
          </span>
        </div>

        <nav className="flex-1 px-2.5 py-4 space-y-5 overflow-y-auto">
          {sections.map((section, i) => (
            <div key={section.name ?? i}>
              {section.name ? (
                <p className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/25">
                  {section.name}
                </p>
              ) : null}
              <div className="space-y-px">
                {section.items.map((item) => (
                  <NavLink key={item.href} href={item.href} icon={item.icon}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-2.5 border-t border-sidebar-border shrink-0">
          <div className="flex items-center gap-2.5 px-1.5 py-1.5">
            <span className="grid place-items-center size-7 rounded-full bg-white/10 text-white text-[11px] font-semibold shrink-0">
              {initials || "?"}
            </span>
            <span className="text-[12.5px] text-white/75 truncate flex-1 min-w-0">{userName}</span>
            <UserButton />
          </div>
        </div>
      </aside>

      <div className="flex flex-col min-w-0">
        {/* Mobile bar */}
        <header className="lg:hidden bg-sidebar text-white sticky top-0 z-20">
          <div className="h-14 flex items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Mark className="size-7" />
              <span className="font-semibold text-[14.5px]">CareClinic</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-[11.5px] uppercase tracking-[0.08em] text-white/40">
                {roleLabel}
              </span>
              <UserButton />
            </div>
          </div>
          <nav className="flex gap-1 px-3 pb-2.5 overflow-x-auto">
            {nav.map((item) => (
              <NavLink key={item.href} href={item.href} icon={item.icon} compact>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-5 py-7 sm:px-7 lg:px-9 lg:py-8 w-full max-w-[1500px]">
          {children}
        </main>
      </div>
    </div>
  );
}
