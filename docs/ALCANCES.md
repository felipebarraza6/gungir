# Gungir — Alcances (Yggdra 100%)

**Gungir** es comercio general sobre Yggdra: catálogo, cotizaciones, clientes, inventario, finanzas y BI. Sin gastronomía. El prototipo visible es un **negocio que compra oro** (landing + cotizador por Branch).

Nombre: **Gungir** (más fácil de buscar que Gungnir).

---

## 1. Principio

| Qué | Dónde |
|---|---|
| Datos, auth, planes, módulos, branding, cotis, clientes | **Yggdra** (`yggdra_infra`) |
| UI Public / Local / Admin | Repo `gungir/` (Next.js estático) |
| Backend propio de Gungir | **No existe** |

Gungir = **Organization + Branch** en Yggdra. El front es la piel. `X-Branch-ID` / `Host` aíslan el tenant.

---

## 2. Tres superficies

| Superficie | Quién | Rutas | Estado |
|---|---|---|---|
| **Public** | Visitante + cliente final | `/`, `/cuenta` | Prototipo: landing + cotizador. Autogestión `/cuenta` en curso |
| **Local** | Staff de la sucursal | `/local` | Shell; cola de cotis / caja en siguientes PRs |
| **Admin** | Dueño de la org | `/admin` | Shell; config de sucursal / theme |
| **Super Admin** | Operador de plataforma (vos) | `/super` o app dedicada | **PENDIENTE** (ver §5) |

El cliente se **autogestiona** en `/cuenta` (sus cotis, PDF, estado). No ve ERP.

---

## 3. Alcance del prototipo (oro)

Listo para construir / en este repo:

1. Crear en Yggdra una **Organization** + **Branch** (negocio compra-oro).
2. Landing white-label resuelta por Branch (`Host` o `?slug=` / `landing-config`).
3. Cotizador público: metal → ley → peso → oferta CLP.
4. Envío de cotización hacia Yggdra cuando existan los endpoints públicos (§4).
5. Shells `/local`, `/admin`, `/cuenta` con guards de rol.

Fuera del prototipo:

- Ecommerce / carrito.
- KDS, mesas, recetas, nutrición (nunca).
- Super Admin de todas las orgs (pendiente explícito).
- BI completo (después de que cotis + caja vivan).

---

## 4. Gaps de backend (mejoras Yggdra para un mejor producto)

Hoy el front puede cotizar en cliente con fallback. Para el producto serio hace falta esto en **Yggdra** (no en Gungir):

### 4.1 Crítico para el cotizador público

| Gap | Estado |
|---|---|
| `POST /api/public/quote-preview/` | **Implementado** en `yggdra_infra` (`sales.views.public_quotes`) |
| `POST /api/public/quotes/` | **Implementado** — crea Client + `Order(is_quotation=True)` |
| Seed Org+Branch | `python manage.py seed_gungir` |
| Vigencia / snapshot | En `observation` + `expires_at` en la respuesta; campos dedicados = mejora futura |

### 4.2 Autogestión del cliente

| Gap | Hoy | Ideal |
|---|---|---|
| Ficha del cliente | `GET /api/customers/clients/me/` existe | OK |
| Listar **mis** cotis | Quotations son staff-scope | Si `user.is_client`, filtrar `client.user == request.user` en list/retrieve/PDF |
| Magic-link post-coti | Checkout magic-login existe para planes | Reutilizar o endpoint ligero para invitar al cliente a `/cuenta` |

### 4.3 Motor de precio (compra de metal)

| Gap | Hoy | Ideal |
|---|---|---|
| Precio ref diario | Productos / currencies genéricos | Config por Branch: `metal_buy_rate` (CLP/g) + `spread` + tabla de leyes; o productos unidad gramo + precio actualizado |
| Spot externo | No | v1.1 vía `ExternalAPI` (Muninn); v1 = precio manual en Local/Admin |

### 4.4 Landing por Branch (prototipo OK)

| Capacidad | Estado |
|---|---|
| `GET /api/public/landing-config/` | Existe (group / slug / Host) |
| Theme by-host | Existe |
| Una Branch con dominio/slug arma su landing | **Suficiente para el prototipo oro** |

Si el copy del cotizador (textos de metal, CTAs) no cabe en `landing-config.content`, extender el JSON de content o campos dinámicos de Branch — no hardcodear por cliente en el front.

### 4.5 Deseable (no bloquea prototipo)

- KPIs de embudo cotizador en `/api/analytics/dashboard/…`
- Upload de foto del metal en la coti pública (documents / media)
- Notificación mail/WhatsApp al staff Local al llegar una coti
- Order type / flag explícito de **compra** (buyback) vs venta, si el dominio lo exige

---

## 5. Super Admin — PENDIENTE

Objetivo: gestionar al **100%** las Organizations, sus planes, qué módulos pueden activar y qué no. Tu app como operador de plataforma.

| Capacidad | Notas |
|---|---|
| Listar / crear / suspender Organizations | Ya hay piezas en Yggdra (`organizations`, `branches`) |
| Asignar / cambiar plan por org | `PlanGroup` + `BranchModulePlan` / planes por org |
| Encender / apagar módulos por plan o por Branch | Contrato de módulos existente |
| White-label global por org | Theme / dominio |
| Ver uso (sucursales, usuarios, cotis) | Analytics + audit |

**No entra en el prototipo oro.** Cuando toque: superficie `/super` en Gungir **o** reutilizar pantallas de org/planes de Frig/Muninn contra los mismos endpoints. Priorizar **no duplicar** lógica: el back ya tiene orgs y planes; falta la UI de plataforma unificada.

Hasta que exista Super Admin, las orgs/planes del prototipo se siembran / configuran por management command o Django admin / scripts en Yggdra.

---

## 6. Stack front (alineado a Frig)

Next.js 16 (`output: "export"`) · React 19 · TypeScript · Tailwind v4 · Framer Motion · TanStack Query · Zustand · API Yggdra.

Identidad: carbón + acento oro. Misma lógica de motion que Frig, otra piel.

---

## 7. Criterio de listo del prototipo

- [ ] Org + Branch oro en Yggdra
- [ ] Landing Public con cotizador usable (fallback local si falta API pública)
- [ ] Envío de coti a Yggdra cuando §4.1 esté
- [ ] `/cuenta` muestra cotis del cliente cuando §4.2 esté
- [ ] `/local` y `/admin` shells navegables
- [ ] Super Admin documentado como pendiente (este doc)
- [ ] Cero módulos gastronómicos en menú

---

## 8. Orden sugerido de trabajo

1. Seed Org + Branch + catálogo metales en Yggdra  
2. Landing + cotizador (este repo)  
3. Endpoints públicos de quote (§4.1) en Yggdra  
4. Autogestión `/cuenta` (§4.2)  
5. Local: cola + caja  
6. Admin org (sin Super Admin aún)  
7. **Super Admin** (pendiente de producto)  
8. BI / intelligence  

Última actualización: 2026-09-19
