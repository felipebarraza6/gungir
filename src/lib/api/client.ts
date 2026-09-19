/**
 * Cliente HTTP contra la API Yggdra.
 * Auth: Authorization Token · Sucursal: X-Branch-ID
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_YGGDRA_API_BASE ??
  (process.env.NODE_ENV === "production"
    ? "https://api.yggdra.cl/api"
    : "http://localhost:8000/api");

export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const TOKEN_KEY = "gungir.token";
const BRANCH_KEY = "gungir.branch_id";

export class ApiError extends Error {
  status: number;
  detail?: unknown;

  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export function getBranchId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(BRANCH_KEY);
}

export function setBranchId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(BRANCH_KEY, id);
  else window.localStorage.removeItem(BRANCH_KEY);
}

type ApiOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: "auto" | "required" | "none";
  branch?: "auto" | "none";
  signal?: AbortSignal;
  timeoutMs?: number;
};

export async function apiFetch<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    auth = "auto",
    branch = "auto",
    signal: userSignal,
    timeoutMs = 30_000,
  } = opts;

  const controller = new AbortController();
  const timer =
    timeoutMs > 0
      ? setTimeout(() => controller.abort(new ApiError(408, "Tiempo de espera agotado")), timeoutMs)
      : undefined;

  if (userSignal) {
    if (userSignal.aborted) controller.abort(userSignal.reason);
    else userSignal.addEventListener("abort", () => controller.abort(userSignal.reason), { once: true });
  }

  const hdrs: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  const token = getToken();
  if (auth === "required" && !token) {
    clearTimeout(timer);
    throw new ApiError(401, "Sesión requerida");
  }
  if (auth !== "none" && token) {
    hdrs.Authorization = `Token ${token}`;
  }

  const branchId = getBranchId();
  if (branch !== "none" && branchId) {
    hdrs["X-Branch-ID"] = branchId;
  }

  let payload: BodyInit | undefined;
  if (body !== undefined) {
    if (body instanceof FormData) {
      payload = body;
    } else {
      hdrs["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  try {
    const res = await fetch(url, {
      method,
      headers: hdrs,
      body: payload,
      signal: controller.signal,
    });

    if (!res.ok) {
      let detail: unknown;
      let message = res.statusText || `Error ${res.status}`;
      try {
        detail = await res.json();
        if (detail && typeof detail === "object" && "detail" in detail) {
          const d = (detail as { detail: unknown }).detail;
          message = typeof d === "string" ? d : message;
        }
      } catch {
        /* empty */
      }
      throw new ApiError(res.status, message, detail);
    }

    if (res.status === 204) return undefined as T;
    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
