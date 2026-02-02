
# Plan: Fiks WebSocket CHANNEL_ERROR

## Problem identifisert

WebSocket-tilkoblingen feiler med `CHANNEL_ERROR` av to hovedårsaker:

### 1. **Manglende public RLS-policy for `packing_sessions`**
Andre tabeller som `display_settings`, `active_packing_products`, og `order_products` har en **"Public access"** RLS-policy som tillater lesing fra offentlige displays:

```sql
-- Eksisterende policy på display_settings:
"Public access to display settings" 
WHERE bakery_id IN (SELECT DISTINCT bakery_id FROM customers WHERE display_url IS NOT NULL ...)
```

Men `packing_sessions`-tabellen **mangler denne policyen**. Når en offentlig display (uten autentisering) forsøker å lytte på `postgres_changes` for `packing_sessions`, blokkeres WebSocket-tilkoblingen av RLS, noe som gir `CHANNEL_ERROR`.

### 2. **Broadcast-kanaler krever ikke RLS, men mislykkes pga. relaterte queries**
`useDisplayRefreshBroadcast` og `usePackingBroadcastListener` bruker Supabase Broadcast (ikke postgres_changes), som teoretisk ikke krever RLS. Men disse kanalene feiler fordi:
- Supabase-klienten opplever ustabil tilkobling når andre kanaler på samme connection feiler
- Error-propagering mellom kanaler i samme WebSocket-tilkobling

## Løsning

### Database-endringer

Legge til en public SELECT-policy for `packing_sessions`:

```sql
CREATE POLICY "Public access to packing sessions for displays" 
ON packing_sessions 
FOR SELECT 
USING (
  bakery_id IN (
    SELECT DISTINCT bakery_id 
    FROM customers 
    WHERE display_url IS NOT NULL 
      AND has_dedicated_display = true 
      AND status = 'active'
  )
);
```

### Kodeendringer

Forbedre reconnect-logikken i `useRealTimePublicDisplay.ts`:

1. **Øke retry-logikk synlighet** - Legge til `TIMED_OUT` håndtering
2. **Bedre feilmeldinger** - Logge spesifikk feilårsak
3. **Graceful degradation** - Automatisk fallback til polling ved vedvarende feil

```typescript
// useRealTimePublicDisplay.ts - subscribe callback
.subscribe((status, error) => {
  if (status === 'SUBSCRIBED') {
    setConnectionStatus('connected');
    setRetryCount(0);
  } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
    console.error('❌ WebSocket error:', error?.message || status);
    setConnectionStatus('disconnected');
  }
});
```

## Fil-endringer

| Fil | Endring |
|-----|---------|
| `supabase/migrations/[ny].sql` | Ny public RLS-policy for `packing_sessions` |
| `src/hooks/useRealTimePublicDisplay.ts` | Bedre feilhåndtering og logging av `TIMED_OUT` |

## Forventet resultat

Etter implementering:
- WebSocket-tilkoblingen vil ikke lenger blokkeres av RLS
- Offentlige displays vil kunne motta sanntidsoppdateringer for alle relevante tabeller
- `CHANNEL_ERROR` vil kun oppstå ved reelle nettverksproblemer (ikke RLS-blokkeringer)
- Fallback-polling (5s når `force_polling` er aktivert) fortsetter å fungere som backup

## Tekniske detaljer

Supabase Realtime med `postgres_changes` krever at brukeren har SELECT-tilgang til tabellen via RLS. Når en anonym bruker (offentlig display) abonnerer på endringer i en tabell uten public policy, returnerer Supabase en `CHANNEL_ERROR` fordi den ikke kan etablere change-feed.

Ved å legge til den manglende policyen for `packing_sessions` (med samme mønster som de andre tabellene), vil WebSocket-tilkoblingen kunne etableres korrekt.
