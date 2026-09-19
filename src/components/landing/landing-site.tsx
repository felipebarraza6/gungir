"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { fetchLandingConfig } from "@/lib/api/landing";
import { GUNGIR_FALLBACK } from "@/content/landing";
import { HeroPlexus } from "@/components/landing/hero-plexus";
import { GoldQuoteForm } from "@/components/landing/gold-quote-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GROUP = process.env.NEXT_PUBLIC_GUNGIR_GROUP ?? "gungir";
const BRANCH_SLUG = process.env.NEXT_PUBLIC_GUNGIR_BRANCH_SLUG || undefined;

export function LandingSite() {
  const reduce = useReducedMotion();
  const { data } = useQuery({
    queryKey: ["landing-config", GROUP, BRANCH_SLUG],
    queryFn: () => fetchLandingConfig(GROUP, BRANCH_SLUG),
    retry: false,
    staleTime: 60_000,
  });

  const brandName = data?.brand?.app_name || data?.group.display_name || GUNGIR_FALLBACK.appName;
  const headline = data?.group.hero?.headline || GUNGIR_FALLBACK.headline;
  const subhead = data?.group.hero?.subhead || GUNGIR_FALLBACK.subhead;
  const cta = data?.group.hero?.cta_label || GUNGIR_FALLBACK.cta;

  useEffect(() => {
    const color = data?.brand?.primary_color;
    if (color) document.documentElement.style.setProperty("--brand-primary", color);
  }, [data?.brand?.primary_color]);

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.32, ease: "easeOut" as const },
      };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <HeroPlexus className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.12),transparent_55%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-primary">
          {brandName}
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/cuenta"
            className="hidden text-sm text-muted-foreground transition hover:text-foreground sm:inline"
          >
            Mi cuenta
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="gap-1.5 px-3">
              <LogIn className="size-4" />
              Entrar
            </Button>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-6 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pt-12">
        <motion.div {...fade} className="flex flex-col justify-center">
          <p className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            Precio del día · Branch Yggdra
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            {headline}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-[15px]">
            {subhead}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#cotizador">
              <Button>
                {cta}
                <ArrowRight className="size-4" />
              </Button>
            </a>
            <Link href="/cuenta">
              <Button variant="outline">Ver mis cotizaciones</Button>
            </Link>
          </div>
          <ul className="mt-8 space-y-2 text-sm text-muted-foreground">
            {[
              "Oferta clara con ley, peso y spread de compra",
              "Seguimiento en tu cuenta sin llamar al local",
              "Operación 100% sobre Yggdra (org + branch)",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          {...fade}
          transition={reduce ? undefined : { duration: 0.32, delay: 0.07, ease: "easeOut" }}
        >
          <GoldQuoteForm branchSlug={BRANCH_SLUG} />
        </motion.div>
      </main>

      <footer
        className={cn(
          "relative z-10 border-t border-border/60 bg-background/80",
          "mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground sm:px-6",
        )}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {brandName} · powered by Yggdra
          </p>
          <div className="flex gap-4">
            <Link href="/local" className="hover:text-foreground">
              Local
            </Link>
            <Link href="/admin" className="hover:text-foreground">
              Admin
            </Link>
            <span className="opacity-50" title="Pendiente — ver docs/ALCANCES.md §5">
              Super Admin
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
