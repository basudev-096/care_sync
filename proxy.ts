import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Layer 1 of route protection: authentication.
 *
 * Everything is protected unless listed here, so a route added later is private
 * by default rather than accidentally public. Role authorization is layer 2 and
 * lives in lib/auth.ts (requireRole / authorize), because a role is read from
 * the database and the Clerk session token does not carry it.
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // Signs the session out while rendering, so it must stay reachable.
  "/auth-error(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
