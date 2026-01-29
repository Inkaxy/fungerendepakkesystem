
# Plan: Fiks 404-feil for eksterne display-URLer

## Problemanalyse

Ved besøk til eksterne skjermer får du 404-feil fordi:

| Problem | Detalj |
|---------|--------|
| Gammel URL-prefix | `/display/` brukes fortsatt, men ruten er nå `/d/` |
| Gammel display_url i database | Verdier har prefiks `display-` (f.eks. `display-f902d9c2`) |
| Gamle lenker/QR-koder | Peker fortsatt til `/display/...` |

Eksempel fra feilen:
- Forsøkt URL: `/display/display-f902d9c2`
- Forventet format: `/d/f902d9c2`

---

## Løsning: To-stegs tilnærming

### Steg 1: Legg til bakoverkompatible ruter

Legg til redirects for de gamle URL-formatene slik at eksisterende QR-koder fortsetter å fungere.

**Fil: `src/App.tsx`**

Legg til redirect-ruter:
- `/display/shared/:bakeryId` → redirect til `/s/:bakeryId`
- `/display/:displayUrl` → redirect til `/d/:displayUrl`

### Steg 2: Migrer gamle display_url-verdier i databasen

Fjern `display-` prefiks fra eksisterende `display_url`-verdier i `customers`-tabellen.

**Database-migrering:**
```sql
UPDATE public.customers
SET display_url = REPLACE(display_url, 'display-', '')
WHERE display_url LIKE 'display-%';
```

---

## Tekniske endringer

### Filer som endres

| Fil | Endring |
|-----|---------|
| `src/App.tsx` | Legg til redirect-komponenter for gamle URLer |
| `src/components/routing/LegacyRedirects.tsx` | Ny komponent for håndtering av redirects |
| Database-migrering | Fjern `display-` prefiks fra eksisterende verdier |

### Ny redirect-komponent

```typescript
// LegacyDisplayRedirect.tsx
const LegacyDisplayRedirect = () => {
  const { displayUrl } = useParams();
  return <Navigate to={`/d/${displayUrl}`} replace />;
};

const LegacySharedRedirect = () => {
  const { bakeryId } = useParams();
  return <Navigate to={`/s/${bakeryId}`} replace />;
};
```

### Oppdatert App.tsx-ruter

```text
Nye redirect-ruter:
/display/shared/:bakeryId → /s/:bakeryId
/display/:displayUrl → /d/:displayUrl
```

---

## Resultat

| Scenario | Før | Etter |
|----------|-----|-------|
| Gamle QR-koder med `/display/` | 404-feil | Redirectes automatisk til `/d/` |
| Nye URLer med `/d/` | Fungerer | Fungerer |
| Databaseverdier | `display-f902d9c2` | `f902d9c2` |

Alle eksisterende QR-koder og lenker vil fortsette å fungere via automatisk redirect.
