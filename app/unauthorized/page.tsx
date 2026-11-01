import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { getSessionUser, HOME_BY_ROLE, ROLE_LABEL } from "@/lib/auth";

export const metadata = { title: "Access denied" };

/**
 * Shown when a signed-in user reaches a route their role does not cover. It
 * renders no protected data -- only who they are and where they may go.
 */
export default async function UnauthorizedPage() {
  const user = await getSessionUser();
  const home = user ? HOME_BY_ROLE[user.role] : "/sign-in";

  return (
    <main className="min-h-screen grid place-items-center px-5 py-16 bg-background">
      <div className="w-full max-w-[27rem]">
        <span className="grid place-items-center size-11 rounded-md bg-destructive/8 text-destructive border border-destructive/15">
          <ShieldAlert className="size-[22px]" strokeWidth={2} />
        </span>

        <h1 className="mt-6 text-[26px] font-semibold tracking-tight leading-tight">
          You don&apos;t have permission to access this page
        </h1>

        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          {user
            ? `You're signed in as ${ROLE_LABEL[user.role]}. This area belongs to a different role, so it hasn't been loaded.`
            : "Please sign in to continue."}
        </p>

        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link
            href={home}
            className="h-10 px-4 inline-flex items-center rounded-md bg-primary text-primary-foreground font-medium text-[0.9375rem] hover:bg-primary/90 transition-colors"
          >
            {user ? "Back to my portal" : "Go to sign in"}
          </Link>
          <Link
            href="/"
            className="h-10 px-4 inline-flex items-center rounded-md border border-input bg-white font-medium text-[0.9375rem] hover:bg-muted transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
