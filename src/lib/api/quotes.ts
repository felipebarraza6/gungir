import { apiFetch, ApiError } from "./client";

export interface QuotePreviewInput {
  metal: "AU" | "AG" | "PT";
  purity_karat: number;
  weight_g: number;
  slug?: string;
}

export interface QuotePreviewResult {
  metal: string;
  purity_karat: number;
  weight_g: number;
  price_ref_clp_per_g: number;
  spread: number;
  purity_factor: number;
  total_clp: number;
  expires_at: string | null;
  source: "yggdra" | "local-fallback";
}

export interface PublicQuoteSubmit {
  metal: "AU" | "AG" | "PT";
  purity_karat: number;
  weight_g: number;
  contact_name: string;
  email?: string;
  phone?: string;
  notes?: string;
  slug?: string;
}

export interface PublicQuoteResult {
  id: string | number;
  order_number?: string | null;
  total_clp: number;
  expires_at?: string | null;
  status: string;
}

/** Tasas locales solo mientras Yggdra no exponga quote-preview (ver docs/ALCANCES.md §4.1). */
export const LOCAL_METAL_RATES: Record<
  QuotePreviewInput["metal"],
  { label: string; price_ref_clp_per_g: number; spread: number }
> = {
  AU: { label: "Oro", price_ref_clp_per_g: 78_000, spread: 0.12 },
  AG: { label: "Plata", price_ref_clp_per_g: 980, spread: 0.18 },
  PT: { label: "Platino", price_ref_clp_per_g: 42_000, spread: 0.15 },
};

export function computeLocalQuote(input: QuotePreviewInput): QuotePreviewResult {
  const rate = LOCAL_METAL_RATES[input.metal];
  const purity_factor = Math.min(Math.max(input.purity_karat, 1), 24) / 24;
  const total =
    input.weight_g * purity_factor * rate.price_ref_clp_per_g * (1 - rate.spread);
  const expires = new Date(Date.now() + 48 * 60 * 60 * 1000);
  return {
    metal: input.metal,
    purity_karat: input.purity_karat,
    weight_g: input.weight_g,
    price_ref_clp_per_g: rate.price_ref_clp_per_g,
    spread: rate.spread,
    purity_factor,
    total_clp: Math.round(total),
    expires_at: expires.toISOString(),
    source: "local-fallback",
  };
}

/**
 * Intenta preview en Yggdra; si 404/501, usa cálculo local.
 * Endpoint objetivo: POST /api/public/quote-preview/
 */
export async function fetchQuotePreview(input: QuotePreviewInput): Promise<QuotePreviewResult> {
  try {
    const remote = await apiFetch<QuotePreviewResult>("/public/quote-preview/", {
      method: "POST",
      body: input,
      auth: "none",
      branch: "none",
    });
    return { ...remote, source: "yggdra" };
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 501 || err.status === 405)) {
      return computeLocalQuote(input);
    }
    // Red caída / CORS en prototipo → fallback local
    if (err instanceof ApiError && err.status >= 500) {
      return computeLocalQuote(input);
    }
    if (err instanceof TypeError) {
      return computeLocalQuote(input);
    }
    throw err;
  }
}

/**
 * Endpoint objetivo: POST /api/public/quotes/
 * Mientras no exista, lanza ApiError 501 con mensaje claro.
 */
export async function submitPublicQuote(payload: PublicQuoteSubmit): Promise<PublicQuoteResult> {
  try {
    return await apiFetch<PublicQuoteResult>("/public/quotes/", {
      method: "POST",
      body: payload,
      auth: "none",
      branch: "none",
    });
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 501 || err.status === 405)) {
      throw new ApiError(
        501,
        "Yggdra aún no expone POST /api/public/quotes/. Ver docs/ALCANCES.md §4.1.",
        err.detail,
      );
    }
    throw err;
  }
}
