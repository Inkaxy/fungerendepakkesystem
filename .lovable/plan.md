
# Plan: Fiks manglende GRANT-tillatelser på Views

## Problem identifisert

SharedDisplay og CustomerDisplay sitter fast i loading-tilstand fordi viktige views mangler `GRANT SELECT`-tillatelser til `anon`-rollen.

### Rotårsak

Migrasjonen `20260126083142` oppdaterte tre views ved å:
1. `DROP VIEW IF EXISTS public_display_orders`
2. `CREATE VIEW public_display_orders AS ...`
3. (men glemte GRANT!)

Den originale migrasjonen `20251015073829` hadde:
```sql
GRANT SELECT ON public_display_orders TO anon, authenticated;
GRANT SELECT ON public_display_order_products TO anon, authenticated;
GRANT SELECT ON public_display_products TO anon, authenticated;
```

Men når viewene ble re-opprettet, ble disse tillatelsene ikke gjenopprettet.

### Påvirkede views

| View | Status |
|------|--------|
| `public_display_orders` | Mangler GRANT til anon |
| `public_display_order_products` | Mangler GRANT til anon |
| `public_display_products` | Mangler GRANT til anon |
| `public_shared_display_customers` | Har `security_invoker=on` - RLS evalueres, men burde fungere nå |

## Løsning

### Database-migrasjon

Opprette en ny migrasjon som legger til manglende GRANT-tillatelser:

```sql
-- Fiks manglende GRANT på public display views
-- Disse ble fjernet ved re-opprettelse i 20260126083142

GRANT SELECT ON public_display_orders TO anon, authenticated;
GRANT SELECT ON public_display_order_products TO anon, authenticated;
GRANT SELECT ON public_display_products TO anon, authenticated;

-- Verifiser at shared display customers view også har tilgang
GRANT SELECT ON public_shared_display_customers TO anon, authenticated;
```

### Fil-endringer

| Fil | Endring |
|-----|---------|
| `supabase/migrations/[ny].sql` | Legg til GRANT SELECT på 4 views |

## Forventet resultat

Etter implementering:
- SharedDisplay (`/s/cf3819`) vil vise kunder og pakkedata
- CustomerDisplay (`/d/aa430a04`) vil vise produkter og status
- Sanntidsoppdateringer via WebSocket vil fungere
- Begge display-typer vil ikke lenger sitte fast i loading-tilstand

## Teknisk bakgrunn

PostgreSQL views arver ikke automatisk tillatelser når de re-opprettes. Hver gang en view droppes og opprettes på nytt, må GRANT-statements kjøres på nytt for å gi tilgang til de nødvendige rollene.
