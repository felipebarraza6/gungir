"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginComplete } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { postLoginPath, useSessionStore } from "@/lib/store/session";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useSessionStore((s) => s.setSession);
  const [email, setEmail] = useState("admin@gungir.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginComplete(email.trim().toLowerCase(), password);
      setSession(res.user, res.branches ?? [], res.token);
      const next = params.get("next");
      router.replace(next || postLoginPath(res.user));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message || `Error ${err.status}`
          : "No se pudo iniciar sesión. ¿Yggdra en :8000?",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full max-w-md rounded-2xl border border-border bg-card/90 p-6 shadow-lg backdrop-blur"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-primary">Gungir</p>
      <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">Entrar</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Login Yggdra. Tras <code className="text-xs">seed_gungir</code>: admin@gungir.local /
        GungirDemo2026!
      </p>

      <label className="mt-6 block">
        <span className="mb-1 block text-xs text-muted-foreground">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          autoComplete="username"
        />
      </label>
      <label className="mt-3 block">
        <span className="mb-1 block text-xs text-muted-foreground">Contraseña</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          autoComplete="current-password"
        />
      </label>

      {error && (
        <p className="mt-3 rounded-lg bg-danger/15 px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="mt-5 w-full" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        Entrar
      </Button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Volver al cotizador
        </Link>
      </p>
    </form>
  );
}
