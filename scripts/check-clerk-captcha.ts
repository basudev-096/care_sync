/**
 * Prints the bot-protection settings your Clerk instance is actually serving.
 *
 * These live in the Clerk Dashboard, not in this repo, so when a CAPTCHA
 * misbehaves this tells you what the client is being told to do:
 *
 *   npx tsx scripts/check-clerk-captcha.ts
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!pk) {
  console.error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set.");
  process.exit(1);
}

// The publishable key encodes the Frontend API host.
const host = Buffer.from(pk.split("_")[2], "base64").toString().replace(/\$$/, "");

async function main() {
const res = await fetch(
  `https://${host}/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.99.0`,
);
const env = await res.json();

const dc = env.display_config ?? {};
const su = env.user_settings?.sign_up ?? {};
const bypass: string[] = dc.captcha_oauth_bypass ?? [];

console.log("Frontend API      :", host);
console.log("Bot protection    :", su.captcha_enabled ? "ON" : "off");

if (su.captcha_enabled) {
  console.log("Widget type       :", dc.captcha_widget_type, "(smart = visible, invisible = background)");
  console.log("Provider          :", dc.captcha_provider);
  console.log(
    "OAuth bypass list :",
    bypass.length ? bypass.join(", ") : "(empty - every OAuth sign-up is challenged)",
  );
} else {
  console.log("\nSign-up is not challenged by a CAPTCHA. Turn protection back on");
  console.log("before production - patient self-registration is public.");
}

if (su.captcha_enabled && bypass.length === 0) {
  console.log(
    "\nGoogle sign-ups are being sent through Turnstile. If the widget loops,\n" +
      "add the OAuth providers to the bypass list, or switch the widget to\n" +
      "invisible, in Clerk Dashboard > Configure > Attack protection.",
  );
}
}

main().catch((err) => {
  console.error("Could not read the Clerk environment:", err);
  process.exitCode = 1;
});
