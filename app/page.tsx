import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ShieldCheck } from "lucide-react";
import { btn } from "@/components/ui-kit";
import { Mark } from "@/components/portal-shell";

const CAPABILITIES = [
  {
    index: "01",
    title: "Appointments without the phone tag",
    body: "Patients request a consultation. Reception assigns the time from the doctor's real schedule, and the patient confirms it. Every status is visible to everyone who needs it.",
  },
  {
    index: "02",
    title: "Consultation notes that stay together",
    body: "Symptoms, diagnosis and advice recorded at the visit. The full history sits one click away at the next one, prescriptions included.",
  },
  {
    index: "03",
    title: "Handwritten prescriptions, digitised",
    body: "Reception types the paper slip into a structured template — name, dosage, frequency, timing, duration — and the patient downloads a clean PDF.",
  },
];

const ROLES = [
  {
    title: "Patients",
    items: [
      "Request a consultation",
      "Confirm your assigned time",
      "Read past consultation notes",
      "Download prescriptions",
    ],
  },
  {
    title: "Physicians",
    items: [
      "Today's patient list",
      "Write consultation notes",
      "Review clinical history",
      "Complete or cancel visits",
    ],
  },
  {
    title: "Clinic staff",
    items: [
      "Assign and reschedule slots",
      "Check patients in",
      "Digitise prescriptions",
      "Weekly activity reports",
    ],
  },
];

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-[57px] border-b border-border bg-surface sticky top-0 z-20">
        <div className="h-full max-w-[70rem] mx-auto px-5 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Mark />
            <span className="font-semibold text-[15px] tracking-[-0.01em]">CareClinic</span>
          </Link>

          <div className="flex items-center gap-2">
            {userId ? (
              <Link href="/auth-callback" className={btn.primary}>
                Go to my portal
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className={btn.ghost}>
                  Sign in
                </Link>
                <Link href="/sign-up" className={btn.primary}>
                  Register as a patient
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-[70rem] mx-auto px-5 sm:px-8 pt-20 pb-20 sm:pt-28 sm:pb-24">
          <div className="max-w-[44rem]">
            <p className="eyebrow mb-5">Clinic management &amp; electronic medical records</p>
            <h1 className="display text-[46px] sm:text-[64px] lg:text-[72px]">
              One record per patient, from the front desk to the consulting room.
            </h1>
            <p className="mt-7 text-[16.5px] leading-[1.65] text-muted-foreground max-w-[54ch]">
              CareClinic keeps appointments, clinical notes and prescriptions in a single system,
              so reception, physicians and patients are all looking at the same thing.
            </p>

            <div className="mt-10 flex flex-wrap gap-2.5">
              {userId ? (
                <Link href="/auth-callback" className={`${btn.primary} h-11 px-5 text-[14.5px]`}>
                  Continue to my portal
                </Link>
              ) : (
                <>
                  <Link href="/sign-up" className={`${btn.primary} h-11 px-5 text-[14.5px]`}>
                    Register as a patient
                  </Link>
                  <Link href="/sign-in" className={`${btn.outline} h-11 px-5 text-[14.5px]`}>
                    Sign in
                  </Link>
                </>
              )}
            </div>

            <p className="mt-6 text-[13px] text-muted-foreground">
              Physicians and clinic staff receive their accounts from the practice.
            </p>
          </div>
        </section>

        {/* Capabilities — numbered, ruled, no cards */}
        <section className="border-t border-border bg-surface">
          <div className="max-w-[70rem] mx-auto px-5 sm:px-8">
            <div className="grid md:grid-cols-3">
              {CAPABILITIES.map(({ index, title, body }, i) => (
                <div
                  key={title}
                  className={`py-12 md:py-16 md:px-8 ${i === 0 ? "md:pl-0" : ""} ${
                    i === CAPABILITIES.length - 1 ? "md:pr-0" : ""
                  } ${i > 0 ? "border-t md:border-t-0 md:border-l border-border" : ""}`}
                >
                  <span className="font-mono text-[11.5px] text-secondary tracking-wider">
                    {index}
                  </span>
                  <h2 className="mt-4 text-[17px] font-semibold tracking-[-0.015em] leading-snug">
                    {title}
                  </h2>
                  <p className="mt-3 text-[14px] leading-[1.65] text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles */}
        <section className="border-t border-border">
          <div className="max-w-[70rem] mx-auto px-5 sm:px-8 py-20">
            <div className="max-w-[36rem] mb-14">
              <p className="eyebrow mb-4">Three portals, one record</p>
              <p className="display text-[32px] sm:text-[38px]">
                Everyone sees exactly what their role needs — and nothing that it doesn&apos;t.
              </p>
            </div>

            <div className="grid gap-10 sm:grid-cols-3">
              {ROLES.map(({ title, items }) => (
                <div key={title}>
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-secondary pb-3 border-b border-border">
                    {title}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {items.map((item) => (
                      <li key={item} className="text-[14px] leading-snug text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="max-w-[70rem] mx-auto px-5 sm:px-8 py-8 flex flex-wrap gap-5 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mark className="size-6" />
            <p className="text-[13px] text-muted-foreground">
              CareClinic — clinic management and electronic medical records
            </p>
          </div>
          <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <ShieldCheck className="size-4" strokeWidth={2} />
            Access to patient records is role-restricted and logged
          </p>
        </div>
      </footer>
    </div>
  );
}
