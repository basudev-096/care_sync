import { requireRole } from "@/lib/auth";
import { PageHeader, Panel, age } from "@/components/ui-kit";
import { ProfileForm } from "./form";

export const metadata = { title: "My details" };

export default async function PatientProfile() {
  // WBS 2.1.1 / 2.1.2 - view and update own demographic information.
  const { profile } = await requireRole("PATIENT");
  const years = age(profile.dob);

  return (
    <>
      <PageHeader
        eyebrow="My details"
        title="Personal information"
        description="Reception uses these details to contact you about appointments."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem] items-start">
        <Panel title="Edit details">
          <ProfileForm
            defaults={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              phone: profile.phone ?? "",
              sex: profile.sex ?? "",
              dob: profile.dob ? new Date(profile.dob).toISOString().slice(0, 10) : "",
            }}
          />
        </Panel>

        <Panel title="On file">
          <dl className="space-y-3.5 text-[14px]">
            <Item label="Email" value={profile.email} hint="Used to sign in — cannot be changed here." />
            <Item label="Age" value={years !== null ? `${years}` : "Not recorded"} />
            <Item
              label="Patient since"
              value={new Date(profile.createdAt).toLocaleDateString()}
            />
          </dl>
        </Panel>
      </div>
    </>
  );
}

function Item({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <dt className="eyebrow mb-1">{label}</dt>
      <dd className="break-words">{value}</dd>
      {hint ? <p className="mt-0.5 text-[12px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
