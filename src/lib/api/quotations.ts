import { apiFetch } from "./client";
import type { Paginated, Quotation } from "@/lib/types";

export async function fetchQuotations(pageSize = 50) {
  return apiFetch<Paginated<Quotation>>(`/sales/quotations/?page_size=${pageSize}&ordering=-created`, {
    auth: "required",
  });
}

export async function fetchQuotation(id: string) {
  return apiFetch<Quotation>(`/sales/quotations/${id}/`, { auth: "required" });
}

export async function patchQuotationStatus(id: string, status: string) {
  return apiFetch<Quotation>(`/sales/quotations/${id}/`, {
    method: "PATCH",
    body: { status },
    auth: "required",
  });
}
