
# Plan: Forbedret kompakt visning for SharedDisplay

## Problemanalyse

Basert på kravene dine er det flere forbedringer som må gjøres:

1. **Alle 3 valgte produkter skal ALLTID vises** - Må fjerne begrensningen som reduserer antall produkter basert på høyde
2. **Kun kunder med varer for dagen vises** - Filtrere bort kunder uten produkter/ordrer for valgt dato
3. **12 kunder på én skjerm** - Krever mer aggressiv plassutnyttelse
4. **"Pågående" status tar for mye plass** - Header-badge på hvert kort må minimeres

---

## Tekniske endringer

### 1. Sikre at alle valgte produkter ALLTID vises (DemoCustomerCard + CustomerPackingCard)

**Problem:** Dagens logikk i `maxProducts` beregner hvor mange produkter som "får plass" og kutter resten.

**Løsning:** I kompakt modus skal ALLE produkter for valgt pakkedag vises - ingen begrensning.

**Fil:** `src/components/display/shared/DemoCustomerCard.tsx`
```typescript
// I kompakt modus: Vis ALLE produkter uansett
const displayProducts = settings?.shared_compact_table_mode 
  ? customerData.products // Vis alle i kompakt modus
  : customerData.products.slice(0, maxProducts);
```

**Fil:** `src/components/display/shared/CustomerPackingCard.tsx`
```typescript
// Samme logikk
const displayProducts = settings?.shared_compact_table_mode 
  ? customerData.products
  : customerData.products.slice(0, maxProducts);
```

### 2. Filtrere bort kunder uten varer for dagen (CustomerDataLoader + SharedDisplay)

**Problem:** Kunder uten ordrer for valgt dato vises fortsatt som "Venter på produktvalg".

**Løsning:** I `CustomerDataLoader` - returner `null` når kunden ikke har data for dagen.

**Fil:** `src/components/display/shared/CustomerDataLoader.tsx`
```typescript
// Endring på linje 77-79:
// Returner null hvis kunden ikke har noen produkter for denne dagen
if (!customerData || customerData.products.length === 0) {
  return null; // Kunden har ingen varer for denne dagen - vis ikke kortet
}
```

Dette er allerede implementert! Men vi må også fjerne "Venter på produktvalg"-meldingen for at det skal fungere riktig.

### 3. Ultra-kompakt header for 12+ kunder

**Problem:** Header med status-badge og kundenavn tar for mye vertikal plass.

**Løsning:** Ny ultra-kompakt header-stil når `shared_compact_table_mode` er aktiv:

| Nåværende | Ny kompakt |
|-----------|------------|
| Badge: "Pågående" (separat linje) | Kun farge-indikator |
| Stor kundenavn | Mindre font |
| Mye padding | Minimal padding |

**Fil:** `src/components/display/shared/DemoCustomerCard.tsx`
```tsx
{/* Ultra-kompakt header i tabell-modus */}
{settings?.shared_compact_table_mode ? (
  <div className="flex items-center justify-between" style={{ padding: `${Math.max(4, 8 * scaleFactor)}px` }}>
    <h3 
      className="font-semibold flex-1 truncate"
      style={{ 
        color: settings?.text_color || '#1f2937',
        fontSize: `${Math.max(12, 14 * scaleFactor)}px`
      }}
    >
      {customerData.name}
    </h3>
    {/* Mini status-indikator (farget prikk i stedet for badge) */}
    <span 
      className="flex-shrink-0 rounded-full"
      style={{ 
        width: `${Math.max(8, 12 * scaleFactor)}px`,
        height: `${Math.max(8, 12 * scaleFactor)}px`,
        backgroundColor: isCompleted 
          ? (statusColors.completed || '#10b981') 
          : (statusColors.in_progress || '#3b82f6')
      }}
      title={isCompleted ? 'Ferdig' : 'Pågår'}
    />
  </div>
) : (
  /* Nåværende header med badge */
)}
```

