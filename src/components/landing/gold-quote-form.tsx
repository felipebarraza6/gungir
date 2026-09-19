"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Loader2, Send, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCLP, cn } from "@/lib/utils";
import {
  computeLocalQuote,
  fetchQuotePreview,
  submitPublicQuote,
  LOCAL_METAL_RATES,
  type QuotePreviewInput,
  type QuotePreviewResult,
} from "@/lib/api/quotes";
import { ApiError } from "@/lib/api/client";

const METALS: { id: QuotePreviewInput["metal"]; label: string }[] = [
  { id: "AU", label: "Oro" },
  { id: "AG", label: "Plata" },
  { id: "PT", label: "Platino" },
];

const KARATS = [24, 22, 18, 14, 10];

type Props = {
  branchSlug?: string;
};

export function GoldQuoteForm({ branchSlug }: Props) {
  const reduce = useReducedMotion();
  const [metal, setMetal] = useState<QuotePreviewInput["metal"]>("AU");
  const [karat, setKarat] = useState(18);
  const [weight, setWeight] = useState(10);
  const [preview, setPreview] = useState<QuotePreviewResult | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const input = useMemo(
    () => ({ metal, purity_karat: karat, weight_g: weight, slug: branchSlug }),
    [metal, karat, weight, branchSlug],
  );

  useEffect(() => {
    let cancelled = false;
    setPreviewing(true);
    const handle = window.setTimeout(async () => {
      try {
        const result = await fetchQuotePreview(input);
        if (!cancelled) setPreview(result);
      } catch {
        if (!cancelled) setPreview(computeLocalQuote(input));
      } finally {
        if (!cancelled) setPreviewing(false);
      }
    }, 180);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [input]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMsg(null);
    if (!name.trim() || (!email.trim() && !phone.trim())) {
      setSubmitMsg({ type: "err", text: "Nombre y al menos email o teléfono." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitPublicQuote({
        ...input,
        contact_name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      setSubmitMsg({
        type: "ok",
        text: `Cotización ${res.order_number ?? res.id} registrada. Entrá a Mi cuenta para seguirla.`,
      });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "No se pudo enviar. Revisá la conexión.";
      setSubmitMsg({ type: "err", text: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const displayTotal = preview?.total_clp ?? 0;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card/80 p-5 shadow-[0_0_0_1px_rgba(212,160,23,0.08)] backdrop-blur-sm sm:p-6"
      id="cotizador"
    >
      <div className="mb-5 flex items-center gap-2">
        <Scale className="size-5 text-primary" aria-hidden />
        <h2 className="font-display text-lg font-semibold tracking-tight">Cotizador</h2>
      </div>

      <fieldset className="mb-4">
        <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Metal
        </legend>
        <div className="flex flex-wrap gap-2">
          {METALS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMetal(m.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition duration-150",
                metal === m.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Ley (kilates)
        </legend>
        <div className="flex flex-wrap gap-2">
          {KARATS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKarat(k)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition duration-150",
                karat === k
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {k}k
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mb-6 block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Peso (gramos)
        </span>
        <input
          type="range"
          min={0.5}
          max={200}
          step={0.5}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="mb-2 w-full accent-[var(--brand-primary)]"
        />
        <input
          type="number"
          min={0.1}
          step={0.1}
          value={weight}
          onChange={(e) => setWeight(Math.max(0.1, Number(e.target.value) || 0.1))}
          className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
        />
      </label>

      <div className="mb-6 rounded-xl border border-border bg-muted/60 p-4">
        <p className="text-xs text-muted-foreground">Oferta estimada</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={displayTotal}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-display text-3xl font-semibold tracking-tight text-primary"
          >
            {previewing && !preview ? "…" : formatCLP(displayTotal)}
          </motion.p>
        </AnimatePresence>
        {preview && (
          <p className="mt-2 text-xs text-muted-foreground">
            Ref. {formatCLP(preview.price_ref_clp_per_g)}/g · ley {(preview.purity_factor * 100).toFixed(1)}%
            · spread {(preview.spread * 100).toFixed(0)}%
            {preview.source === "local-fallback" ? " · estimación" : " · precio del día"}
          </p>
        )}
        <p className="mt-1 text-[11px] text-muted-foreground">
          Precio de compra del día ({LOCAL_METAL_RATES[metal].label}). Vigencia típica 48 h.
        </p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs text-muted-foreground">Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
            autoComplete="name"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted-foreground">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted-foreground">Teléfono</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
            autoComplete="tel"
          />
        </label>
      </div>

      {!branchSlug && (
        <p className="mb-3 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
          Falta <code>NEXT_PUBLIC_GUNGIR_BRANCH_SLUG</code> (ej. casa-oro). Sin slug el envío a
          no se resuelve la sucursal.
        </p>
      )}

      {submitMsg && (
        <p
          className={cn(
            "mb-3 rounded-lg px-3 py-2 text-sm",
            submitMsg.type === "ok" ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
          )}
          role="status"
        >
          {submitMsg.text}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        Enviar cotización
      </Button>
    </form>
  );
}
