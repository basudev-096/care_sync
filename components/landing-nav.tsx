"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Mark } from "@/components/portal-shell";
import { btn } from "@/components/ui-kit";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#roles", label: "Portals" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#why-caresync", label: "Why CareSync" },
];

export function LandingNav({ isSignedIn }: { isSignedIn: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="max-w-[72rem] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Mark className="size-7 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-semibold text-[16px] tracking-[-0.02em] text-foreground flex items-center gap-1.5">
              CareSync
              <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-secondary bg-accent px-1.5 py-0.5 rounded font-medium">
                EMR
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-[13.5px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Authentication CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          {isSignedIn ? (
            <Link
              href="/auth-callback"
              className={`${btn.primary} h-9 px-4 text-[13.5px] font-medium inline-flex items-center gap-1.5`}
            >
              Go to my portal
              <ArrowRight className="size-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={`${btn.ghost} h-9 px-3.5 text-[13.5px] font-medium`}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className={`${btn.primary} h-9 px-4 text-[13.5px] font-medium inline-flex items-center gap-1.5`}
              >
                Get started
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted focus:outline-none"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen ? (
        <div className="md:hidden border-b border-border bg-surface px-5 py-4 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-[14px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {isSignedIn ? (
              <Link
                href="/auth-callback"
                onClick={() => setMobileMenuOpen(false)}
                className={`${btn.primary} w-full justify-center h-10 text-[14px]`}
              >
                Go to my portal
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${btn.primary} w-full justify-center h-10 text-[14px]`}
                >
                  Get started
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${btn.outline} w-full justify-center h-10 text-[14px]`}
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

