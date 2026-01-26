
# Plan: Fiks "Noe gikk galt" feil på kunde-display

## Problem
Når CustomerDisplay lastes, kan `activeProducts` være `undefined` fordi det hentes asynkront. I `usePublicPackingData`-hooken (linje 217-220) aksesseres `activeProducts.length` og `activeProducts.map()` uten null-sjekk, noe som forårsaker en `TypeError`.

## Feil-lokasjon

```typescript
// src/hooks/usePublicDisplayData.ts - linje 213-221
console.log('🔍 Fetching public packing data:', {
  customerId,
  bakeryId,
  targetDate,
  activeProductsCount: activeProducts.length,  // ❌ FEIL: undefined.length
  activeProductDetails: activeProducts.map(ap => ({  // ❌ FEIL: undefined.map()
    id: ap.product_id,
    name: ap.product_name
  }))
});
```

## Løsning
Legg til optional chaining (`?.`) og nullish coalescing (`??`) for sikker aksessering:

```typescript
console.log('🔍 Fetching public packing data:', {
  customerId,
  bakeryId,
  targetDate,
  activeProductsCount: activeProducts?.length ?? 0,  // ✅ Sikker
  activeProductDetails: activeProducts?.map(ap => ({  // ✅ Sikker
    id: ap.product_id,
    name: ap.product_name
  })) ?? []
});
```

## Fil som endres

| Fil | Endring |
|-----|---------|
| `src/hooks/usePublicDisplayData.ts` | Legg til optional chaining på linje 217-221 |

## Teknisk Detalj
Feilen oppstår fordi:
1. CustomerDisplay henter `activeProducts` via `usePublicActivePackingProducts`
2. Mens `activeProducts` hentes, er verdien `undefined`
3. `usePublicPackingData` kalles med `activeProducts` som parameter
4. Inne i queryFn-funksjonen aksesseres `activeProducts` direkte i console.log
5. `undefined.length` kaster TypeError
6. ErrorBoundary fanger feilen og viser "Noe gikk galt"

## Forventet resultat
Etter denne fiksen vil CustomerDisplay laste korrekt uten å kaste feil når `activeProducts` er midlertidig `undefined`.
