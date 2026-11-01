"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { btn } from "./ui-kit";

/**
 * A right-hand slide-over built on native <dialog>, which gives focus
 * trapping, Escape-to-close and inert background for free.
 *
 * Long secondary forms live in here rather than occupying a third of every
 * page, so the data gets the full width.
 */
export function Sheet({
  trigger,
  triggerVariant = "primary",
  title,
  description,
  children,
}: {
  trigger: React.ReactNode;
  triggerVariant?: keyof typeof btn;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // A successful server action re-renders the form; close on its own signal.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onClose = () => setOpen(false);
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btn[triggerVariant]}>
        {trigger}
      </button>

      <dialog
        ref={ref}
        aria-label={title}
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (e.target === ref.current) setOpen(false);
        }}
        className="
          m-0 ml-auto h-dvh max-h-none w-full max-w-[26rem] bg-transparent p-0
          backdrop:bg-[#191d21]/25 backdrop:backdrop-blur-[1px]
          open:animate-in open:slide-in-from-right-4 open:fade-in open:duration-150
        "
      >
        <div className="flex h-full flex-col bg-surface border-l border-border shadow-[-8px_0_24px_rgb(25_29_33/0.06)]">
          <header className="flex items-start justify-between gap-4 px-5 h-[57px] border-b border-border shrink-0">
            <div className="min-w-0 self-center">
              <h2 className="text-[14px] font-semibold tracking-[-0.01em] leading-tight">{title}</h2>
              {description ? (
                <p className="mt-0.5 text-[12.5px] text-muted-foreground leading-tight">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="self-center shrink-0 grid place-items-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </dialog>
    </>
  );
}
