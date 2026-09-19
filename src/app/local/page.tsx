"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, RefreshCw, XCircle } from "lucide-react";
import { AppChrome } from "@/components/app-chrome";
import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/ui/button";
import { fetchQuotations, patchQuotationStatus } from "@/lib/api/quotations";
import { ApiError } from "@/lib/api/client";
import { formatCLP, cn } from "@/lib/utils";
import type { Quotation } from "@/lib/types";

function clientName(q: Quotation) {
  if (typeof q.client === "object" && q.client && "name" in q.client) {
    return q.client.name || "Cliente";
  }
  return q.client_name || "Cliente";
}

function LocalQuotations() {
  const qc = useQueryClient();
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["local-quotations"],
    queryFn: () => fetchQuotations(50),
  });

  const mutate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      patchQuotationStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["local-quotations"] }),
  });

  const rows = data?.results ?? [];

  return (
    <AppChrome surface="local" title="Cola de cotizaciones">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Cotizaciones de la Branch activa (Yggdra <code className="text-xs">/sales/quotations/</code>).
        </p>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Actualizar
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Cargando…
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error instanceof ApiError
            ? `${error.status}: ${error.message}. ¿Login + seed_gungir + Yggdra :8000?`
            : "Error al cargar cotizaciones."}
        </div>
      )}

      {!isLoading && !error && rows.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
          <p className="font-medium">Sin cotizaciones aún</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Enviá una desde la landing (cotizador). Si el preview es local, el envío necesita{" "}
            <code className="text-xs">POST /api/public/quotes/</code> y{" "}
            <code className="text-xs">NEXT_PUBLIC_GUNGIR_BRANCH_SLUG</code>.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {rows.map((q) => {
          const id = String(q.id);
          const amount = Number(q.total_amount ?? 0);
          return (
            <li
              key={id}
              className="rounded-2xl border border-border bg-card/70 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4"
            >
              <div>
                <p className="font-medium">
                  {q.order_number || id.slice(0, 8)} · {clientName(q)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {q.observation || "Sin detalle"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Estado:{" "}
                  <span className="text-foreground">{q.status || "—"}</span>
                  {q.created ? ` · ${new Date(q.created).toLocaleString("es-CL")}` : null}
                </p>
              </div>
              <div className="mt-3 flex flex-col items-stretch gap-2 sm:mt-0 sm:items-end">
                <p className="font-display text-xl font-semibold text-primary">
                  {formatCLP(amount)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="px-2"
                    disabled={mutate.isPending || q.status === "COMPLETED"}
                    onClick={() => mutate.mutate({ id, status: "COMPLETED" })}
                  >
                    <CheckCircle2 className="size-4" />
                    Aceptar
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn("px-2", "text-danger")}
                    disabled={mutate.isPending || q.status === "CANCELLED"}
                    onClick={() => mutate.mutate({ id, status: "CANCELLED" })}
                  >
                    <XCircle className="size-4" />
                    Rechazar
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </AppChrome>
  );
}

export default function LocalPage() {
  return (
    <AuthGate mode="staff">
      <LocalQuotations />
    </AuthGate>
  );
}
