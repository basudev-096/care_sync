"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Pill,
  BarChart3,
  UserCog,
  FileText,
  ClipboardList,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";

/** Named so pages can pass a plain string and stay server components. */
const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  calendar: CalendarDays,
  calendarCheck: CalendarCheck,
  users: Users,
  stethoscope: Stethoscope,
  pill: Pill,
  reports: BarChart3,
  accounts: UserCog,
  notes: FileText,
  clipboard: ClipboardList,
};

export function NavLink({
  href,
  icon,
  children,
  compact = false,
}: {
  href: string;
  icon?: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  const Icon = icon ? ICONS[icon] : undefined;

  if (compact) {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 h-8 rounded-md text-[13px] font-medium transition-colors duration-100 ${
          active
            ? "bg-white/[0.14] text-white"
            : "text-white/55 hover:text-white hover:bg-white/[0.07]"
        }`}
      >
        {Icon ? <Icon className="size-[15px]" strokeWidth={2} /> : null}
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-2.5 px-2.5 h-[33px] rounded-md text-[13.5px] font-medium transition-colors duration-100 ${
        active
          ? "bg-sidebar-accent text-white"
          : "text-sidebar-foreground/60 hover:text-white hover:bg-sidebar-accent/55"
      }`}
    >
      {Icon ? (
        <Icon
          className={`size-[15px] shrink-0 transition-colors ${
            active ? "text-secondary" : "text-white/35 group-hover:text-white/70"
          }`}
          strokeWidth={2}
        />
      ) : null}
      <span className="truncate">{children}</span>
    </Link>
  );
}
