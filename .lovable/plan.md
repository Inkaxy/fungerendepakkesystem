
# Plan: Fiks "Tilpass til skjerm"-funksjonaliteten

## Problemanalyse

Undersøkelsen avdekket tre hovedproblemer:

1. **Demo-modus mangler fallback-innstillinger**: Når `bakeryId` ikke finnes i databasen, returnerer `usePublicDisplaySettings` undefined. Dette bryter demo-rendringen.

2. **`auto_fit_screen` er deaktivert som standard**: I `displaySettingsDefaults.ts` er `auto_fit_screen: false`. Brukeren må eksplisitt aktivere den.

3. **Loading-state vises feil i demo**: Betingelsen `!isDemo && isLoading` i SharedDisplay.tsx fungerer, men demo-kortene vises ikke fordi `settings?.auto_fit_screen` er undefined/false.

---

## Teknisk løsning

### 1. Opprett fallback-innstillinger for demo-modus

**Fil:** `src/pages/display/SharedDisplay.tsx`

Legg til en `useMemo` som returnerer default-innstillinger når `settings` er undefined:

```typescript
const effectiveSettings = useMemo(() => {
  if (settings) return settings;
  
  // Fallback for demo-modus når settings ikke er tilgjengelig
  if (isDemo) {
    return {
      ...getDefaultSettings('demo'),
      auto_fit_screen: true, // Aktiver auto-fit i demo
      id: 'demo-settings'
    } as DisplaySettings;
  }
  
  return undefined;
}, [settings, isDemo]);
```

Deretter bruk `effectiveSettings` i stedet for `settings` overalt i komponenten.

### 2. Forbedre AutoFitGrid for bedre skjermtilpasning

**Fil:** `src/components/display/shared/AutoFitGrid.tsx`

Problemet er at algoritmen noen ganger gir for mange kolonner, noe som resulterer i for smale kort. Forbedre algoritmen:

```typescript
const calculateOptimalLayout = (
  customerCount: number,
  availableHeight: number,
  availableWidth: number,
  gap: number,
  minCardHeight: number
): OptimalLayout => {
  if (customerCount === 0 || availableHeight <= 0 || availableWidth <= 0) {
    return { columns: 1, rows: 1, cardHeight: 300 };
  }

  const MIN_CARD_WIDTH = 280; // Økt fra 250 for bedre lesbarhet
  
  let bestConfig = { columns: 1, rows: customerCount, cardHeight: minCardHeight };
  let bestScore = 0;

  // Prøv kolonner fra 1 til 6
  for (let cols = 1; cols <= Math.min(6, customerCount); cols++) {
    const rows = Math.ceil(customerCount / cols);
    const totalGapHeight = Math.max(0, rows - 1) * gap;
    const totalGapWidth = Math.max(0, cols - 1) * gap;
    
    const cardHeight = Math.floor((availableHeight - totalGapHeight) / rows);
    const cardWidth = Math.floor((availableWidth - totalGapWidth) / cols);

    // Sjekk om denne konfigurasjonen er gyldig
    if (cardHeight >= minCardHeight && cardWidth >= MIN_CARD_WIDTH) {
      // Score basert på hvor godt kortene utnytter plassen
      const score = cardHeight * cardWidth;
      if (score > bestScore) {
        bestScore = score;
        bestConfig = { columns: cols, rows, cardHeight };
      }
    }
  }

  return bestConfig;
};
```

### 3. Forbedre kortinnhold for dynamisk skalering

**Fil:** `src/components/display/shared/DemoCustomerCard.tsx` og `CustomerPackingCard.tsx`

Legg til dynamisk fontstørrelse basert på kortstørrelse:

```typescript
// Beregn skaleringsfaktor basert på maxHeight
const scaleFactor = maxHeight ? Math.min(1, (maxHeight - 100) / 200) : 1;

// Bruk i style
style={{
  fontSize: `${(settings?.customer_name_font_size || 18) * scaleFactor}px`
}}
```

### 4. Sikre at demo-rendering bruker effectiveSettings

**Fil:** `src/pages/display/SharedDisplay.tsx`

Endre alle steder som bruker `settings?.auto_fit_screen` til å bruke `effectiveSettings?.auto_fit_screen`.

---

## Filer som må endres

| Fil | Endring |
|-----|---------|
| `src/pages/display/SharedDisplay.tsx` | Legg til `effectiveSettings` med demo-fallback, bruk den overalt |
| `src/components/display/shared/AutoFitGrid.tsx` | Forbedre layout-algoritme med MIN_CARD_WIDTH = 280 og score-basert valg |
| `src/components/display/shared/DemoCustomerCard.tsx` | Legg til dynamisk skalering av fonter/padding basert på maxHeight |
| `src/components/display/shared/CustomerPackingCard.tsx` | Samme skalerings-logikk som DemoCustomerCard |

---

## Forventet resultat

Etter implementering:
- "Tilpass til skjerm"-bryteren vil fungere korrekt
- Alle kundekort tilpasses automatisk til skjermstørrelsen
- Ingen scrolling nødvendig - alt vises på én skjerm
- Tekst og elementer harmoniserer med kortstørrelsen
- Demo-modus viser 3 eksempelkort med riktig layout
