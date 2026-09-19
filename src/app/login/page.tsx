import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.12),transparent_50%)]" />
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Cargando login…</div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
