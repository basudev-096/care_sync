import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Activity, CalendarCheck, FileText, Pill, ShieldCheck } from "lucide-react";
import { btn } from "@/components/ui-kit";

const CAPABILITIES = [
  {
    icon: CalendarCheck,
    title: "Appointments without the phone tag",
    body: "Patients request a consultation; reception assigns the time from the doctor's actual schedule and the patient confirms.",
  },
  {
    icon: FileText,
    title: "Consultation notes that stay together",
    body: "Symptoms, diagnosis and advice recorded at the visit, and the full history is one click away at the next one.",
  },
  {
    icon: Pill,
    title: "Handwritten prescriptions, digitised",
    body: "Reception types the paper slip into a structured template and the patient downloads a clean PDF.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 border-b border-border bg-surface">
        <div className="h-full max-w-[72rem] mx-auto px-5 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid place-items-center size-7 rounded-md bg-secondary text-white">
              <Activity className="size-4" strokeWidth={2.25} />
            </span>
            <span className="font-semibold text-[15px] tracking-tight">CareClinic</span>
          </Link>

          <div className="flex items-center gap-2.5">
            {userId ? (
              <Link href="/auth-callback" className={btn.primary}>
                Go to my portal
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className={btn.ghost}>Sign in</Link>
                <Link href="/sign-up" className={btn.primary}>Register as a patient</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-[72rem] mx-auto px-5 sm:px-8 pt-20 pb-16">
          <div className="max-w-[46rem]">
            <p className="eyebrow mb-4">Clinic management &amp; electronic medical records</p>
            <h1 className="text-[40px] sm:text-[52px] font-semibold tracking-[-0.025em] leading-[1.08]">
              One record per patient, from the front desk to the consulting room.
            </h1>
            <p className="mt-6 text-[16px] leading-relaxed text-muted-foreground max-w-[56ch]">
              CareClinic keeps appointments, clinical notes and prescriptions in a single system —
              so reception, physicians and patients are all looking at the same thing.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {userId ? (
                <Link href="/auth-callback" className={`${btn.primary} h-11 px-5`}>
                  Continue to my portal
                </Link>
              ) : (
                <>
                  <Link href="/sign-up" className={`${btn.primary} h-11 px-5`}>
                    Register as a patient
                  </Link>
                  <Link href="/sign-in" className={`${btn.outline} h-11 px-5`}>
                    Sign in
                  </Link>
                </>
              )}
            </div>

            <p className="mt-5 text-[13px] text-muted-foreground">
              Physicians and clinic staff receive their accounts from the practice.
            </p>
          </div>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="max-w-[72rem] mx-auto px-5 sm:px-8 py-16 grid gap-10 md:grid-cols-3">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <span className="grid place-items-center size-9 rounded-md bg-accent text-accent-foreground">
                  <Icon className="size-[18px]" strokeWidth={2} />
                </span>
                <h2 className="mt-4 text-[16px] font-semibold tracking-tight">{title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-[72rem] mx-auto px-5 sm:px-8 py-16">
          <div className="panel-raised p-8 sm:p-10 grid gap-8 md:grid-cols-3">
            <Role
              title="Patients"
              items={["Request a consultation", "Confirm your assigned time", "Read past notes", "Download prescriptions"]}
            />
            <Role
              title="Physicians"
              items={["Today's patient list", "Write consultation notes", "Review clinical history", "Complete or cancel visits"]}
            />
            <Role
              title="Clinic staff"
              items={["Assign and reschedule slots", "Check patients in", "Digitise prescriptions", "Weekly activity reports"]}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="max-w-[72rem] mx-auto px-5 sm:px-8 py-7 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-[13px] text-muted-foreground">
            CareClinic — clinic management and electronic medical records.
          </p>
          <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <ShieldCheck className="size-4" strokeWidth={2} />
            Access to patient records is role-restricted and logged
          </p>
        </div>
      </footer>
    </div>
  );
}

function Role({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[14px] text-muted-foreground">
            <span className="mt-[7px] size-1 rounded-full bg-secondary shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
