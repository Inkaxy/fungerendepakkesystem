

# Plan: Fjern tomme rom i SharedDisplay med dynamisk auto-fit

## Problemanalyse

Når produkter velges for pakking, viser SharedDisplay nå korrekt kun de valgte produktene. Men griden blir beregnet basert på **alle kunder** i `sortedCustomers`-listen, mens `OptimizedCustomerCard` returnerer `null` for kunder som ikke har matchende produkter. Dette skaper "hull" i rutenettet.

**Konkret årsak:**

```text
┌─────────────────────────────────────────────────────────────────┐
│ SharedDisplay.tsx                                               │
│                                                                 │
│   sortedCustomers = [A, B, C, D, E, F, G, H, I]  (9 kunder)    │
│                          ↓                                      │
│   AutoFitGrid(customerCount: 9) → 3x3 grid                     │
│                          ↓                                      │
│   OptimizedCustomerCard rendrer:                                │
│     - A: har produkter → vises                                  │
│     - B: ingen produkter → return null (TOM CELLE)             │
│     - C: har produkter → vises                                  │
│     - D: ingen produkter → return null (TOM CELLE)             │
│     - ...                                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Løsning

Flytt filtreringen **før** griden settes opp. Kun kunder som faktisk har synlige produkter (eller har ordrer men ingen valgte produkter) skal telles som "active customers".

### Overordnet endringsstrategi

1. **Pre-filter kunder i SharedDisplay** basert på `packingDataMap` før de sendes til `AutoFitGrid`
2. **Fjern `return null`-logikk** i `OptimizedCustomerCard` for produktfiltrering (behold kun for completed/hide)
3. **Vis "Ingen produkter valgt"-tekst** når en kunde har ordrer men ingen matchende produkter

---

## Tekniske endringer

### Fil 1: `src/pages/display/SharedDisplay.tsx`

**Endring:** Pre-filter `sortedCustomers` til kun de som har data i `packingDataMap`

**Før (linje 385-405):**
```tsx
{sortedCustomers.map((customer) => (
  <OptimizedCustomerCard
    key={customer.id}
    customer={customer}
    packingData={packingDataMap.get(customer.id)}
    ...
  />
))}
```

**Etter:**
```tsx
// Beregn synlige kunder basert på packingData
const visibleCustomers = useMemo(() => {
  return sortedCustomers.filter(c => {
    const data = packingDataMap.get(c.id);
    // Vis kunder som har ordrer (total_line_items_all > 0)
    return data && data.total_line_items_all > 0;
  });
}, [sortedCustomers, packingDataMap]);

// Bruk visibleCustomers.length for grid-beregning
<AutoFitGrid customerCount={visibleCustomers.length} settings={effectiveSettings}>
  {visibleCustomers.map((customer) => (
    <OptimizedCustomerCard
      key={customer.id}
      customer={customer}
      packingData={packingDataMap.get(customer.id)}
      ...
    />
  ))}
</AutoFitGrid>
```

---

### Fil 2: `src/components/display/shared/OptimizedCustomerCard.tsx`

**Endring:** Fjern `return null` for kunder uten ordrer (dette håndteres nå i SharedDisplay)

**Før (linje 60-63):**
```tsx
// Kunden har ingen ordrer - ikke vis
if (!hasOrdersForDate) {
  return null;
}
```

**Etter:**
```tsx
// Kunden har ingen ordrer - vis kort med melding
// (Filtrering skjer nå i SharedDisplay)
```

Behold `hideWhenCompleted`-logikken som den er.

---

### Fil 3: `src/components/display/shared/CustomerPackingCard.tsx`

**Endring:** Håndter tom produktliste også i kompakt tabell-modus

**Legg til i kompakt modus (ca. linje 195-240):**
```tsx
{settings?.shared_compact_table_mode ? (
  <div className="flex-1 overflow-hidden" style={{ ... }}>
    {displayProducts.length === 0 ? (
      // ✅ NY: Tom-state for kompakt modus
      <div 
        className="flex items-center justify-center h-full opacity-60"
        style={{ 
          color: settings?.text_color || '#6b7280',
          fontSize: `${Math.max(9, 11 * scaleFactor)}px`
        }}
      >
        Ingen produkter valgt
      </div>
    ) : (
      displayProducts.map((product, idx) => { ... })
    )}
  </div>
) : ( ... )}
```

---

## Forventet resultat

| Scenario | Før | Etter |
|----------|-----|-------|
| 9 kunder, 4 med valgte produkter | 3×3 grid med 5 tomme hull | 2×2 grid med 4 synlige kort |
| Kunde med ordrer men ingen valgte produkter | Tomt kort (i hull) | Kort med "Ingen produkter valgt"-tekst |
| Ingen produkter valgt globalt | Tom skjerm med hull | Kort for hver kunde med ordrer, alle viser "Ingen produkter valgt" |

---

## Filer som endres

| Fil | Type | Beskrivelse |
|-----|------|-------------|
| `src/pages/display/SharedDisplay.tsx` | Modifisering | Pre-filter kunder før grid-rendering |
| `src/components/display/shared/OptimizedCustomerCard.tsx` | Modifisering | Fjern `return null` for ingen ordrer |
| `src/components/display/shared/CustomerPackingCard.tsx` | Modifisering | Legg til tom-state i kompakt modus |

---

## Konsekvenser

- **Auto-fit grid** vil alltid ha riktig antall celler basert på faktisk synlige kunder
- **Ingen tomme hull** i rutenettet
- **Dynamisk tilpasning** når kunder legges til/fjernes
- **Meldinger** vises tydelig når en kunde ikke har matchende produkter

