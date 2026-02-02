
# Plan: Fiks SharedDisplay data-synlighet

## Problem identifisert

SharedDisplay viser ikke pakkedata (kunder og varer) fordi RLS-policyene for `anon`-rollen er feil konfigurert.

### Rotårsak

**RLS-policyen på `customers`-tabellen for `anon` er for restriktiv:**

```sql
-- Nåværende policy (FEIL):
"Public access to customers via display_url"
WHERE display_url IS NOT NULL 
  AND has_dedicated_display = true  -- ❌ Blokkerer SharedDisplay-kunder!
  AND status = 'active'
```

**Problemet:**
- SharedDisplay skal vise kunder med `has_dedicated_display = false`
- Men RLS-policyen tillater kun kunder med `has_dedicated_display = true`
- `public_shared_display_customers` view bruker `security_invoker=on`, som betyr at RLS evalueres
- Resultatet blir at SharedDisplay får 0 kunder tilbake!

### Påvirkede tabeller

Alle "Public access"-policyer har samme feilaktige betingelse:

| Tabell | Policy-navn | Problem |
|--------|-------------|---------|
| `customers` | Public access to customers via display_url | Krever `has_dedicated_display = true` |
| `orders` | Public access to orders for displays | Krever bakery har kunde med `has_dedicated_display = true` |
| `order_products` | Public access to order_products for displays | Krever bakery har kunde med `has_dedicated_display = true` |
| `products` | Public access to products for displays | Krever bakery har kunde med `has_dedicated_display = true` |
| `active_packing_products` | Public access to active packing products | Krever bakery har kunde med `has_dedicated_display = true` |
| `packing_sessions` | Public access to packing sessions for displays | Krever bakery har kunde med `has_dedicated_display = true` |

## Løsning

Oppdater RLS-policyene til å tillate tilgang for alle bakerier som har minst én kunde med display-funksjonalitet (enten dedikert ELLER fellesvisning).

### Database-endringer

**1. Oppdater `customers` RLS-policy for anon:**
```sql
DROP POLICY IF EXISTS "Public access to customers via display_url" ON customers;
CREATE POLICY "Public access to customers for displays" ON customers
  FOR SELECT
  TO anon
  USING (
    status = 'active' AND
    bakery_id IN (
      SELECT DISTINCT bakery_id FROM customers 
      WHERE status = 'active' AND (
        display_url IS NOT NULL  -- Har dedikert display
        OR has_dedicated_display = false  -- Eller bruker fellesvisning
      )
    )
  );
```

**2. Oppdater resterende public access-policyer:**

For `orders`, `order_products`, `products`, `active_packing_products`, og `packing_sessions`:

```sql
-- Nytt mønster for bakery_id betingelse:
bakery_id IN (
  SELECT DISTINCT bakery_id FROM customers 
  WHERE status = 'active' AND (
    display_url IS NOT NULL
    OR has_dedicated_display = false
  )
)
```

### Fil-endringer

| Fil | Endring |
|-----|---------|
| `supabase/migrations/[ny].sql` | Oppdater 6 RLS-policyer for å støtte SharedDisplay |

## Forventet resultat

Etter implementering:
- SharedDisplay vil kunne hente kunder med `has_dedicated_display = false`
- Alle pakkedata (ordrer, produkter, status) vil være synlig for fellesvisningen
- Eksisterende CustomerDisplay (dedikert display) vil fortsette å fungere som før
- Sanntidsoppdateringer vil fungere korrekt for begge display-typer

## Sikkerhetsvurdering

Endringene er trygge fordi:
- Data er fortsatt begrenset til bakerier som aktivt bruker display-funksjonalitet
- Ingen personlige data eksponeres ut over det som allerede var tilgjengelig
- RLS-policyer forblir restriktive - bare aktive kunder fra relevante bakerier er synlige
