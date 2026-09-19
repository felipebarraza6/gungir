"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Copy,
  LogIn,
  Mail,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { fetchLandingConfig, type GroupPlanPublic } from "@/lib/api/landing";
import {
  GUNGIR_FALLBACK,
  LANDING_DEMOS,
  LANDING_FEATURES,
  LANDING_INTEGRATION_UF,
  LANDING_PLANS,
  LANDING_PRICING_NOTE,
  type LandingPlan,
} from "@/content/landing";
import { HeroPlexus } from "@/components/landing/hero-plexus";
import { GungirMark } from "@/components/landing/gungir-mark";
import { ProductPreview } from "@/components/landing/product-preview";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { SectionTitle } from "@/components/landing/section-title";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GROUP = process.env.NEXT_PUBLIC_GUNGIR_GROUP ?? "gungir";

const NAV = [
  { href: "#producto", label: "Producto" },
  { href: "#demo", label: "Demo" },
  { href: "#casos", label: "Casos" },
  { href: "#planes", label: "Planes" },
  { href: "#contacto", label: "Contacto" },
];

function resolvePlans(remote: GroupPlanPublic[] | undefined): LandingPlan[] {
  if (!remote?.length) return LANDING_PLANS;
  const copyById = new Map(LANDING_PLANS.map((p) => [p.id, p]));
  return remote.map((gp) => {
    const copy = copyById.get(gp.plan_id);
    return {
      id: gp.plan_id,
      name: gp.display_name,
      tagline: gp.description || copy?.tagline || "",
      priceUf: gp.price_uf,
      resources: gp.features?.length ? gp.features : (copy?.resources ?? []),
      highlighted: gp.highlighted || copy?.highlighted,
      badge: gp.badge ?? copy?.badge ?? null,
    };
  });
}

