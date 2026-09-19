"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { AppChrome } from "@/components/app-chrome";
import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/ui/button";
import { fetchQuotations } from "@/lib/api/quotations";
import { ApiError } from "@/lib/api/client";
import { formatCLP } from "@/lib/utils";
import { useSessionStore } from "@/lib/store/session";

function CuentaContent() {
  const user = useSessionStore((s) => s.user);
  const { data, isLoading, error } = useQuery({
    queryKey: ["cuenta-quotations"],
    queryFn: () => fetchQuotations(50),
  });

  const rows = data?.results ?? [];

  return (
    <AppChrome surface="cuenta" title="Mis cotizaciones">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Hola {user?.first_name || user?.email}. Autogestión sobre Yggdra.
        </p>
        <Link href="/#cotizador">
          <Button>
            <Plus className="size-4" />
            Nueva cotización
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Cargando…
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          {error instanceof ApiError && error.status === 403
            ? "Tu usuario cliente aún no tiene permiso de listar cotis. Falta el scope en Yggdra (ALCANCES §4.2)."
            : error instanceof ApiError
              ? `${error.status}: ${error.message}`
              : "No se pudieron cargar tus cotizaciones."}
        </div>
      )}

      {!isLoading && !error && rows.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
          <p className="font-medium">Todavía no tenés cotizaciones</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Armá una desde el cotizador público.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {rows.map((q) => (
          <li key={String(q.id)} className="rounded-2xl border border-border bg-card/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{q.order_number || String(q.id).slice(0, 8)}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {q.observation || "Cotización"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-semibold text-primary">
                  {formatCLP(Number(q.total_amount ?? 0))}
                </p>
                <p className="text-xs text-muted-foreground">{q.status || "—"}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </AppChrome>
  );
}

export default function CuentaPage() {
  return (
    <AuthGate mode="client">
      <CuentaContent />
    </AuthGate>
  );
}
