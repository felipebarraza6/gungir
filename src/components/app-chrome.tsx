"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { branchLabel, useSessionStore } from "@/lib/store/session";
import { logout } from "@/lib/api/auth";

const NAV: Record<string, { href: string; label: string }[]> = {
  local: [
    { href: "/local", label: "Cotizaciones" },
    { href: "/", label: "Landing" },
  ],
  admin: [
    { href: "/admin", label: "Resumen" },
    { href: "/local", label: "Local" },
    { href: "/", label: "Landing" },
  ],
  cuenta: [
    { href: "/cuenta", label: "Mis cotis" },
    { href: "/#cotizador", label: "Nueva coti" },
  ],
};

export function AppChrome({
  surface,
  title,
  children,
}: {
  surface: "local" | "admin" | "cuenta";
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const branches = useSessionStore((s) => s.branches);
  const currentBranchId = useSessionStore((s) => s.currentBranchId);
  const clearSession = useSessionStore((s) => s.clearSession);
  const branch = branches.find((b) => String(b.id) === String(currentBranchId));

  async function onLogout() {
    await logout();
    clearSession();
    router.replace("/login");
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-primary">
              Gungir · {surface}
            </p>
            <h1 className="font-display text-lg font-semibold tracking-tight">{title}</h1>
            {branch && (
              <p className="text-xs text-muted-foreground">{branchLabel(branch)}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 sm:flex">
              {NAV[surface].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm transition",
                    pathname === item.href
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {user && (
              <span className="hidden text-xs text-muted-foreground md:inline">
                {user.full_name || user.email}
              </span>
            )}
            <Button variant="ghost" className="px-2" onClick={onLogout} aria-label="Salir">
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
