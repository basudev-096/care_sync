import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  // Check both public and unsafe metadata for role
  const role = user.publicMetadata?.role || user.unsafeMetadata?.role;

  // Await the searchParams promise (required in Next 15+)
  const awaitedSearchParams = await searchParams;
  const intendedRole = awaitedSearchParams.intended_role as string | undefined;

  // Check for cross-role login attempt
  if (intendedRole && role && intendedRole !== role) {
    return redirect("/role-mismatch");
  }

  if (!role) {
    return redirect("/onboarding");
  }

  // Redirect based on role
  if (role === "patient") {
    return redirect("/patient/dashboard");
  } else if (role === "physician") {
    return redirect("/physician/dashboard");
  } else if (role === "staff") {
    return redirect("/staff/dashboard");
  }

  // Default fallback if role is unrecognized
  return redirect("/patient/dashboard");
}