### 4. Forbedret AutoFitGrid for 12 kunder

**Problem:** Dagens minimumsverdier (180px høyde, 280px bredde) er for store for 12 kort.

**Løsning:** Lavere standardverdier + mer aggressiv layout-beregning i kompakt modus:

**Fil:** `src/components/display/shared/AutoFitGrid.tsx`
```typescript
// Bruk lavere minimumsverdier i kompakt modus
const effectiveMinHeight = settings?.shared_compact_table_mode 
  ? Math.min(minCardHeight, 120) // Maks 120px i kompakt modus
  : minCardHeight;

const effectiveMinWidth = settings?.shared_compact_table_mode
  ? Math.min(minCardWidth, 200) // Maks 200px i kompakt modus
  : minCardWidth;
```

### 5. Produktrader med minimalt mellomrom

**Problem:** Produktradene i kompakt modus har fortsatt for mye padding.

**Løsning:** Enda mer kompakte rader med mindre font og padding:

**Fil:** `src/components/display/shared/DemoCustomerCard.tsx`
```tsx
<div 
  key={product.product_id}
  className="flex items-center justify-between"
  style={{
    backgroundColor: bgColor,
    padding: `${Math.max(2, 4 * scaleFactor)}px ${Math.max(4, 6 * scaleFactor)}px`,
    fontSize: `${Math.max(9, 11 * scaleFactor)}px`, // Mindre font
    borderRadius: `${Math.max(2, 4 * scaleFactor)}px`,
  }}
>
  {/* ... */}
</div>
```

### 6. Fjern "Venter på produktvalg" melding

**Problem:** Vises selv når kunden ikke har ordrer for dagen.

**Løsning:** Returner `null` direkte i stedet for placeholder.

**Fil:** `src/components/display/shared/CustomerDataLoader.tsx`
```typescript
// FJERN DENNE BLOKKEN (linje 55-72):
// if (!activeProducts || activeProducts.length === 0) {
//   return (
//     <div className="...">
//       <p>Venter på produktvalg...</p>
//     </div>
//   );
// }

// Ny logikk: Bare returner null hvis ingen aktive produkter
if (!activeProducts || activeProducts.length === 0) {
  return null;
}
```

---

## Oppsummering av filendringer

| Fil | Endring |
|-----|---------|
| `DemoCustomerCard.tsx` | Ultra-kompakt header + alle produkter i kompakt modus + mindre padding |
| `CustomerPackingCard.tsx` | Samme som DemoCustomerCard |
| `CustomerDataLoader.tsx` | Fjern "Venter på produktvalg" - returner null i stedet |
| `AutoFitGrid.tsx` | Lavere minimumsverdier i kompakt modus |

---

## Forventet resultat

Med disse endringene:

- **12 kunder på 1080p skjerm:** 4 kolonner x 3 rader med kompakte kort
- **Alle 3 produkter synlige:** Ingen avkutting av produktliste
- **Kun relevante kunder:** Kunder uten varer for dagen vises ikke
- **Minimal status-indikator:** Farget prikk i stedet for tekstbadge
- **Optimal plassutnyttelse:** ~100-150px per kort i høyde

---

## Visuelle forbedringer

```text
NÅVÆRENDE KORT:                    NYTT KOMPAKT KORT:
+---------------------------+      +---------------------------+
| [Pågående]  Cafe Solberg  |      | Cafe Solberg          (●) |
+---------------------------+      +---------------------------+
| Fremgang: 65%             |      | Grovbrød     25  ✓        |
| [=========----]           |      | Kanelboller  48  ◐        |
|                           |      | Rundstykker  60  ○        |
| [Grovbrød]      25 stk    |      +---------------------------+
| [Kanelboller]   48 stk    |
| [Rundstykker]   60 stk    |
|                           |
| 2 av 3 linjer pakket      |
+---------------------------+

Høyde: ~300px                      Høyde: ~100px
```

