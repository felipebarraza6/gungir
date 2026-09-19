# Gungir

Comercio general sobre **Yggdra** (sin gastronomía). Tres superficies: **Public**, **Local**, **Admin**. Prototipo: landing + cotizador de compra de oro por Branch.

Alcances, gaps de backend y Super Admin pendiente: [`docs/ALCANCES.md`](docs/ALCANCES.md).

## Desarrollo

```bash
# Yggdra en :8000 (yggdra_infra docker-compose.light)
bun install   # o npm install
bun run dev   # http://localhost:3000
```

Variables:

```env
NEXT_PUBLIC_YGGDRA_API_BASE=http://localhost:8000/api
NEXT_PUBLIC_GUNGIR_GROUP=gungir
NEXT_PUBLIC_GUNGIR_BRANCH_SLUG=   # opcional: login_slug de la Branch oro
```

## Scripts

| Comando | Qué hace |
|---|---|
| `bun run dev` | Dev server |
| `bun run build` | Export estático |
| `bun run type-check` | TypeScript |
| `bun run lint` | ESLint |

## Rutas

| Prefijo | Superficie |
|---|---|
| `/` | Public — landing + cotizador |
| `/cuenta` | Public — autogestión del cliente |
| `/local` | Local — operación de la sucursal |
| `/admin` | Admin — organización |
| `/super` | Super Admin — **pendiente** |
