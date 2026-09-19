"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore, postLoginPath } from "@/lib/store/session";
import { getToken } from "@/lib/api/client";

type Mode = "staff" | "client" | "admin";

export function AuthGate({
  mode,
  children,
}: {
  mode: Mode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const hydrated = useSessionStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hydrated) return;
    const token = getToken();
    if (!token || !user) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (mode === "client" && !user.is_client && !user.is_staff && !user.is_superuser) {
      // staff que entra a cuenta: permitir ver (útil en demo) o redirigir
      return;
    }
    if (mode === "staff" && user.is_client && !user.is_staff && !user.is_superuser) {
      router.replace(postLoginPath(user));
      return;
    }
    if (
      mode === "admin" &&
      !user.is_organization_owner &&
      !user.is_superuser &&
      !user.is_staff
    ) {
      router.replace(postLoginPath(user));
    }
  }, [hydrated, user, mode, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground">
        Cargando sesión…
      </div>
    );
  }

  if (!getToken() || !user) return null;
  return <>{children}</>;
}
