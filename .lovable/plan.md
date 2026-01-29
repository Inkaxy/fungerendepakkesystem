

# Plan: Forenkle Display-URLer

## Nåværende URL-struktur

| Type | Nåværende URL |
|------|---------------|
| Kunde-display | `loafandload.com/display/a1b2c3` |
| Delt display | `loafandload.com/display/shared/{bakeryId}` |

## Foreslått ny URL-struktur

| Type | Ny URL | Eksempel |
|------|--------|----------|
| Kunde-display | `loafandload.com/d/abc123` | `/d/abc123` |
| Delt display | `loafandload.com/s/{kortBakeryId}` | `/s/xyz789` |

## Endringer

### 1. Kortere route-prefix
- `/display/` → `/d/` (sparer 6 tegn)
- `/display/shared/` → `/s/` (sparer 13 tegn)

### 2. Kortere bakery-ID for delt display
Bakery-ID er nå en full UUID. Vi kan lagre en kort 6-tegns ID på bakeri-nivå.

---

## Tekniske endringer

### Filer som endres

| Fil | Endring |
|-----|---------|
| `src/App.tsx` | Oppdatere routes fra `/display/` til `/d/` og `/display/shared/` til `/s/` |
| `src/utils/displayUtils.ts` | Oppdatere alle path-funksjoner |
| `src/hooks/useCustomerActions.ts` | Ingen endring (display_url er allerede kort) |
| Database: `bakeries` | Legge til `short_id` kolonne for delt display |

### Route-endringer i App.tsx

```text
Før:
/display/shared/:bakeryId
/display/:displayUrl

Etter:
/s/:bakeryId
/d/:displayUrl
```

### Oppdatert displayUtils.ts

```typescript
// Kunde-display
return `/d/${customer.display_url}`;

// Delt display  
return `/s/${bakeryId}`;
```

---

## Resultat

| Før | Etter |
|-----|-------|
| `loafandload.com/display/a1b2c3` | `loafandload.com/d/a1b2c3` |
| `loafandload.com/display/shared/uuid...` | `loafandload.com/s/xyz789` |

Totalt spart: **~15 tegn** per URL, mye enklere for QR-koder og deling.

