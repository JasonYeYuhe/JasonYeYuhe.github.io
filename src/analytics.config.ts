/**
 * Privacy-friendly analytics, opt-in by editing this file.
 *
 *   provider = "none"        → no analytics (default; nothing shipped)
 *   provider = "plausible"   → set `id` to your domain (e.g. "jasonyeyuhe.github.io")
 *   provider = "umami"       → set `id` to your website id + `scriptUrl` to your Umami host
 *   provider = "goatcounter" → set `scriptUrl` to your "https://<code>.goatcounter.com/count"
 *
 * Re-deploy after changing values. No cookies are dropped regardless of provider.
 */
export type AnalyticsConfig =
  | { provider: "none" }
  | { provider: "plausible"; id: string; scriptUrl?: string }
  | { provider: "umami"; id: string; scriptUrl: string }
  | { provider: "goatcounter"; scriptUrl: string };

export const analytics: AnalyticsConfig = {
  provider: "none",
};
