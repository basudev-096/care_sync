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
    <header className="mb-8 pb-6 border-b border-border">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          {eyebrow ? <p className="eyebrow mb-2.5">{eyebrow}</p> : null}
          <h1 className="display text-[30px] sm:text-[34px]">{title}</h1>
          {description ? (
            <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground max-w-[62ch]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2 shrink-0">{actions}</div> : null}
      </div>
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
        <div className="flex items-start justify-between gap-3 px-5 h-[52px] border-b border-border bg-surface">
          <div className="min-w-0 self-center">
            <h2 className="text-[13.5px] font-semibold tracking-[-0.01em] leading-tight">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-[12.5px] text-muted-foreground leading-tight truncate">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0 self-center">{actions}</div> : null}
        </div>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="text-[14px] font-medium">{title}</p>
      {hint ? (
        <p className="mt-1.5 text-[13px] text-muted-foreground max-w-[44ch] mx-auto leading-relaxed">
          {hint}
        </p>
      ) : null}
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
      <table className="w-full text-[13.5px] border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface-sunken/45">
            {columns.map((c, i) => (
              <th
                key={c || i}
                scope="col"
                className="text-left font-semibold text-[11px] uppercase tracking-[0.07em] text-muted-foreground px-5 h-9 whitespace-nowrap"
              >
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
  return <tr className="border-b border-border last:border-0 align-middle row-hover">{children}</tr>;
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

/**
 * Status is carried by a coloured dot plus a word, never colour alone -- the
 * label still reads correctly in greyscale or with a colour vision deficiency.
 */
const STATUS_STYLE: Record<string, { dot: string; text: string }> = {
  PENDING: { dot: "bg-[#9a5a13]", text: "text-[#7c4810]" },
  SCHEDULED: { dot: "bg-[#6b7076]", text: "text-[#565b60]" },
  ACCEPTED: { dot: "bg-secondary", text: "text-accent-foreground" },
  CHECKED_IN: { dot: "bg-secondary", text: "text-accent-foreground" },
  COMPLETED: { dot: "bg-[#b3b0a8]", text: "text-muted-foreground" },
  CANCELLED: { dot: "bg-destructive", text: "text-destructive" },
  NO_SHOW: { dot: "bg-destructive", text: "text-destructive" },
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
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.COMPLETED;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12.5px] font-medium whitespace-nowrap ${style.text}`}
    >
      <span className={`size-[5px] rounded-full shrink-0 ${style.dot}`} aria-hidden />
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

/* ---------- actions ---------- */

const BTN_BASE =
  "inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-md text-[13.5px] font-medium " +
  "transition-[background-color,border-color,color,box-shadow] duration-100 " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none whitespace-nowrap " +
  "active:translate-y-px select-none";

export const btn = {
  primary: `${BTN_BASE} bg-primary text-primary-foreground hover:bg-[#2a3036] shadow-[0_1px_1px_rgb(25_29_33/0.10)]`,
  secondary: `${BTN_BASE} bg-secondary text-secondary-foreground hover:bg-[#0f4f40] shadow-[0_1px_1px_rgb(25_29_33/0.10)]`,
  outline: `${BTN_BASE} border border-input bg-surface hover:bg-muted hover:border-border-strong`,
  danger: `${BTN_BASE} border border-destructive/25 text-destructive bg-surface hover:bg-destructive/[0.06] hover:border-destructive/40`,
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
  "w-full h-9 px-3 rounded-md border border-input bg-surface text-[13.5px] " +
  "placeholder:text-muted-foreground/60 transition-[border-color,box-shadow] duration-100 " +
  "hover:border-border-strong " +
  "focus:outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/12";

export const textareaClass =
  "w-full px-3 py-2.5 rounded-md border border-input bg-surface text-[13.5px] leading-[1.6] " +
  "placeholder:text-muted-foreground/60 transition-[border-color,box-shadow] duration-100 " +
  "hover:border-border-strong resize-y " +
  "focus:outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/12";

export const labelClass = "block text-[12.5px] font-medium mb-1.5 text-foreground/85";

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
  // A date of birth in the future is bad data, not a negative age.
  if (diff < 0) return null;
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

/* ---------- identity ---------- */

const AVATAR_TONES = [
  "bg-[#e4ece8] text-[#0d4536]",
  "bg-[#eae6dd] text-[#6b5636]",
  "bg-[#e2e6ea] text-[#39434d]",
  "bg-[#e9e4ea] text-[#4f3f52]",
  "bg-[#e3eae4] text-[#2f4a36]",
];

/**
 * Initials avatar. The tone is derived from the name so the same person keeps
 * the same colour everywhere, which makes long lists scannable.
 */
export function Avatar({
  firstName,
  lastName,
  size = 30,
}: {
  firstName: string;
  lastName: string;
  size?: number;
}) {
  const initials = ((firstName[0] ?? "") + (lastName[0] ?? "")).toUpperCase();
  const seed = (firstName + lastName)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={`grid place-items-center rounded-full font-semibold shrink-0 tracking-[0.01em] ${
        AVATAR_TONES[seed % AVATAR_TONES.length]
      }`}
    >
      {initials || "?"}
    </span>
  );
}

/* ---------- page chrome ---------- */

/**
 * Compact application header: title on the left, controls on the right, all on
 * one line. Replaces the tall marketing-style block on working pages, where
 * vertical space belongs to the data.
 */
export function Toolbar({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex items-baseline gap-3 min-w-0">
        <h1 className="text-[19px] font-semibold tracking-[-0.02em]">{title}</h1>
        {meta ? (
          <span className="text-[13px] text-muted-foreground tnum shrink-0">{meta}</span>
        ) : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </header>
  );
}

/** A labelled figure. Used in rows of three or four, never as a lone card. */
export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="px-5 py-4">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-[27px] leading-none font-semibold tracking-[-0.03em] tnum">{value}</p>
      {hint ? <p className="mt-2 text-[12.5px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** Stats sharing one bordered strip, divided by hairlines. */
export function StatStrip({ children }: { children: ReactNode }) {
  return (
    <div className="panel-raised grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border overflow-hidden">
      {children}
    </div>
  );
}

/** Definition pair for detail panels. */
export function KeyValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-border last:border-0">
      <dt className="text-[12.5px] text-muted-foreground shrink-0">{label}</dt>
      <dd className="text-[13.5px] text-right min-w-0 break-words">{value}</dd>
    </div>
  );
}

/** Search field with a leading icon, sized for a toolbar. */
export const searchInputClass =
  "w-full h-9 pl-9 pr-3 rounded-md border border-input bg-surface text-[13.5px] " +
  "placeholder:text-muted-foreground/60 transition-[border-color,box-shadow] duration-100 " +
  "hover:border-border-strong " +
  "focus:outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/12";
