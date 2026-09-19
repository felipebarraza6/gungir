import { ShellPlaceholder } from "@/components/shell-placeholder";

export default function LocalPage() {
  return (
    <ShellPlaceholder
      title="Local"
      surface="local"
      description="Operación de la sucursal: cola de cotis, caja, precio del día e inventario de metal."
      pendingNote="Shell del prototipo. La cola conecta a /api/sales/quotations/ con X-Branch-ID."
    />
  );
}
