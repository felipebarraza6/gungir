# Gungir

Comercio general sobre **Yggdra** (sin gastronomía). Tres superficies: **Public**, **Local**, **Admin**. Prototipo: landing + cotizador de compra de oro por Branch.

**Repo público:** https://github.com/felipebarraza6/gungir

Alcances, gaps de backend y Super Admin pendiente: [`docs/ALCANCES.md`](docs/ALCANCES.md).

## Clonar / migrar

```bash
git clone https://github.com/felipebarraza6/gungir.git
cd gungir
bun install   # o npm install
```

## Desarrollo

```bash
# Yggdra en :8000 (yggdra_infra docker-compose.light)
bun run dev   # http://localhost:3000
```

Seed de la Branch oro (en Yggdra):

```bash
python manage.py seed_gungir --slug casa-oro --admin-email admin@gungir.local
```

Variables:

```env
NEXT_PUBLIC_YGGDRA_API_BASE=http://localhost:8000/api
NEXT_PUBLIC_GUNGIR_GROUP=gungir
NEXT_PUBLIC_GUNGIR_BRANCH_SLUG=casa-oro
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
