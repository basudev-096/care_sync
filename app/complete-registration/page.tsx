import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getSessionUser, HOME_BY_ROLE } from "@/lib/auth";
import { AuthShell } from "@/components/auth-shell";
import { RegistrationForm } from "./form";

export const metadata = { title: "Complete your registration · CareClinic" };

export default async function CompleteRegistrationPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Anyone who already has a profile has nothing to complete.
  const user = await getSessionUser();
  if (user) redirect(HOME_BY_ROLE[user.role]);

  return (
    <AuthShell
      eyebrow="Step 2 of 2"
      title="Complete your registration"
      subtitle="We need a few details to open your patient record. You can update these later from your profile."
    >
      <RegistrationForm />
    </AuthShell>
  );
}
