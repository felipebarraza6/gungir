# Gungir

## Qué es

Gungir es el cliente de comercio general sobre la API Ginnung, sin el vertical gastronómico. Hoy el producto visible es una landing y un cotizador (compra de oro) por sucursal, con superficies Public, Local y Admin. Super Admin sigue pendiente en la ruta `/super`.

## A quién sirve

Una sucursal comercial que publica oferta y recibe cotizaciones, y el equipo de esa sucursal que opera lo local y lo administrativo. El grupo de ejemplo del seed es `casa-oro`.

## Stack

Next.js 16, React 19, TypeScript, Tailwind, TanStack Query, Zustand, Framer Motion. El lockfile del repo es `bun.lock`.

## Cómo correr en local

La API Ginnung tiene que estar en el puerto 8000 si vas a cotizar de verdad.

```bash
bun install
cp .env.local.example .env.local
bun run dev
```

Next queda en http://localhost:3000.

El seed de la sucursal de oro se corre en Yggdra, no en este repo: `python manage.py seed_gungir`. Los argumentos (`--slug`, `--admin-email`) están en el `--help` del comando. No anotes contraseñas en el README.


## Variables de entorno

Solo nombres. Copia el ejemplo a un archivo local y completa los valores ahí. No los commitees ni los pegues en un issue.

Nombres de `.env.local.example`:

| Nombre | Uso |
|--------|-----|
| `NEXT_PUBLIC_YGGDRA_API_BASE` | Base de la API, con `/api` |
| `NEXT_PUBLIC_GUNGIR_GROUP` | Grupo comercial. El código usa `gungir` si no está |
| `NEXT_PUBLIC_GUNGIR_BRANCH_SLUG` | Slug de la sucursal del cotizador. Sin slug el envío no sale |

Los valores de ejemplo (API local, grupo y slug de la sucursal de demostración) están en `.env.local.example`. Copia ese archivo a `.env.local` para desarrollar. No commitees otros valores.


## Scripts

| Comando | Qué hace |
|---------|----------|
| `bun run dev` | Next en desarrollo |
| `bun run build` | Export estático (`output: "export"` en `next.config.ts`) |
| `bun run start` | Next start |
| `bun run lint` | ESLint |
| `bun run type-check` | `tsc --noEmit` |

No hay script de sync de contrato ni tests en `package.json`.


## Deploy (como está hoy)

No hay workflow de deploy. `docs/CONSUMERS.yaml` marca `deploy.how: unknown` y el estado del consumidor como activo. No hay dominio de producción registrado en ese inventario. Publicar el build es un paso fuera de este repo.


Este PR de documentación no cambia workflows, secretos ni el destino del deploy.

## Relación con la API Ginnung

Fetch manual a público, cotizaciones y cuentas. El inventario declara `/api/public/**`, `/api/sales/**` y `/api/accounts/**` (quotes y quotations). No hay tipos generados ni `contract.yml`.

Rutas del cliente:

| Prefijo | Superficie |
|---------|------------|
| `/` | Public. Landing y cotizador |
| `/cuenta` | Autogestión del cliente |
| `/local` | Operación de la sucursal |
| `/admin` | Organización |
| `/super` | Super Admin, pendiente |
| `/login` | Acceso |

El backend marca como recomendado que Gungir no tiene pantalla de reset de contraseña. Importa cuando la sucursal invita usuarios.

Id de consumidor y etiqueta de issues de backend: `front:gungir`. Alcances y huecos: [docs/ALCANCES.md](docs/ALCANCES.md).


El chequeo reutilizable está en [docs/CONTRACT_CHECK.md](https://github.com/felipebarraza6/yggdra_infra/blob/main/docs/CONTRACT_CHECK.md) y en `.github/workflows/contract-check.yml` de `yggdra_infra`. Corre en el runner del VPS, compara el `schema_sha256` de `https://api.yggdra.cl/api/schema/contract/` con el sha commiteado en el front, regenera tipos desde el freeze de `api/schema/openapi.yaml` y exige `tsc --noEmit`.

En la rama por defecto de este repo **no hay** un workflow `contract.yml` que llame ese chequeo. El inventario `docs/CONSUMERS.yaml` del backend describe el estilo de consumo de cada app.

## Enlaces

- Arquitectura: [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md)
- Alcances: [docs/ALCANCES.md](docs/ALCANCES.md)
- Seed en la API: [docs/SEED-YGGDRA.md](docs/SEED-YGGDRA.md)
- API Ginnung: https://github.com/felipebarraza6/yggdra_infra
- Chequeo de contrato: https://github.com/felipebarraza6/yggdra_infra/blob/main/docs/CONTRACT_CHECK.md
- Tarea de cotizaciones públicas en el backend: https://github.com/felipebarraza6/yggdra_infra/blob/main/docs/tasks/2026-03-26-gungir-public-quotes.md
