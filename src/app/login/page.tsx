import { ShellPlaceholder } from "@/components/shell-placeholder";

export default function LoginPage() {
  return (
    <ShellPlaceholder
      title="Entrar"
      surface="login"
      description="Login Yggdra (Token). Clientes van a /cuenta; staff a /local o /admin según rol."
      pendingNote="Se cablea a /api/accounts/ login_complete como en Frig."
    />
  );
}
