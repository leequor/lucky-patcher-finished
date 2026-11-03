export const APP_NAME = "Counter";
export const APP_TAGLINE = "Repair operations on one counter.";
export const APP_DESCRIPTION =
  "Counter is a repair-shop operations system for intake, repair tickets, parts, invoices, and customer tracking.";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

export function getAuthCallbackUrl(next = "/reset-password") {
  return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
}
