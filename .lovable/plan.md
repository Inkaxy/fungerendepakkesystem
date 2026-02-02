
# Plan: Legg til "Tving Polling"-innstilling for Smart-TV-er

## Bakgrunn

Displayet har i dag et **WebSocket-primært** oppdateringssystem som kun aktiverer polling som fallback når `connectionStatus !== 'connected'`. Smart-TV-nettlesere rapporterer ofte "connected"-status selv om de ikke mottar sanntidsmeldinger, noe som gjør at fallback-polling aldri utløses. Dette forårsaker at TV-er ikke oppdateres selv om PC-er med samme URL fungerer fint.

## Løsning

Legge til et nytt databasefelt `force_polling` (boolean) som, når aktivert, kjører automatisk polling hvert 5. sekund **uansett WebSocket-status**. Dette overstyrer den smarte fallback-logikken og sikrer pålitelig oppdatering på enheter med ustabile sanntidsforbindelser.

---

## Tekniske endringer

### 1. Database-migrasjon
Legge til nytt felt i `display_settings`-tabellen:

```sql
ALTER TABLE display_settings
ADD COLUMN IF NOT EXISTS force_polling BOOLEAN DEFAULT FALSE;
```

### 2. TypeScript-typer (`src/hooks/useDisplaySettings.ts`)
Utvide `DisplaySettings`-interface med:

```typescript
force_polling?: boolean;
```

### 3. Default-verdier (`src/utils/displaySettingsDefaults.ts`)
Legge til i defaults:

```typescript
force_polling: false,
```

### 4. Settings UI (`src/components/display-settings/sections/SharedRealtimeSection.tsx`)
Legge til ny ToggleSetting øverst i "Oppdatering & Synlighet"-seksjonen:

```tsx
<ToggleSetting
  id="force_polling"
  label="Tving polling (for Smart-TV)"
  description="Alltid oppdater hvert 5. sekund, selv med aktiv WebSocket-tilkobling"
  checked={settings.force_polling ?? false}
  onCheckedChange={(checked) => onUpdate({ force_polling: checked })}
/>
```

### 5. Display-komponenter
Modifisere polling-logikken i både `SharedDisplay.tsx` og `CustomerDisplay.tsx`:

**Før (linje ~113-145 i SharedDisplay):**
```typescript
if (isDemo || !bakeryId || connectionStatus === 'connected') return;
```

**Etter:**
```typescript
const shouldPoll = (effectiveSettings?.force_polling === true) || connectionStatus !== 'connected';
if (isDemo || !bakeryId || !shouldPoll) return;
```

Dette sikrer at polling aktiveres hvis:
- `force_polling` er aktivert i innstillinger, ELLER
- WebSocket er disconnected (eksisterende fallback-logikk)

### 6. CustomerDisplay.tsx
Tilsvarende endring i linje ~186-219:

```typescript
const shouldPoll = (settings?.force_polling === true) || connectionStatus !== 'connected';
if (isDemo || !bakeryId || !shouldPoll) return;
```

---

## Fil-oppsummering

| Fil | Endring |
|-----|---------|
| `supabase/migrations/[ny].sql` | Ny kolonne `force_polling` |
| `src/integrations/supabase/types.ts` | Oppdatert automatisk |
| `src/hooks/useDisplaySettings.ts` | Ny property i interface |
| `src/utils/displaySettingsDefaults.ts` | Default: `false` |
| `src/components/display-settings/sections/SharedRealtimeSection.tsx` | Ny toggle UI |
| `src/pages/display/SharedDisplay.tsx` | Polling-logikk sjekker `force_polling` |
| `src/pages/display/CustomerDisplay.tsx` | Polling-logikk sjekker `force_polling` |

---

## Brukeropplevelse

Etter implementering vil brukere kunne:

1. Gå til **Skjermvisning Innstillinger** → **Delt visning** → **Oppdatering & Synlighet**
2. Slå på **"Tving polling (for Smart-TV)"**
3. Lagre endringene
4. TV-en vil nå oppdatere hvert 5. sekund automatisk

En informasjonstekst vil forklare at dette er spesielt nyttig for Smart-TV-er med ustabile WebSocket-forbindelser.
