import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Stethoscope,
  Users,
  FileText,
  Pill,
  BarChart3,
  Building2,
  Download,
  Check,
  ChevronRight,
  HeartPulse,
  Activity,
  Sparkles,
  Lock,
} from "lucide-react";
import { LandingNav } from "@/components/landing-nav";
import { Mark } from "@/components/portal-shell";
import { btn, StatusBadge } from "@/components/ui-kit";

export const metadata = {
  title: "CareSync — Clinic Management & Electronic Medical Records",
  description:
    "A unified platform connecting patients, physicians, and clinic staff for appointment scheduling, consultation notes, patient histories, and digital prescriptions.",
};

const STATS = [
  { value: "3 Roles", label: "Patients, Physicians, Front Desk" },
  { value: "100%", label: "Single Patient Record" },
  { value: "0", label: "Scheduling Phone-Tag" },
  { value: "A4 PDF", label: "Instant Prescription Engine" },
];

const PROBLEMS_SOLUTIONS = [
  {
    icon: Calendar,
    problem: "Phone-tag scheduling bottlenecks",
    solution:
      "Patients submit visit requests with medical reasons. Staff assign real doctor slots, and patients confirm with one click.",
  },
  {
    icon: FileText,
    problem: "Fragmented patient medical histories",
    solution:
      "Full consultation histories, past diagnoses, and previous medication regimens sit one click away in the consulting room.",
  },
  {
    icon: Pill,
    problem: "Illegible handwritten paper prescriptions",
    solution:
      "Front-desk staff transcribe doctor slips into structured medication lines (dosage, timing, duration) and generate clean PDFs.",
  },
  {
    icon: Building2,
    problem: "Poor waiting room and clinic coordination",
    solution:
      "Live status pipeline from arrival to completed visit gives reception and doctors real-time visibility without interruptions.",
  },
];

const ROLES = [
  {
    role: "Patients",
    badge: "Self-Service Portal",
    icon: HeartPulse,
    summary:
      "Convenient self-service access to clinic consultations, medical summaries, and prescriptions.",
    features: [
      "Request consultations with clinical reasons",
      "Review and confirm assigned schedule times",
      "Read doctor consultation summaries & advice",
      "Download official digitized prescription PDFs",
      "Update contact and demographic details",
    ],
    ctaText: "Register as a patient",
    ctaHref: "/sign-up",
    variant: "primary" as const,
  },
  {
    role: "Physicians",
    badge: "Clinical Workspace",
    icon: Stethoscope,
    summary:
      "An uncluttered daily schedule paired with instant patient medical dossiers and clinical note-taking.",
    features: [
      "Today's patient queue sorted chronologically",
      "Real-time waiting room check-in indicators",
      "Instant access to complete historical dossiers",
      "Structured clinical notes (symptoms, diagnosis, advice)",
      "Enforced visit completion verification",
    ],
    ctaText: "Physician sign in",
    ctaHref: "/sign-in",
    variant: "outline" as const,
  },
  {
    role: "Clinic Staff",
    badge: "Front-Desk Operations",
    icon: Building2,
    summary:
      "Master clinic scheduling, arrival check-ins, walk-in management, and prescription digitization.",
    features: [
      "Master schedule with day-by-day navigation",
      "One-click waiting room check-in and no-show logging",
      "Walk-in proxy registration & direct bookings",
      "Prescription digitization desk with multi-line entry",
      "Weekly volume and completed visit reports",
    ],
    ctaText: "Staff portal login",
    ctaHref: "/sign-in",
    variant: "outline" as const,
  },
];

