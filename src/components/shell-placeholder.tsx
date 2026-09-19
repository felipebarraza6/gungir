import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  surface: "cuenta" | "local" | "admin" | "super" | "login";
  description: string;
  pendingNote?: string;
};

export function ShellPlaceholder({ title, surface, description, pendingNote }: Props) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-16">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-primary">
        Gungir · {surface}
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-muted-foreground">{description}</p>
      {pendingNote && (
        <p className="mt-4 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          {pendingNote}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/">
          <Button variant="outline">Volver al cotizador</Button>
        </Link>
        {surface !== "cuenta" && (
          <Link href="/cuenta">
            <Button variant="ghost">Mi cuenta</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
