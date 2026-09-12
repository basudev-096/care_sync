import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ---------- layout primitives ---------- */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 mb-7">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1.5 text-[14px] text-muted-foreground max-w-[68ch]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-2 shrink-0">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className = "",
  bodyClassName = "p-5",
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`panel-raised overflow-hidden ${className}`}>
      {title ? (
        <div className="flex items-start justify-between gap-3 px-5 py-3.5 border-b border-border">
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="py-12 text-center">
      <p className="text-[14px] font-medium">{title}</p>
      {hint ? <p className="mt-1 text-[13px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/* ---------- data display ---------- */

export function DataTable({
  columns,
  children,
}: {
  columns: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[14px]">
        <thead>
          <tr className="text-left border-b border-border">
            {columns.map((c) => (
              <th key={c} className="font-medium text-[12px] text-muted-foreground px-5 py-2.5 whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <tr className="border-b border-border last:border-0 align-middle">{children}</tr>;
}

export function Cell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`px-5 py-3 ${className}`}>{children}</td>;
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-[#fdf3e7] text-[#b54708] border-[#f0dcc3]",
  SCHEDULED: "bg-[#eef1f6] text-[#3b4757] border-[#dfe4ec]",
  ACCEPTED: "bg-accent text-accent-foreground border-secondary/25",
  CHECKED_IN: "bg-[#e6f0ee] text-[#0b4a3f] border-secondary/30",
  COMPLETED: "bg-[#eef1f6] text-[#5f6672] border-[#dfe4ec]",
  CANCELLED: "bg-destructive/6 text-destructive border-destructive/20",
  NO_SHOW: "bg-destructive/6 text-destructive border-destructive/20",
};

export const STATUS_LABEL: Record<string, string> = {
  PENDING: "Awaiting slot",
  SCHEDULED: "Slot offered",
  ACCEPTED: "Confirmed",
  CHECKED_IN: "Checked in",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No show",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center h-[22px] px-2 rounded border text-[12px] font-medium whitespace-nowrap ${
        STATUS_STYLE[status] ?? STATUS_STYLE.COMPLETED
      }`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

/* ---------- actions ---------- */

const BTN_BASE =
  "inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-md text-[14px] font-medium " +
  "transition-colors disabled:opacity-55 disabled:cursor-not-allowed whitespace-nowrap";

export const btn = {
  primary: `${BTN_BASE} bg-primary text-primary-foreground hover:bg-primary/90`,
  secondary: `${BTN_BASE} bg-secondary text-secondary-foreground hover:bg-secondary/90`,
  outline: `${BTN_BASE} border border-input bg-white hover:bg-muted`,
  danger: `${BTN_BASE} border border-destructive/25 text-destructive bg-white hover:bg-destructive/5`,
  ghost: `${BTN_BASE} text-muted-foreground hover:text-foreground hover:bg-muted`,
};

export function LinkButton({
  href,
  variant = "outline",
  children,
  ...rest
}: { href: string; variant?: keyof typeof btn } & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link href={href} className={btn[variant]} {...rest}>
      {children}
    </Link>
  );
}

/* ---------- forms ---------- */

export const inputClass =
  "w-full h-9 px-3 rounded-md border border-input bg-white text-[14px] " +
  "placeholder:text-muted-foreground/70 focus:outline-none focus:border-secondary " +
  "focus:ring-2 focus:ring-secondary/15 transition-shadow";

export const textareaClass =
  "w-full px-3 py-2 rounded-md border border-input bg-white text-[14px] leading-relaxed " +
  "placeholder:text-muted-foreground/70 focus:outline-none focus:border-secondary " +
  "focus:ring-2 focus:ring-secondary/15 transition-shadow";

export const labelClass = "block text-[13px] font-medium mb-1.5";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint ? <p className="mt-1.5 text-[12px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/* ---------- formatting ---------- */

export function formatDateTime(value: Date | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(value: Date | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(value: Date | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function age(dob: Date | null | undefined) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}
