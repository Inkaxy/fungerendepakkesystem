
# Plan: Bruk kort `short_id` for felles display-URL

## Problemanalyse

Nåværende URL:
```
https://loafandload.com/s/13dfc88b-76a0-485e-8ca7-e2ecb1155d11
```

Databasen har allerede `short_id` for hvert bakeri:
| Bakeri | UUID | short_id |
|--------|------|----------|
| Nøtterø Bakeri | `13dfc88b-76a0-485e-8ca7-e2ecb1155d11` | `cf3819` |

Ønsket URL:
```
https://loafandload.com/s/cf3819
```

---

## Løsning

### 1. SharedDisplay: Oppløs short_id til bakery_id

SharedDisplay mottar `shortId` fra URL, men alle database-hooks forventer full UUID (`bakery_id`). 

**Løsning**: Kall `get_bakery_id_from_short_id()` funksjonen for å oppløse korte IDer til fulle UUIDs.

**Fil: `src/pages/display/SharedDisplay.tsx`**
- Legg til en hook som oppløser `shortId` til `bakeryId`
- Støtt bakoverkompatibilitet: Hvis `shortId` er en UUID (36 tegn), bruk direkte

### 2. DisplayManagementCard: Bruk short_id i URL

**Fil: `src/components/customers/DisplayManagementCard.tsx`**
- Hent `short_id` fra bakeriet via en ny query
- Generer URL med `short_id` i stedet for full UUID

### 3. Oppdater UserProfile med short_id

**Fil: `src/stores/authStore.ts`**
- Inkluder `bakeries.short_id` i profil-fetchen
- Legg til `bakery_short_id` i `UserProfile` interface

### 4. Oppdater forhåndsvisnings-komponenter

**Filer:**
- `src/components/display-settings/DisplayPreview.tsx`
- `src/components/display-settings/DisplayPreviewPanel.tsx`

Bruk `bakery_short_id` fra profilen i stedet for `bakery_id`.

---

## Tekniske detaljer

### Ny hook: useResolveBakeryId

```typescript
// Oppløser short_id til bakery_id
// Returnerer input uendret hvis det allerede er en UUID
const useResolveBakeryId = (shortId?: string) => {
  return useQuery({
    queryKey: ['resolve-bakery-id', shortId],
    queryFn: async () => {
      if (!shortId) return null;
      
      // Hvis det allerede er en UUID, returner direkte
      if (shortId.length === 36 && shortId.includes('-')) {
        return shortId;
      }
      
      // Ellers oppløs via database-funksjon
      const { data } = await supabase
        .rpc('get_bakery_id_from_short_id', { short_id_param: shortId });
      
      return data;
    },
    enabled: !!shortId,
  });
};
```

### Oppdatert UserProfile interface

```typescript
interface UserProfile {
  // ... eksisterende felt
  bakery_short_id: string | null; // NY
}
```

### Legacy redirect oppdatering

**Fil: `src/components/routing/LegacyRedirects.tsx`**
- `LegacySharedRedirect` trenger å konvertere full UUID til `short_id` for korrekt redirect

---

## Filer som endres

| Fil | Endring |
|-----|---------|
| `src/pages/display/SharedDisplay.tsx` | Oppløs short_id til bakery_id |
| `src/components/customers/DisplayManagementCard.tsx` | Bruk short_id i URL |
| `src/stores/authStore.ts` | Legg til bakery_short_id i profil |
| `src/components/display-settings/DisplayPreview.tsx` | Bruk short_id |
| `src/components/display-settings/DisplayPreviewPanel.tsx` | Bruk short_id |
| `src/components/routing/LegacyRedirects.tsx` | Håndter UUID til short_id redirect |
| `src/hooks/usePublicDisplayData.ts` | Ny hook for short_id oppløsning |

---

## Resultat

| Før | Etter |
|-----|-------|
| `/s/13dfc88b-76a0-485e-8ca7-e2ecb1155d11` | `/s/cf3819` |

Totalt spart: **30 tegn** - mye enklere å dele og scanne via QR.
