
# Plan: Fiks SharedDisplay som viser alle produkter i stedet for kun valgte

## Problem
SharedDisplay viser alle produkter for hver kunde i stedet for kun de 3 produktene som er valgt for pakking. Når ingen produkter er valgt, skal ikke produktlisten vises i det hele tatt.

## Rotårsak
I `usePublicAllCustomersPackingData` (linje 467-617 i `usePublicDisplayData.ts`):

1. Queryets `enabled`-betingelse (linje 610) sjekker IKKE om `activeProducts` er lastet:
   ```typescript
   enabled: !!bakeryId && !!customerIds?.length && customerIds.length > 0,
   ```

2. Når queryet kjører før `activeProducts` er ferdig lastet, er `activeProducts = undefined`

3. Filtreringslogikken på linje 547-555:
   ```typescript
   if (activeProducts !== undefined) {  // FALSE når undefined!
     if (activeProducts.length === 0) return;
     activeProduct = activeProducts.find(...);
     if (!activeProduct) return;
   }
   ```
   Denne if-blokken hoppes OVER når `activeProducts === undefined`, så ALLE produkter inkluderes

## Løsning
Modifiser `usePublicAllCustomersPackingData` for å:

1. Ikke returnere produkter i det hele tatt når `activeProducts` er `undefined` (venter på data) eller tom array
2. Legge til `activeProducts` i `enabled`-betingelsen slik at queryet ikke kjører før produktfilter er klart

### Endringer i koden

#### Fil: `src/hooks/usePublicDisplayData.ts`

**Endring 1 - Legg til enabled-sjekk (linje 610):**
```typescript
// FØR:
enabled: !!bakeryId && !!customerIds?.length && customerIds.length > 0,

// ETTER:
enabled: !!bakeryId && !!customerIds?.length && customerIds.length > 0 && activeProducts !== undefined,
```

**Endring 2 - Forenkle filtrering (linje 544-555):**
```typescript
// FØR:
if (activeProducts !== undefined) {
  if (activeProducts.length === 0) return;
  
  activeProduct = activeProducts.find(ap => 
    ap.product_id === op.product_id || ap.product_name === product.name
  );
  if (!activeProduct) return;
}

// ETTER:
// Queryet kjører kun når activeProducts !== undefined (se enabled)
// Hvis tom array -> vis ingen produkter i listen
if (!activeProducts || activeProducts.length === 0) return;

activeProduct = activeProducts.find(ap => 
  ap.product_id === op.product_id || ap.product_name === product.name
);
if (!activeProduct) return;
```

## Forventet oppførsel etter fix

| Scenario | Resultat |
|----------|----------|
| `activeProducts === undefined` | Query venter (loading state) |
| `activeProducts === []` (tom) | Ingen produkter i produktlisten |
| `activeProducts = [3 produkter]` | Kun de 3 valgte produktene vises |

## Fil som endres

| Fil | Linjer | Endring |
|-----|--------|---------|
| `src/hooks/usePublicDisplayData.ts` | 544-555, 610 | Fikser filtreringslogikk og enabled-betingelse |

## Konsekvenser

- SharedDisplay viser kun valgte produkter
- Når ingen produkter er valgt, vises en tom produktliste med melding "Ingen produkter valgt for pakking"
- Ingen regresjoner på CustomerDisplay (som allerede bruker samme logikk via `usePublicPackingData`)
