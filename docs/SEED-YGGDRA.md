# Seed — Org + Branch Gungir (oro)

Gungir **no** tiene backend propio. En Yggdra (`yggdra_infra`):

```bash
python manage.py seed_gungir
python manage.py seed_gungir --org "Casa de Oro" --slug casa-oro \
  --admin-email admin@casaoro.cl --admin-password '…'
```

Crea/actualiza:

1. **Organization** + owner  
2. **PlanGroup** `gungir` (landing SaaS)  
3. **Branch** del local  
4. **BranchThemeConfig** con `login_slug`, primary `#d4a017`, `config_json.metal_buy`  
5. **BranchUser** OWNER  

Front:

```env
NEXT_PUBLIC_GUNGIR_BRANCH_SLUG=casa-oro
```

Endpoints públicos (ya en Yggdra):

- `POST /api/public/quote-preview/`
- `POST /api/public/quotes/`
- `GET /api/public/landing-config/?slug=casa-oro` o `?group=gungir`

Pendiente: Super Admin de orgs/planes (`ALCANCES.md` §5) y scope de cotis del cliente (§4.2).
