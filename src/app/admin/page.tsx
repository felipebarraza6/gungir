import { ShellPlaceholder } from "@/components/shell-placeholder";

export default function AdminPage() {
  return (
    <ShellPlaceholder
      title="Admin"
      surface="admin"
      description="Dueño de la Organization: sucursales, usuarios del local, white-label y módulos del plan."
      pendingNote="No es Super Admin de plataforma. Eso es pendiente (docs/ALCANCES.md §5)."
    />
  );
}
