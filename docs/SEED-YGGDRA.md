# Seed sugerido — Org + Branch Gungir (oro)

Gungir **no** tiene backend propio. En Yggdra:

1. Crear **Organization** `Gungir` (o el nombre del negocio de compra de oro).
2. Crear **Branch** (sucursal) del local, con:
   - `login_slug` (ej. `casa-oro`)
   - theme (primary oro `#d4a017`, dark)
   - dominio custom opcional
3. Asignar un **plan** sin módulos gastronómicos (`tables`, `nutrition`, `production` apagados). Encender: `dashboard`, `config`, `sales`, `product_catalog`, `customers`, `inventory`, `finance`, `analytics`.
4. Catálogo: productos metal (Au/Ag/Pt) unidad **gramo**, precios de referencia.
5. Roles: staff Local, owner Admin, clientes con `Client.user` para `/cuenta`.

`PlanGroup` slug `gungir` solo si querés `GET /api/public/landing-config/?group=gungir` con copy de landing. Para el prototipo alcanza resolver por `?slug=` o `Host` de la Branch.

Endpoints públicos de coti: ver `ALCANCES.md` §4.1 — implementar en `yggdra_infra`, no aquí.
