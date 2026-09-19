import { apiFetch } from "./client";

export interface LandingHero {
  headline: string;
  subhead: string;
  cta_label: string;
  badge?: string;
  points?: string[];
}

export interface LandingFeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface GroupPlanPublic {
  plan_id: string;
  display_name: string;
  description: string;
  features: string[];
  limits: Record<string, unknown>;
  price_uf: number | null;
  sort_order: number;
  highlighted: boolean;
  badge: string | null;
}

export interface LandingGroupConfig {
  slug: string;
  display_name: string;
  description: string;
  integration_uf: number;
  frontend_url: string;
  contact_email: string;
  pricing_note: string;
  hero: LandingHero | null;
  features: LandingFeatureItem[];
}

export interface LandingBrand {
  app_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  color_mode: string;
  tagline: string;
}

export interface LandingConfig {
  group: LandingGroupConfig;
  brand: LandingBrand | null;
  plans: GroupPlanPublic[];
}

/** GET /public/landing-config/ — group | slug | Host. 404 → fallback local. */
export function fetchLandingConfig(group?: string, slug?: string) {
  const qs = new URLSearchParams();
  if (group) qs.set("group", group);
  if (slug) qs.set("slug", slug);
  const query = qs.toString();
  return apiFetch<LandingConfig>(`/public/landing-config/${query ? `?${query}` : ""}`, {
    auth: "none",
    branch: "none",
  });
}