export function LandingSite() {
  const reduce = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["landing-config", GROUP],
    queryFn: () => fetchLandingConfig(GROUP),
    retry: false,
    staleTime: 60_000,
  });

  const brandName = data?.brand?.app_name || data?.group.display_name || GUNGIR_FALLBACK.appName;
  const headline = data?.group.hero?.headline || GUNGIR_FALLBACK.headline;
  const subhead = data?.group.hero?.subhead || GUNGIR_FALLBACK.subhead;
  const cta = data?.group.hero?.cta_label || GUNGIR_FALLBACK.cta;
  const contact = data?.group.contact_email || GUNGIR_FALLBACK.contactEmail;
  const points = data?.group.hero?.points?.length
    ? data.group.hero.points
    : GUNGIR_FALLBACK.points;

  const features = useMemo(() => {
    const remote = data?.group.features;
    if (!remote?.length) return LANDING_FEATURES;
    return remote.map((f, i) => ({
      icon: LANDING_FEATURES[i % LANDING_FEATURES.length].icon,
      title: f.title,
      description: f.description,
    }));
  }, [data?.group.features]);

  const plans = useMemo(() => resolvePlans(data?.plans), [data?.plans]);
  const pricingNote = data?.group.pricing_note || LANDING_PRICING_NOTE;
  const integrationUf = data?.group.integration_uf ?? LANDING_INTEGRATION_UF;

  useEffect(() => {
    const color = data?.brand?.primary_color;
    if (color) document.documentElement.style.setProperty("--brand-primary", color);
  }, [data?.brand?.primary_color]);

  async function copyCreds(user: string, password: string) {
    try {
      await navigator.clipboard.writeText(`${user} / ${password}`);
      setCopied(user);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      {/* Atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-50">
          <HeroPlexus className="h-full w-full" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(212,160,23,0.16),transparent_45%),radial-gradient(ellipse_at_90%_10%,rgba(125,211,192,0.08),transparent_40%),linear-gradient(to_bottom,#0b0e14_0%,#0b0e14_60%,#0b0e14_100%)]" />
        <div className="landing-grid absolute inset-0 opacity-[0.35]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0b0e14]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-foreground transition hover:text-primary">
            <GungirMark className="h-9 sm:h-10" />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            {NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-muted-foreground transition hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="gap-1.5">
                <LogIn className="size-4" />
                Entrar
              </Button>
            </Link>
            <a href="#demo" className="hidden sm:block">
              <Button className="gap-1.5">
                Ver demo
                <ArrowRight className="size-4" />
              </Button>
            </a>
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 md:hidden"
              aria-label="Menú"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/[0.06] md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-3">
                {NAV.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  >
                    {l.label}
                  </a>
                ))}
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-lg border border-border px-3 py-2.5 text-center text-sm"
                >
                  Entrar
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section className="relative mx-auto flex min-h-[calc(100dvh-4.25rem)] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
        >
          <Sparkles className="size-3.5" />
          Comercio general · multi-sucursal
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="font-display max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl"
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {subhead}
        </motion.p>

        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-7 grid max-w-xl gap-2 text-sm text-muted-foreground sm:grid-cols-1"
        >
          {points.map((p) => (
            <li key={p} className="flex items-center justify-center gap-2">
              <Check className="size-4 shrink-0 text-primary" />
              <span>{p}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <a href="#demo">
            <Button className="gap-2 px-5 py-2.5 text-sm">
              {cta}
              <ArrowRight className="size-4" />
            </Button>
          </a>
          <a href="#planes">
            <Button variant="outline" className="px-5 py-2.5 text-sm">
              Ver planes
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-14 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />
      </section>

      {/* Demo preview */}
      <section id="demo" className="relative scroll-mt-24 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <SectionTitle
              eyebrow="Demo pública"
              title="Así se siente Gungir"
              subtitle="Explorá los módulos reales: ventas, cotizaciones, inventario, caja y clientes. Sin instalar nada."
              align="center"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="mt-10">
            <ProductPreview />
          </ScrollReveal>
        </div>
      </section>

      {/* Producto */}
      <section id="producto" className="relative scroll-mt-24 py-20">
        <div className="landing-section-glow pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <SectionTitle
              eyebrow="Producto"
              title="Todo lo necesario para operar"
              subtitle="Módulos del día a día. Activás lo que usás y crecés sin cambiar de sistema."
            />
          </ScrollReveal>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.04}>
                <article className="group h-full rounded-2xl border border-border/80 bg-card/50 p-5 transition hover:border-primary/35 hover:bg-card/80">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary/15">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="font-medium">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Casos / demos */}
      <section id="casos" className="relative scroll-mt-24 border-y border-white/[0.05] bg-white/[0.02] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <SectionTitle
              eyebrow="Casos de uso"
              title="Entrá a una demo pública"
              subtitle="Tres rubros listos. Usá las credenciales e ingresá al panel."
              align="center"
            />
          </ScrollReveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {LANDING_DEMOS.map((d, i) => (
              <ScrollReveal key={d.slug} delay={i * 0.07}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/60">
                  <div
                    className="h-1.5 w-full"
                    style={{ background: `linear-gradient(90deg, ${d.color}, transparent)` }}
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {d.rubro}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold">{d.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{d.highlight}</p>
                    <div className="mt-4 rounded-xl bg-muted/60 px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                      <p>{d.user}</p>
                      <p>{d.password}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link href="/login" className="flex-1">
                        <Button className="w-full" variant="outline">
                          Entrar
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="px-3"
                        onClick={() => copyCreds(d.user, d.password)}
                        aria-label="Copiar credenciales"
                      >
                        <Copy className="size-4" />
                        {copied === d.user ? "OK" : null}
                      </Button>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="relative scroll-mt-24 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <SectionTitle
              eyebrow="Planes"
              title="Simple, transparente"
              subtitle={`${pricingNote}${integrationUf > 0 ? ` Integración desde ${integrationUf} UF.` : ""}`}
              align="center"
            />
          </ScrollReveal>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <ScrollReveal key={plan.id} delay={i * 0.08}>
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl border p-6",
                    plan.highlighted
                      ? "border-primary/50 bg-gradient-to-b from-primary/10 to-card/80 shadow-[0_0_60px_-30px_rgba(212,160,23,0.55)]"
                      : "border-border bg-card/55",
                  )}
                >
                  {(plan.badge || plan.highlighted) && (
                    <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                      {plan.badge || "Recomendado"}
                    </span>
                  )}
                  <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                  <p className="mt-5 font-display text-3xl font-semibold tracking-tight text-primary">
                    {plan.priceUf == null ? "A convenir" : `${plan.priceUf} UF`}
                    {plan.priceUf != null && (
                      <span className="text-sm font-normal text-muted-foreground"> / mes</span>
                    )}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5 text-sm text-muted-foreground">
                    {plan.resources.map((r) => (
                      <li key={r} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/login" className="mt-6 block">
                    <Button className="w-full" variant={plan.highlighted ? "primary" : "outline"}>
                      Elegir {plan.name}
                    </Button>
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="relative scroll-mt-24 border-t border-white/[0.05] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <ScrollReveal>
            <SectionTitle
              eyebrow="Contacto"
              title={`Hablemos de ${brandName}`}
              subtitle="Pedí una demo o escribinos. Te armamos la cuenta y la primera sucursal."
              align="center"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={`mailto:${contact}?subject=Demo%20Gungir`}>
              <Button className="gap-2">
                <Mail className="size-4" />
                {contact}
              </Button>
            </a>
            <Link href="/login">
              <Button variant="outline" className="gap-2">
                <LogIn className="size-4" />
                Ya tengo cuenta
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <GungirMark className="h-8 text-foreground" />
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {NAV.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-foreground">
                {l.label}
              </a>
            ))}
            <Link href="/login" className="hover:text-foreground">
              Entrar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
