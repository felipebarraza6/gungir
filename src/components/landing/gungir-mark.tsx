"use client";

/** Marca Gungir: lanza / runa en trazo fino + wordmark. */
export function GungirMark({ className }: { className?: string }) {
  return (
    <div className={className} aria-label="Gungir">
      <svg viewBox="0 0 280 56" fill="none" className="h-full w-auto" role="img">
        <title>Gungir</title>
        {/* Spear tip */}
        <path
          d="M18 28 L34 12 L38 28 L34 44 Z"
          fill="currentColor"
          className="text-primary"
          opacity="0.95"
        />
        <path
          d="M38 28 H78"
          stroke="currentColor"
          className="text-primary"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="86" cy="28" r="3.5" className="fill-primary" />
        {/* Wordmark */}
        <text
          x="104"
          y="36"
          fill="currentColor"
          className="fill-foreground"
          style={{
            fontFamily: "var(--font-space), ui-sans-serif, system-ui",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.04em",
          }}
        >
          Gungir
        </text>
      </svg>
    </div>
  );
}
