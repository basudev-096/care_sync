"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
  compact = false,
}: {
  href: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  if (compact) {
    return (
      <Link
        href={href}
        className={`shrink-0 px-3 h-8 inline-flex items-center rounded-md text-[13px] font-medium transition-colors ${
          active ? "bg-white/12 text-white" : "text-white/60 hover:text-white hover:bg-white/8"
        }`}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`block px-3 h-9 leading-9 rounded-md text-[13.5px] font-medium transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/60"
      }`}
    >
      {children}
    </Link>
  );
}
