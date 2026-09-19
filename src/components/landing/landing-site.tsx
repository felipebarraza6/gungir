"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogIn,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { fetchLandingConfig } from "@/lib/api/landing";
import { GUNGIR_FALLBACK } from "@/content/landing";
import { HeroPlexus } from "@/components/landing/hero-plexus";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GROUP = process.env.NEXT_PUBLIC_GUNGIR_GROUP ?? "gungir";
/** Demo de landing vertical (cotizador oro) — proyecto aparte en GitHub Pages. */
const DEMO_COTZADOR_URL =
  process.env.NEXT_PUBLIC_DEMO_COTIZADOR_URL ??
  "https://felipebarraza6.github.io/cotizador-oro/";

const STEPS = [
  {
    icon: Store,
    title: "Public",
    text: "Landing white-label por Branch. El cliente cotiza o compra sin instalar app.",
  },
  {
    icon: FileText,
    title: "Local",
    text: "Cola del día: cotis, caja, catálogo e inventario de la sucursal.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin",
    text: "Organización, usuarios, marca y módulos. Super Admin de plataforma: pendiente.",
  },
];

const SURFACES = [
  {
    href: "/cuenta",
    label: "Public",
    title: "Autogestión del cliente",
    text: "Mis cotis, estado y PDF.",
  },
  {
    href: "/local",
    label: "Local",
    title: "Operar la sucursal",
    text: "Staff del negocio, día a día.",
  },
  {
    href: "/admin",
    label: "Admin",
    title: "Organización",
    text: "Dueño de la org en Yggdra.",
  },
];

export function LandingSite() {
  const reduce = useReducedMotion();
  const { data, isError } = useQuery({
    queryKey: ["landing-config", GROUP],
    queryFn: () => fetchLandingConfig(GROUP),
    retry: false,
    staleTime: 60_000,
  });

  const brandName = data?.brand?.app_name || data?.group.display_name || GUNGIR_FALLBACK.appName;
  const headline = data?.group.hero?.headline || GUNGIR_FALLBACK.headline;
  const subhead = data?.group.hero?.subhead || GUNGIR_FALLBACK.subhead;
  const cta = data?.group.hero?.cta_label || GUNGIR_FALLBACK.cta;
  const features =
    data?.group.features?.length
      ? data.group.features
      : [
          {
            icon: "shield",
            title: "100% Yggdra",
            description: "Org + Branch. Sin backend paralelo.",
          },
          {
            icon: "zap",
            title: "Módulos a la carta",
            description: "Sales, catálogo, clientes, finance, analytics.",
          },
          {
            icon: "users",
            title: "Landings que consumen",
            description: "Cualquier landing estática puede pegarle a la API pública.",
          },
        ];

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
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <HeroPlexus className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.14),transparent_55%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-primary">
          {brandName}
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/local"
            className="hidden text-sm text-muted-foreground transition hover:text-foreground md:inline"
          >
            Local
          </Link>
          <Link
            href="/admin"
            className="hidden text-sm text-muted-foreground transition hover:text-foreground sm:inline"
          >
            Admin
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="gap-1.5 px-3">
              <LogIn className="size-4" />
              Entrar
            </Button>
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:pt-16">
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.32 },
              })}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            {isError || !data
              ? "Producto general · Yggdra"
              : "PlanGroup gungir · white-label"}
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
            <a href={DEMO_COTZADOR_URL} target="_blank" rel="noreferrer">
              <Button variant="outline">
                Demo cotizador (cliente)
                <ExternalLink className="size-4" />
              </Button>
            </a>
          </div>
          <ul className="mx-auto mt-10 max-w-md space-y-2 text-left text-sm text-muted-foreground">
            {[
              "No es gastronomía: comercio general sobre la misma API que Frig",
              "Landings aparte (GitHub Pages, dominio del cliente) consumen /api/public/*",
              "Una Organization + Branch en Yggdra = un negocio listo",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      <section className="relative z-10 border-t border-border/50 bg-background/70 py-14 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.h2 {...fade()} className="font-display text-2xl font-semibold tracking-tight">
            Tres superficies
          </motion.h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                {...fade(i * 0.07)}
                className="rounded-2xl border border-border bg-card/70 p-5"
              >
                <step.icon className="mb-3 size-5 text-primary" aria-hidden />
                <h3 className="font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.h2 {...fade()} className="font-display text-2xl font-semibold tracking-tight">
            Entrá a operar
          </motion.h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {SURFACES.map((s, i) => (
              <motion.div key={s.label} {...fade(i * 0.07)}>
                <Link
                  href={s.href}
                  className="block rounded-2xl border border-border bg-card/70 p-5 transition hover:border-primary/40"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">{s.label}</p>
                  <h3 className="mt-1 font-medium">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-border/50 bg-muted/30 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.h2 {...fade()} className="font-display text-2xl font-semibold tracking-tight">
            Capacidad
          </motion.h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={`${f.title}-${i}`}
                {...fade(i * 0.05)}
                className="rounded-xl border border-border bg-card/60 px-4 py-4"
              >
                <Building2 className="mb-2 size-4 text-primary" aria-hidden />
                <h3 className="text-sm font-medium">{f.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fade(0.1)}
            className="mt-10 rounded-2xl border border-primary/25 bg-card/80 p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  Prototipo para cliente
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">
                  Landing cotizador (proyecto aparte)
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  No vive dentro de Gungir. Es una web estática en GitHub Pages que consume{" "}
                  <code className="text-xs">/api/public/quote-preview/</code> y{" "}
                  <code className="text-xs">/api/public/quotes/</code> de Yggdra — el mismo contrato
                  que usaría cualquier landing de un tenant.
                </p>
              </div>
              <a href={DEMO_COTZADOR_URL} target="_blank" rel="noreferrer">
                <Button>
                  Abrir demo
                  <ExternalLink className="size-4" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <footer
        className={cn(
          "relative z-10 border-t border-border/60 bg-background/90",
          "mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground sm:px-6",
        )}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {brandName} · powered by Yggdra ·{" "}
            <a
              className="underline-offset-2 hover:text-foreground hover:underline"
              href="https://github.com/felipebarraza6/gungir"
              target="_blank"
              rel="noreferrer"
            >
              repo
            </a>
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/local" className="hover:text-foreground">
              Local
            </Link>
            <Link href="/admin" className="hover:text-foreground">
              Admin
            </Link>
            <Link href="/cuenta" className="hover:text-foreground">
              Cuenta
            </Link>
            <a href={DEMO_COTZADOR_URL} className="hover:text-foreground" target="_blank" rel="noreferrer">
              Cotizador demo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
