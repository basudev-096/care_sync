import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Mark } from "./portal-shell";

/**
 * Split auth layout: a fixed brand rail carrying the clinic's identity and
 * trust signals, and a content column holding the actual form. The rail is
 * hidden below lg so the form owns the whole viewport on phones.
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,27rem)_1fr] bg-background">
      {/* Brand rail */}
      <aside className="hidden lg:flex flex-col justify-between bg-sidebar text-white p-10 relative overflow-hidden">
        {/* A single hairline grid, barely visible: paper, not decoration. */}
        <div
          className="absolute inset-0 opacity-[0.055] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
          aria-hidden
        />

        <Link href="/" className="flex items-center gap-2.5 w-fit relative">
          <Mark className="size-8" />
          <span className="font-semibold text-[15px] tracking-[-0.01em]">CareClinic</span>
        </Link>

        <div className="space-y-5 relative">
          <p className="display text-[34px] text-white">
            Clinical records, appointments and prescriptions in one place.
          </p>
          <p className="text-[14px] leading-relaxed text-white/50 max-w-[36ch]">
            Used by clinicians, reception staff and patients across the practice.
          </p>
        </div>

        <div className="flex items-center gap-2 text-white/40 relative">
          <ShieldCheck className="size-4" strokeWidth={2} />
          <span className="text-[12px]">Protected health information — access is logged</span>
        </div>
      </aside>

      {/* Form column */}
      <main className="flex flex-col items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-[25rem]">
          {/* Mobile-only brand mark */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <Mark className="size-8" />
            <span className="font-semibold text-[15px] tracking-[-0.01em]">CareClinic</span>
          </Link>

          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="display text-[32px]">{title}</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer ? <div className="mt-7 pt-6 border-t border-border">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}
