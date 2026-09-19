"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, LogIn, Sparkles } from "lucide-react";
import { fetchLandingConfig, type GroupPlanPublic } from "@/lib/api/landing";
import {
  GUNGIR_FALLBACK,
  LANDING_FEATURES,
  LANDING_INTEGRATION_UF,
  LANDING_PLANS,
  LANDING_PRICING_NOTE,
  type LandingPlan,
} from "@/content/landing";
import { HeroPlexus } from "@/components/landing/hero-plexus";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GROUP = process.env.NEXT_PUBLIC_GUNGIR_GROUP ?? "gungir";

const ICON_FALLBACK = LANDING_FEATURES;

function resolvePlans(remote: GroupPlanPublic[] | undefined): {
  plans: LandingPlan[];
  integrationUf: number;
  pricingNote: string;
} {
  if (!remote?.length) {
    return {
      plans: LANDING_PLANS,
      integrationUf: LANDING_INTEGRATION_UF,
      pricingNote: LANDING_PRICING_NOTE,
    };
  }
  const copyById = new Map(LANDING_PLANS.map((p) => [p.id, p]));
  const plans = remote.map((gp) => {
    const copy = copyById.get(gp.plan_id);
    return {
      id: gp.plan_id,
      name: gp.display_name,
      tagline: gp.description || copy?.tagline || "",
      priceUf: gp.price_uf,
      resources: gp.features?.length ? gp.features : (copy?.resources ?? []),
      highlighted: gp.highlighted || copy?.highlighted,
      badge: gp.badge ?? copy?.badge ?? null,
    } satisfies LandingPlan;
  });
  return {
    plans,
    integrationUf: LANDING_INTEGRATION_UF,
    pricingNote: LANDING_PRICING_NOTE,
  };
}

export function LandingSite() {
  const reduce = useReducedMotion();
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

  const features = useMemo(() => {
    const remote = data?.group.features;
    if (!remote?.length) return ICON_FALLBACK;
    return remote.map((f, i) => ({
      icon: ICON_FALLBACK[i % ICON_FALLBACK.length].icon,
      title: f.title,
      description: f.description,
    }));
  }, [data?.group.features]);

  const { plans, integrationUf, pricingNote } = useMemo(
    () => resolvePlans(data?.plans),
    [data?.plans],
  );

  useEffect(() => {
    const color = data?.brand?.primary_color;
    if (color) document.documentElement.style.setProperty("--brand-primary", color);
  }, [data?.brand?.primary_color]);

  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.32, delay, ease: "easeOut" as const },
        };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-55">
        <HeroPlexus className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.14),transparent_55%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-primary">
          {brandName}
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5">
          <a href="#producto" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
            Producto
          </a>
          <a href="#planes" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
            Planes
          </a>
          <Link href="/login">
            <Button variant="ghost" className="gap-1.5 px-3">
              <LogIn className="size-4" />
              Entrar
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:pt-16">
        <motion.div
          {...(reduce
            ? {}
            : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.32 } })}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            Comercio general · multi-sucursal
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            {headline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {subhead}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/login">
              <Button>
                {cta}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <a href={`mailto:${contact}?subject=Demo%20Gungir`}>
              <Button variant="outline">Pedir una demo</Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Producto */}
      <section id="producto" className="relative z-10 border-t border-border/50 bg-background/75 py-14 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fade()}>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Todo lo que necesitás para operar
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Módulos reales del sistema. Activás lo que usás; el negocio crece sin migrar de plataforma.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fade(i * 0.04)}
                className="rounded-2xl border border-border bg-card/70 p-5"
              >
                <f.icon className="mb-3 size-5 text-primary" aria-hidden />
                <h3 className="font-medium">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="relative z-10 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fade()} className="text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Planes
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              {data?.group.pricing_note || pricingNote}
              {integrationUf > 0 ? ` Integración desde ${integrationUf} UF.` : null}
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                {...fade(i * 0.07)}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card/80 p-6",
                  plan.highlighted ? "border-primary/50 shadow-[0_0_0_1px_rgba(212,160,23,0.2)]" : "border-border",
                )}
              >
                {plan.badge || plan.highlighted ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    {plan.badge || "Recomendado"}
                  </span>
                ) : null}
                <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                <p className="mt-5 font-display text-3xl font-semibold tracking-tight text-primary">
                  {plan.priceUf == null ? "A convenir" : `${plan.priceUf} UF`}
                  {plan.priceUf != null ? (
                    <span className="text-sm font-normal text-muted-foreground"> / mes</span>
                  ) : null}
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                  {plan.resources.map((r) => (
                    <li key={r} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="mt-6 block">
                  <Button className="w-full" variant={plan.highlighted ? "primary" : "outline"}>
                    Elegir {plan.name}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative z-10 border-t border-border/50 bg-muted/25 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.h2 {...fade()} className="font-display text-2xl font-semibold tracking-tight">
            Probá Gungir en tu operación
          </motion.h2>
          <motion.p {...fade(0.05)} className="mt-3 text-sm text-muted-foreground">
            Entrá con tu cuenta o pedí una demo. Public para tus clientes, Local para el equipo y Admin para la organización.
          </motion.p>
          <motion.div {...fade(0.1)} className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/login">
              <Button>
                Entrar
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <a href={`mailto:${contact}?subject=Demo%20Gungir`}>
              <Button variant="outline">Contacto</Button>
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/60 px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>{brandName}</p>
          <div className="flex flex-wrap gap-4">
            <a href="#producto" className="hover:text-foreground">
              Producto
            </a>
            <a href="#planes" className="hover:text-foreground">
              Planes
            </a>
            <Link href="/login" className="hover:text-foreground">
              Entrar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