const FEATURES = [
  {
    icon: Lock,
    title: "Secure Multi-Role Access",
    description:
      "Two-layer security model where edge middleware checks sessions and database profiles enforce unforgeable role permissions.",
  },
  {
    icon: Users,
    title: "Patient Demographic Dossiers",
    description:
      "Comprehensive patient profiles with contact records, age calculations, and support for walk-in telephone proxy registration.",
  },
  {
    icon: Activity,
    title: "Asynchronous Appointment Lifecycle",
    description:
      "Structured status progression from request (PENDING) to slot offer (SCHEDULED), confirmation (ACCEPTED), check-in, and completion.",
  },
  {
    icon: FileText,
    title: "Clinical Consultation Notes",
    description:
      "Attending doctors record structured clinical findings—symptoms, differential diagnosis, and medical advice—securely linked to visits.",
  },
  {
    icon: Pill,
    title: "Two-Stage Prescription Digitization",
    description:
      "Staff transcribe paper slips into structured medication data (name, dose, frequency, timing) and generate official vector A4 PDFs.",
  },
  {
    icon: BarChart3,
    title: "Weekly Administrative Analytics",
    description:
      "Automated weekly reporting showing total appointment volumes, completed visits, digitised prescriptions, and daily workload peaks.",
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Request or Register",
    actor: "Patient or Staff",
    description:
      "A patient submits a consultation request describing their symptoms, or front-desk staff registers a walk-in patient by proxy.",
  },
  {
    step: "02",
    title: "Slot Allocation",
    actor: "Clinic Staff",
    description:
      "Reception reviews the clinic schedule, selects an attending doctor, and assigns an optimal date and time.",
  },
  {
    step: "03",
    title: "Patient Confirmation",
    actor: "Patient",
    description:
      "The patient inspects the offered time slot on their dashboard and confirms their attendance with a single click.",
  },
  {
    step: "04",
    title: "Desk Check-In",
    actor: "Clinic Staff",
    description:
      "When the patient arrives, reception marks them as checked in, instantly alerting the physician that they are in the waiting room.",
  },
  {
    step: "05",
    title: "Clinical Consultation",
    actor: "Physician",
    description:
      "The doctor reviews past clinical notes, examines the patient, records symptoms, diagnosis, and medical advice, then closes the visit.",
  },
  {
    step: "06",
    title: "Digitization & PDF",
    actor: "Staff & Patient",
    description:
      "Staff transcribe the medication slip into a structured digital regimen; the patient downloads the official printable A4 PDF.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-accent selection:text-accent-foreground">
      {/* 1. Header / Navigation */}
      <LandingNav isSignedIn={isSignedIn} />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section id="hero" className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border overflow-hidden">
          {/* Subtle paper grid background */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #191d21 1px, transparent 1px), linear-gradient(to bottom, #191d21 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden
          />

          <div className="max-w-[72rem] mx-auto px-5 sm:px-8 relative">
            <div className="max-w-[46rem]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/25 bg-accent/60 text-secondary text-[12px] font-semibold tracking-wide uppercase mb-6">
                <span className="size-2 rounded-full bg-secondary animate-pulse" />
                Clinic Management &amp; Electronic Medical Records
              </div>

              <h1 className="display text-[44px] sm:text-[62px] lg:text-[70px] leading-[1.05] tracking-[-0.02em] text-foreground">
                Healthcare Management, <span className="italic font-normal">Simplified.</span>
              </h1>

              <p className="mt-6 text-[17px] sm:text-[18.5px] leading-[1.65] text-muted-foreground max-w-[52ch]">
                CareSync brings patients, physicians, and clinic staff together through one connected
                platform for appointments, clinical consultations, patient records, and digital prescriptions.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                {isSignedIn ? (
                  <Link
                    href="/auth-callback"
                    className={`${btn.primary} h-11 px-6 text-[15px] inline-flex items-center gap-2 shadow-sm`}
                  >
                    Continue to my portal
                    <ArrowRight className="size-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/sign-up"
                      className={`${btn.primary} h-11 px-6 text-[15px] inline-flex items-center gap-2 shadow-sm`}
                    >
                      Get started
                      <ArrowRight className="size-4" />
                    </Link>
                    <a
                      href="#features"
                      className={`${btn.outline} h-11 px-5 text-[15px] inline-flex items-center gap-2`}
                    >
                      Explore features
                    </a>
                  </>
                )}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-6 text-[13px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-secondary shrink-0" />
                  <span>Unforgeable role-based access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-secondary shrink-0" />
                  <span>Single unified patient dossier</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-secondary shrink-0" />
                  <span>On-demand A4 prescription PDFs</span>
                </div>
              </div>
            </div>

            {/* Interactive Mockup Preview of Actual CareSync UI */}
            <div className="mt-14 lg:mt-16 rounded-lg border border-border-strong bg-surface p-2 sm:p-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              {/* Fake Browser / Window Chrome */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface-sunken/60 rounded-t-md text-[12px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-border-strong" />
                  <span className="size-2.5 rounded-full bg-border-strong" />
                  <span className="size-2.5 rounded-full bg-border-strong" />
                  <span className="ml-3 font-mono text-[11px] text-foreground/70 hidden sm:inline">
                    app.caresync.clinic/staff/dashboard
                  </span>
                </div>
                <span className="text-[11px] font-medium text-secondary flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-secondary" />
                  Live Practice Environment
                </span>
              </div>

              {/* Inside Mockup Content */}
              <div className="p-4 sm:p-6 bg-background space-y-5">
                {/* Mini Stat Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-surface border border-border rounded-md p-4">
                    <p className="eyebrow text-muted-foreground">Expected Today</p>
                    <p className="mt-1.5 text-[24px] font-semibold tnum text-foreground">18</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">Confirmed and offered slots</p>
                  </div>
                  <div className="bg-surface border border-border rounded-md p-4">
                    <p className="eyebrow text-muted-foreground">In Waiting Room</p>
                    <p className="mt-1.5 text-[24px] font-semibold tnum text-secondary">4</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">Checked in &amp; ready</p>
                  </div>
                  <div className="bg-surface border border-border rounded-md p-4">
                    <p className="eyebrow text-muted-foreground">Awaiting a Slot</p>
                    <p className="mt-1.5 text-[24px] font-semibold tnum text-[#9a5a13]">3</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">Patient requests to assign</p>
                  </div>
                </div>

                {/* Split Mockup: Today's Queue & Prescription preview */}
                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
                  {/* Left: Queue */}
                  <div className="bg-surface border border-border rounded-md overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-surface-sunken/40 flex items-center justify-between">
                      <h2 className="text-[13px] font-semibold text-foreground">Today&apos;s Arrivals &amp; Consultations</h2>
                      <span className="text-[11px] font-mono text-muted-foreground">Master Roster</span>
                    </div>
                    <ul className="divide-y divide-border text-[13px]">
                      <li className="px-4 py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[12px] text-muted-foreground w-14">09:30 AM</span>
                          <div>
                            <p className="font-medium text-foreground">Mia Turner</p>
                            <p className="text-[12px] text-muted-foreground">Annual Review · Dr Raj Mehta</p>
                          </div>
                        </div>
                        <StatusBadge status="CHECKED_IN" />
                      </li>
                      <li className="px-4 py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[12px] text-muted-foreground w-14">10:15 AM</span>
                          <div>
                            <p className="font-medium text-foreground">David Chen</p>
                            <p className="text-[12px] text-muted-foreground">Persistent cough · Dr Raj Mehta</p>
                          </div>
                        </div>
                        <StatusBadge status="ACCEPTED" />
                      </li>
                      <li className="px-4 py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[12px] text-muted-foreground w-14">11:00 AM</span>
                          <div>
                            <p className="font-medium text-foreground">Sarah Jenkins</p>
                            <p className="text-[12px] text-muted-foreground">Blood pressure follow-up</p>
                          </div>
                        </div>
                        <StatusBadge status="SCHEDULED" />
                      </li>
                    </ul>
                  </div>

                  {/* Right: Active Prescription Snippet */}
                  <div className="bg-surface border border-border rounded-md p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <span className="text-[11.5px] font-semibold uppercase tracking-wider text-secondary">
                          Digitized Prescription
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">PDF Ready</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div>
                          <p className="text-[13.5px] font-medium text-foreground">Amoxicillin</p>
                          <p className="text-[12px] text-muted-foreground font-mono">
                            500 mg · 3 times daily · After food · 5 days
                          </p>
                        </div>
                        <div>
                          <p className="text-[13.5px] font-medium text-foreground">Paracetamol</p>
                          <p className="text-[12px] text-muted-foreground font-mono">
                            500 mg · As needed · Max 4 doses · 3 days
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">Dr Raj Mehta</span>
                      <span className="inline-flex items-center gap-1.5 text-secondary font-medium">
                        <Download className="size-3.5" />
                        Download A4
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="mt-12 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-[26px] sm:text-[30px] font-semibold text-foreground tracking-tight tnum">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. About CareSync */}
        <section id="about" className="py-20 sm:py-24 border-b border-border bg-surface">
          <div className="max-w-[72rem] mx-auto px-5 sm:px-8">
            <div className="max-w-[42rem] mb-14">
              <p className="eyebrow mb-3">About the Platform</p>
              <h2 className="display text-[32px] sm:text-[42px] leading-tight">
                Designed for outpatient clinics that value clarity, speed, and privacy.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                CareSync replaces disjointed paper files, messy reception spreadsheets, and endless
                phone tag with a structured, role-based Electronic Medical Records (EMR) application.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROBLEMS_SOLUTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.problem}
                    className="p-6 rounded-md border border-border bg-background flex flex-col justify-between hover:border-border-strong transition-colors"
                  >
                    <div>
                      <span className="inline-flex p-2.5 rounded-md bg-accent text-secondary mb-4">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="text-[15px] font-semibold text-foreground mb-2 leading-snug">
                        {item.problem}
                      </h3>
                      <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. User Roles */}
        <section id="roles" className="py-20 sm:py-24 border-b border-border bg-background">
          <div className="max-w-[72rem] mx-auto px-5 sm:px-8">
            <div className="max-w-[40rem] mb-14">
              <p className="eyebrow mb-3">Three Portals, One Unified Record</p>
              <h2 className="display text-[32px] sm:text-[42px] leading-tight">
                Everyone sees exactly what their role requires—and nothing it doesn&apos;t.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                CareSync separates administrative reception tasks from confidential clinical doctor
                notes, strictly applying healthcare data minimization principles.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {ROLES.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.role}
                    className="p-7 rounded-md border border-border bg-surface flex flex-col justify-between shadow-sm hover:border-border-strong transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2.5 rounded-md bg-accent text-secondary">
                          <Icon className="size-5" />
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-surface-sunken px-2 py-0.5 rounded border border-border">
                          {r.badge}
                        </span>
                      </div>

                      <h3 className="text-[20px] font-semibold text-foreground mb-2">{r.role}</h3>
                      <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-6">
                        {r.summary}
                      </p>

                      <ul className="space-y-2.5 text-[13px] text-foreground/85 border-t border-border pt-5 mb-8">
                        {r.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <Check className="size-4 text-secondary shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={isSignedIn ? "/auth-callback" : r.ctaHref}
                      className={`${
                        r.variant === "primary" ? btn.primary : btn.outline
                      } w-full justify-center h-10 text-[13.5px]`}
                    >
                      {isSignedIn ? "Open portal" : r.ctaText}
                      <ChevronRight className="size-4 ml-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Key Features */}
        <section id="features" className="py-20 sm:py-24 border-b border-border bg-surface">
          <div className="max-w-[72rem] mx-auto px-5 sm:px-8">
            <div className="max-w-[40rem] mb-14">
              <p className="eyebrow mb-3">Core Capabilities</p>
              <h2 className="display text-[32px] sm:text-[42px] leading-tight">
                Everything required for modern outpatient workflow excellence.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                Built specifically around the actual operational realities of outpatient clinics,
                general practices, and specialist consulting rooms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="p-6 rounded-md border border-border bg-background hover:border-border-strong transition-all"
                  >
                    <span className="p-2.5 rounded-md bg-accent text-secondary inline-flex mb-4">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="text-[16px] font-semibold text-foreground mb-2">{feat.title}</h3>
                    <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. How It Works */}
        <section id="how-it-works" className="py-20 sm:py-24 border-b border-border bg-background">
          <div className="max-w-[72rem] mx-auto px-5 sm:px-8">
            <div className="max-w-[42rem] mb-14">
              <p className="eyebrow mb-3">Step-by-Step Workflow</p>
              <h2 className="display text-[32px] sm:text-[42px] leading-tight">
                How CareSync coordinates a clinical visit.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                From initial request to the moment the patient walks out with an official digitized
                prescription PDF, every step is recorded and clear.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WORKFLOW_STEPS.map((ws) => (
                <div
                  key={ws.step}
                  className="p-6 rounded-md border border-border bg-surface relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[14px] font-semibold text-secondary">
                        {ws.step}
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground bg-surface-sunken px-2 py-0.5 rounded border border-border">
                        {ws.actor}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-semibold text-foreground mb-2">{ws.title}</h3>
                    <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                      {ws.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Why CareSync */}
        <section id="why-caresync" className="py-20 sm:py-24 border-b border-border bg-surface">
          <div className="max-w-[72rem] mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
              <div>
                <p className="eyebrow mb-3">Practical Value</p>
                <h2 className="display text-[32px] sm:text-[42px] leading-tight">
                  Why healthcare teams choose CareSync over spreadsheets and paper.
                </h2>
                <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">
                  CareSync was not built as a generic form builder. It is an intentional, opinionated
                  workflow engine built strictly to solve outpatient clinic bottlenecks.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="p-1 rounded bg-accent text-secondary mt-0.5">
                      <Check className="size-4" />
                    </span>
                    <div>
                      <p className="text-[14.5px] font-semibold text-foreground">
                        Zero Schedule Clashes
                      </p>
                      <p className="text-[13px] text-muted-foreground">
                        Asymmetric booking ensures doctor calendars match true clinical capacity.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-1 rounded bg-accent text-secondary mt-0.5">
                      <Check className="size-4" />
                    </span>
                    <div>
                      <p className="text-[14.5px] font-semibold text-foreground">
                        Strict Privacy Separation
                      </p>
                      <p className="text-[13px] text-muted-foreground">
                        Front desk handles logistics; confidential medical notes remain between doctor and patient.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-1 rounded bg-accent text-secondary mt-0.5">
                      <Check className="size-4" />
                    </span>
                    <div>
                      <p className="text-[14.5px] font-semibold text-foreground">
                        Clean Medication Standardization
                      </p>
                      <p className="text-[13px] text-muted-foreground">
                        Structured frequency and timing templates eliminate dosage misunderstandings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Callout Card */}
              <div className="p-8 rounded-lg border border-border-strong bg-background shadow-sm">
                <span className="font-mono text-[12px] uppercase tracking-wider text-secondary font-semibold">
                  Architectural Guarantee
                </span>
                <h3 className="mt-2 text-[22px] font-semibold text-foreground leading-snug">
                  Built on Next.js 16 Server Components &amp; PostgreSQL.
                </h3>
                <p className="mt-3 text-[14px] text-muted-foreground leading-relaxed">
                  No slow client-side loading spinners. Medical records, schedules, and reports render
                  on the server and stream instantly with sub-second response times.
                </p>

                <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <p className="font-semibold text-foreground">PostgreSQL &amp; Prisma 7</p>
                    <p className="text-muted-foreground text-[12px]">Type-safe ACID transactions</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Clientless PDF Rendering</p>
                    <p className="text-muted-foreground text-[12px]">Native pdf-lib vector output</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Call to Action Banner */}
        <section id="get-started" className="py-20 sm:py-24 bg-sidebar text-white relative overflow-hidden">
          {/* Subtle paper grid */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden
          />

          <div className="max-w-[50rem] mx-auto px-5 sm:px-8 text-center relative">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[12px] font-medium tracking-wide uppercase mb-6">
              <Sparkles className="size-3.5 text-secondary" />
              Smarter Clinic Operations
            </span>

            <h2 className="display text-[36px] sm:text-[48px] text-white leading-tight">
              Take the first step towards connected clinic management.
            </h2>

            <p className="mt-5 text-[16px] sm:text-[17px] text-white/60 max-w-[44ch] mx-auto leading-relaxed">
              Experience a more connected, efficient way to manage appointments, clinical dossiers,
              and prescriptions with CareSync.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              {isSignedIn ? (
                <Link
                  href="/auth-callback"
                  className="h-11 px-6 rounded-md bg-white text-[#14181b] font-medium text-[14.5px] hover:bg-white/90 transition-colors inline-flex items-center gap-2"
                >
                  Go to my portal
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    className="h-11 px-6 rounded-md bg-white text-[#14181b] font-medium text-[14.5px] hover:bg-white/90 transition-colors inline-flex items-center gap-2"
                  >
                    Get started as a patient
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/sign-in"
                    className="h-11 px-5 rounded-md border border-white/20 text-white hover:bg-white/10 transition-colors text-[14.5px]"
                  >
                    Staff &amp; Clinician login
                  </Link>
                </>
              )}
            </div>

            <p className="mt-6 text-[12.5px] text-white/40 flex items-center justify-center gap-1.5">
              <ShieldCheck className="size-4 text-secondary" />
              Physician and staff credentials are provisioned securely by clinic administration
            </p>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-[72rem] mx-auto px-5 sm:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border">
            {/* Column 1: Brand & Tagline */}
            <div className="md:col-span-1 space-y-3">
              <Link href="/" className="flex items-center gap-2.5">
                <Mark className="size-6" />
                <span className="font-semibold text-[15px] tracking-[-0.01em]">CareSync</span>
              </Link>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Clinic management and electronic medical records engineered for modern outpatient practices.
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div className="space-y-2 text-[13px]">
              <p className="font-semibold text-foreground text-[12px] uppercase tracking-wider mb-3">
                Navigation
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About CareSync</a></li>
                <li><a href="#roles" className="hover:text-foreground transition-colors">Portals &amp; Roles</a></li>
                <li><a href="#features" className="hover:text-foreground transition-colors">Capabilities</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#why-caresync" className="hover:text-foreground transition-colors">Why CareSync</a></li>
              </ul>
            </div>

            {/* Column 3: Portals */}
            <div className="space-y-2 text-[13px]">
              <p className="font-semibold text-foreground text-[12px] uppercase tracking-wider mb-3">
                Application Portals
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/sign-up" className="hover:text-foreground transition-colors">Patient Registration</Link></li>
                <li><Link href="/sign-in" className="hover:text-foreground transition-colors">Physician Workspace</Link></li>
                <li><Link href="/sign-in" className="hover:text-foreground transition-colors">Front Desk Operations</Link></li>
                <li><Link href="/auth-callback" className="hover:text-foreground transition-colors">Role Dispatcher</Link></li>
              </ul>
            </div>

            {/* Column 4: Compliance & Security */}
            <div className="space-y-2 text-[13px]">
              <p className="font-semibold text-foreground text-[12px] uppercase tracking-wider mb-3">
                Security &amp; Privacy
              </p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                All patient health records are subject to strict role-based access control and tamper-proof server-side audit logging.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[12px] text-secondary font-medium">
                <ShieldCheck className="size-4 shrink-0" />
                <span>Encrypted &amp; Authenticated</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[12.5px] text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CareSync EMR System. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <span>Next.js 16 · React 19 · PostgreSQL · Prisma 7</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
