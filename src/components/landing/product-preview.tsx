"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Banknote,
  FileText,
  Package,
  ShoppingBag,
  Users,
  Warehouse,
} from "lucide-react";
import { cn, formatCLP } from "@/lib/utils";

type Tab = "ventas" | "cotis" | "stock" | "caja" | "clientes";

const TABS: { key: Tab; label: string; icon: typeof ShoppingBag }[] = [
  { key: "ventas", label: "Ventas", icon: ShoppingBag },
  { key: "cotis", label: "Cotizaciones", icon: FileText },
  { key: "stock", label: "Inventario", icon: Warehouse },
  { key: "caja", label: "Caja", icon: Banknote },
  { key: "clientes", label: "Clientes", icon: Users },
];

const SALES = [
  { sku: "Cable UTP Cat6", qty: 12, total: 47880 },
  { sku: "Interruptor 16A", qty: 4, total: 15960 },
  { sku: "Lámpara LED 12W", qty: 8, total: 31920 },
];

const QUOTES = [
  { n: "COT-1042", client: "Constructora Andes", amount: 890000, status: "Vigente" },
  { n: "COT-1041", client: "Taller Mecánico Ríos", amount: 245000, status: "Enviada" },
  { n: "COT-1040", client: "Oficina Norte SpA", amount: 112000, status: "Aceptada" },
];

const STOCK = [
  { name: "Cable UTP Cat6", stock: 84, min: 20 },
  { name: "Interruptor 16A", stock: 12, min: 15 },
  { name: "Lámpara LED 12W", stock: 56, min: 10 },
];

export function ProductPreview() {
  const [tab, setTab] = useState<Tab>("ventas");
  const reduce = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#0e1219] shadow-[0_0_0_1px_rgba(212,160,23,0.08),0_40px_80px_-40px_rgba(0,0,0,0.7)]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-muted-foreground">Gungir · Local demo</span>
        <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
          EN VIVO
        </span>
      </div>

      <div className="grid md:grid-cols-[200px_1fr]">
        {/* Sidebar */}
        <aside className="border-b border-white/[0.06] p-3 md:border-b-0 md:border-r">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Módulos
          </p>
          <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition",
                  tab === t.key
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                )}
              >
                <t.icon className="size-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Panel */}
        <div className="min-h-[320px] p-4 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {tab === "ventas" && <VentasPanel />}
              {tab === "cotis" && <CotisPanel />}
              {tab === "stock" && <StockPanel />}
              {tab === "caja" && <CajaPanel />}
              {tab === "clientes" && <ClientesPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PanelTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

function VentasPanel() {
  return (
    <>
      <PanelTitle title="Punto de venta" hint="Cobro rápido · catálogo táctil" />
      <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SALES.map((p) => (
            <div
              key={p.sku}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 transition hover:border-primary/30"
            >
              <Package className="mb-2 size-4 text-primary" />
              <p className="text-xs font-medium leading-snug">{p.sku}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">x{p.qty}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Carrito</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {SALES.map((p) => (
              <li key={p.sku} className="flex justify-between gap-2">
                <span className="truncate text-muted-foreground">{p.sku}</span>
                <span>{formatCLP(p.total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-xl font-semibold text-primary">
              {formatCLP(SALES.reduce((a, b) => a + b.total, 0))}
            </span>
          </div>
          <button
            type="button"
            className="mt-3 w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground"
          >
            Cobrar
          </button>
        </div>
      </div>
    </>
  );
}

function CotisPanel() {
  return (
    <>
      <PanelTitle title="Cotizaciones" hint="Presupuesto → venta en un clic" />
      <div className="space-y-2">
        {QUOTES.map((q) => (
          <div
            key={q.n}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">
                {q.n} · {q.client}
              </p>
              <p className="text-xs text-muted-foreground">{q.status}</p>
            </div>
            <p className="font-display text-base font-semibold text-primary">
              {formatCLP(q.amount)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function StockPanel() {
  return (
    <>
      <PanelTitle title="Inventario" hint="Stock real por sucursal" />
      <div className="overflow-hidden rounded-xl border border-white/[0.06]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Producto</th>
              <th className="px-4 py-2 font-medium">Stock</th>
              <th className="px-4 py-2 font-medium">Mín.</th>
            </tr>
          </thead>
          <tbody>
            {STOCK.map((s) => (
              <tr key={s.name} className="border-t border-white/[0.05]">
                <td className="px-4 py-2.5">{s.name}</td>
                <td
                  className={cn(
                    "px-4 py-2.5 font-medium",
                    s.stock < s.min ? "text-warning" : "text-success",
                  )}
                >
                  {s.stock}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{s.min}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CajaPanel() {
  return (
    <>
      <PanelTitle title="Caja del día" hint="Apertura · movimientos · cierre" />
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Apertura", value: 150000 },
          { label: "Ventas", value: 428500 },
          { label: "Efectivo esperado", value: 578500 },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{k.label}</p>
            <p className="mt-1 font-display text-xl font-semibold text-primary">
              {formatCLP(k.value)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
        Turno abierto · cajero Ana P. · desde 09:02
      </div>
    </>
  );
}

function ClientesPanel() {
  const clients = [
    { name: "Constructora Andes", tag: "B2B", spent: 4200000 },
    { name: "Taller Mecánico Ríos", tag: "Frecuente", spent: 890000 },
    { name: "Oficina Norte SpA", tag: "Nuevo", spent: 112000 },
  ];
  return (
    <>
      <PanelTitle title="Clientes" hint="Historial y autogestión" />
      <div className="space-y-2">
        {clients.map((c) => (
          <div
            key={c.name}
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              {c.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.tag}</p>
            </div>
            <p className="text-sm text-primary">{formatCLP(c.spent)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
