import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSessionUser, HOME_BY_ROLE } from "@/lib/auth";

/**
 * How recently the Clerk account must have been created for this callback to be
 * treated as "the account was made during this attempt". OAuth round-trips
 * finish well inside this window.
 */
const NEW_ACCOUNT_WINDOW_MS = 60_000;

/**
 * Single post-authentication entry point. Routes by the role held in the
 * database, and keeps each auth page to its own job.
 */
export default async function AuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const intent = (await searchParams).intent;
  const user = await getSessionUser();

  if (user) {
    // An existing account arriving from the registration page is a sign-in
    // wearing the wrong hat.
    if (intent === "signup") {
      redirect("/auth-error?reason=account-exists");
    }
    redirect(HOME_BY_ROLE[user.role]);
  }

  // No profile row. Two very different situations land here, and only one of
  // them is an error:
  //
  //   1. An established Clerk account that never finished registering -- the
  //      usual cause is closing the tab on /complete-registration. Rejecting
  //      these would strand the person for good: sign-in would say the account
  //      does not exist, and sign-up would say the email is taken.
  //   2. A Clerk account created moments ago by an OAuth attempt made from the
  //      sign-in page. That is a sign-up wearing the wrong hat.
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const createdDuringThisAttempt =
    Date.now() - new Date(clerkUser.createdAt).getTime() < NEW_ACCOUNT_WINDOW_MS;

  if (intent === "signin" && createdDuringThisAttempt) {
    redirect("/auth-error?reason=no-account");
  }

  redirect("/complete-registration");
}
