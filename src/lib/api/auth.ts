import { apiFetch } from "./client";
import type { LoginCompleteResponse } from "@/lib/types";

export async function loginComplete(email: string, password: string) {
  return apiFetch<LoginCompleteResponse>("/accounts/users/login_complete/", {
    method: "POST",
    body: { email, password },
    auth: "none",
    branch: "none",
  });
}

export async function logout() {
  try {
    await apiFetch("/accounts/users/logout/", {
      method: "POST",
      auth: "required",
      branch: "none",
    });
  } catch {
    /* ignore */
  }
}
