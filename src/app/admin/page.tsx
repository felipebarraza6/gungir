"use client";

import Link from "next/link";
import { Building2, Layers, Users } from "lucide-react";
import { AppChrome } from "@/components/app-chrome";
import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/ui/button";
import { branchLabel, useSessionStore } from "@/lib/store/session";

function AdminContent() {
  const user = useSessionStore((s) => s.user);
  const branches = useSessionStore((s) => s.branches);
  const currentBranchId = useSessionStore((s) => s.currentBranchId);
  const setCurrentBranch = useSessionStore((s) => s.setCurrentBranch);

  return (
    <AppChrome surface="admin" title="Organización">
      <p className="mb-6 text-sm text-muted-foreground">
        Dueño de la org: {user?.email}. Super Admin de plataforma (todas las orgs) sigue pendiente —
        ver docs/ALCANCES.md §5.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/70 p-5">
          <Building2 className="mb-3 size-5 text-primary" />
          <h2 className="font-medium">Sucursales</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {branches.length} branch(es) en sesión.
          </p>
          <ul className="mt-3 space-y-2">
            {branches.map((b) => (
              <li key={String(b.id)}>
                <button
                  type="button"
                  onClick={() => setCurrentBranch(String(b.id))}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    String(b.id) === String(currentBranchId)
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {branchLabel(b)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-5">
          <Users className="mb-3 size-5 text-primary" />
          <h2 className="font-medium">Operación</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            La cola del día vive en Local, no acá.
          </p>
          <Link href="/local" className="mt-4 inline-block">
            <Button variant="outline">Ir a Local</Button>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-5">
          <Layers className="mb-3 size-5 text-primary" />
          <h2 className="font-medium">White-label</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Theme y login_slug salen de Yggdra (BranchThemeConfig). Landing via{" "}
            <code className="text-xs">landing-config</code>.
          </p>
          <Link href="/" className="mt-4 inline-block">
            <Button variant="ghost">Ver landing</Button>
          </Link>
        </div>
      </div>
    </AppChrome>
  );
}

export default function AdminPage() {
  return (
    <AuthGate mode="admin">
      <AdminContent />
    </AuthGate>
  );
}
