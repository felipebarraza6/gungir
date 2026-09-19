import { ShellPlaceholder } from "@/components/shell-placeholder";

export default function CuentaPage() {
  return (
    <ShellPlaceholder
      title="Mi cuenta"
      surface="cuenta"
      description="Autogestión del cliente: tus cotizaciones, PDF y estado. Sin ver el ERP del local."
      pendingNote="Requiere scope de cotis por cliente en Yggdra (docs/ALCANCES.md §4.2). Login de cliente va después."
    />
  );
}
