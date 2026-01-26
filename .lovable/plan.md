
# Plan: Kompakt tabellbasert layout for SharedDisplay (Felles skjerm)

## Scope-avklaring

Denne planen gjelder **KUN** for:
- `SharedDisplay.tsx` - Felles pakkeskjerm som viser flere kunder
- `DemoCustomerCard.tsx` - Demo-kort brukt i SharedDisplay
- `CustomerPackingCard.tsx` - Ekte kundekort brukt i SharedDisplay

**IKKE** berørt:
- `CustomerDisplay.tsx` - Individuell kundeskjerm (beholder nåværende layout)
- `CustomerProductsList.tsx` - Produktliste for CustomerDisplay

---

## Problemanalyse

Dagens kundekort i SharedDisplay er for høye fordi:
1. Vertikal produktliste tar mye plass
2. Progress-bar med "Fremgang"-tekst og prosentvisning tar ekstra høyde
3. "X av Y linjer pakket" tar unødvendig plass på felles skjerm
4. Kortene blir lange rektangler i stedet for kompakte firkanter

---

## Teknisk løsning

### 1. Ny innstilling: `shared_compact_table_mode`

Legge til en toggle i display-innstillingene som aktiverer kompakt tabell-modus for SharedDisplay.

**Database-migrasjon:**
```sql
ALTER TABLE public.display_settings
ADD COLUMN IF NOT EXISTS shared_compact_table_mode boolean DEFAULT false;
```

**Fil:** `src/hooks/useDisplaySettings.ts`
```typescript
// Legg til i DisplaySettings type
shared_compact_table_mode?: boolean;
```

**Fil:** `src/utils/displaySettingsDefaults.ts`
```typescript
// Legg til default
shared_compact_table_mode: false,
```

### 2. Tabellbasert produktvisning i DemoCustomerCard

**Fil:** `src/components/display/shared/DemoCustomerCard.tsx`

Ny tabell-struktur som erstatter vertikal liste:

```text
+------------------------------------------+
|     KUNDENAVN          [Ferdig/Pågår]    |
+------------------------------------------+
| Produkt          | Antall |    Status    |
+------------------------------------------+
| Grovbrød         |   25   |  ✓ Ferdig    |
| Kanelboller      |   48   |  ◐ Pågår     |
| Rundstykker      |   60   |  ○ Venter    |
+------------------------------------------+
```

Implementasjon:
```tsx
{settings?.shared_compact_table_mode ? (
  <table className="w-full" style={{ fontSize: `${12 * scaleFactor}px` }}>
    <thead>
      <tr className="border-b" style={{ borderColor: settings?.card_border_color || '#e5e7eb' }}>
        <th className="text-left py-1 font-medium" style={{ color: settings?.text_color }}>Produkt</th>
        <th className="text-center py-1 font-medium" style={{ color: settings?.text_color }}>Antall</th>
        <th className="text-right py-1 font-medium" style={{ color: settings?.text_color }}>Status</th>
      </tr>
    </thead>
    <tbody>
      {displayProducts.map((product) => (
        <tr key={product.product_id}>
          <td className="py-0.5" style={{ color: settings?.text_color }}>{product.product_name}</td>
          <td className="text-center py-0.5 font-semibold" style={{ color: accentColor }}>
            {product.total_quantity}
          </td>
          <td className="text-right py-0.5">
            <span style={{ color: getStatusColor(product.packing_status) }}>
              {product.packing_status === 'packed' ? '✓' : 
               product.packing_status === 'in_progress' ? '◐' : '○'}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  /* Eksisterende vertikal produktliste */
)}
```

### 3. Samme endringer i CustomerPackingCard

**Fil:** `src/components/display/shared/CustomerPackingCard.tsx`

Identisk tabell-logikk som DemoCustomerCard, siden begge brukes i SharedDisplay.

### 4. Forenklet header i kompakt modus

I kompakt modus fjernes:
- Progress-bar (erstattes av status per produkt)
- "Fremgang: X%" tekst
- "X av Y linjer pakket"

```tsx
// I kompakt modus, vis kun kundenavn og status-badge i header
// Fjern progress-section helt
{!settings?.shared_compact_table_mode && (settings?.show_progress_bar ?? true) && (
  /* Progress-bar vises kun i normal modus */
)}
```

### 5. Forbedret AutoFitGrid for firkantede kort

**Fil:** `src/components/display/shared/AutoFitGrid.tsx`

Oppdater scoring-algoritmen til å favorisere mer kvadratiske kort:

```typescript
const calculateOptimalLayout = (...) => {
  // ...eksisterende kode...
  
  for (let cols = 1; cols <= Math.min(6, customerCount); cols++) {
    // ...eksisterende beregninger...
    
    if (cardHeight >= minCardHeight && cardWidth >= minCardWidth) {
      // Beregn aspect ratio bonus (favoriserer firkantede kort)
      const aspectRatio = cardWidth / cardHeight;
      const squareBonus = 1 - Math.abs(1 - aspectRatio); // 0-1, 1 = perfekt firkant
      
      // Kombinert score: areal + bonus for firkant-form
      const score = (cardHeight * cardWidth) * (1 + squareBonus * 0.3);
      
      if (score > bestScore) {
        bestScore = score;
        bestConfig = { columns: cols, rows, cardHeight };
      }
    }
  }
};
```

### 6. UI-toggle i SharedLayoutSection

**Fil:** `src/components/display-settings/sections/SharedLayoutSection.tsx`

```tsx
<ToggleSetting
  id="shared_compact_table_mode"
  label="Kompakt tabell-modus"
  description="Viser produkter i en kompakt tabell for å få plass til flere kunder på skjermen"
  checked={settings.shared_compact_table_mode ?? false}
  onCheckedChange={(checked) => onUpdate({ shared_compact_table_mode: checked })}
/>
```

---

## Filer som må endres

| Fil | Endring |
|-----|---------|
| `src/hooks/useDisplaySettings.ts` | Legg til `shared_compact_table_mode: boolean` |
| `src/utils/displaySettingsDefaults.ts` | Sett default `shared_compact_table_mode: false` |
| `src/components/display/shared/DemoCustomerCard.tsx` | Ny tabellbasert rendering med `<table>` |
| `src/components/display/shared/CustomerPackingCard.tsx` | Samme tabelllogikk |
| `src/components/display/shared/AutoFitGrid.tsx` | Oppdater scoring for bedre firkant-preferanse |
| `src/components/display-settings/sections/SharedLayoutSection.tsx` | Ny toggle for "Kompakt tabell-modus" |
| `supabase/migrations/...` | Legg til `shared_compact_table_mode` kolonne |
| `src/integrations/supabase/types.ts` | Oppdateres automatisk |

---

## Ikke berørte filer (CustomerDisplay)

Følgende filer forblir **uendret**:
- `src/pages/display/CustomerDisplay.tsx`
- `src/components/display/customer/CustomerProductsList.tsx`
- `src/components/display/customer/CustomerProgressBar.tsx`
- `src/components/display/customer/CustomerStatusIndicator.tsx`

---

## Forventet resultat

**SharedDisplay med kompakt modus aktivert:**
- Kortere, mer firkantede kundekort
- 4-6 kunder på én skjerm (i stedet for 2)
- Tabellformat med kun nødvendig info: Produkt, Antall, Status
- Automatisk skalering av font/padding
- Fullskjerm-modus fungerer korrekt

**CustomerDisplay forblir uendret:**
- Beholder nåværende detaljerte visning
- Stor produktliste med progress-bar
- Optimert for én kunde per skjerm
