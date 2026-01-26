
# Plan: Konfigurerbar Tabell-Layout for SharedDisplay

## Konsept: Hybrid Tilpasningsmodus

I stedet for kun automatisk beregning, gir vi brukeren mulighet til å velge mellom:
1. **Automatisk** (dagens løsning) - systemet beregner beste oppsett
2. **Fast rutenett** - brukeren definerer eksakt antall rader og kolonner

Med fast rutenett kommer en intelligent advarsel dersom antall kunder overstiger kapasiteten.

---

## Brukeropplevelse

### Ny innstillings-seksjon i Layout-fanen

```text
+--------------------------------------------------+
|  Layout-modus                                    |
|  ○ Automatisk tilpasning                         |
|  ● Fast rutenett                                 |
|                                                   |
|  Kolonner: [====●====] 4                          |
|  Rader:    [====●====] 3                          |
|                                                   |
|  Kapasitet: 12 kunder                            |
|                                                   |
|  ⚠️ 2 kunder får ikke plass!                      |
|     (14 kunder totalt for denne pakkingsdagen)   |
+--------------------------------------------------+
```

### Advarselssystem

Når kunder overstiger kapasiteten, vises:
1. **I innstillinger:** Gul advarsel med antall som ikke får plass
2. **På selve displayet:** Diskret varsel nederst + siste rad viser "...og 2 til"

---

## Teknisk implementasjon

### 1. Nye database-kolonner

```sql
ALTER TABLE public.display_settings
ADD COLUMN IF NOT EXISTS grid_layout_mode text DEFAULT 'auto',
ADD COLUMN IF NOT EXISTS grid_fixed_rows integer DEFAULT 3,
ADD COLUMN IF NOT EXISTS grid_fixed_columns integer DEFAULT 4;
```

| Kolonne | Type | Default | Beskrivelse |
|---------|------|---------|-------------|
| `grid_layout_mode` | text | 'auto' | 'auto' eller 'fixed' |
| `grid_fixed_rows` | integer | 3 | Antall rader (1-6) |
| `grid_fixed_columns` | integer | 4 | Antall kolonner (1-6) |

### 2. Oppdater DisplaySettings-interface

**Fil:** `src/hooks/useDisplaySettings.ts`
```typescript
// Legg til i DisplaySettings interface
grid_layout_mode?: 'auto' | 'fixed';
grid_fixed_rows?: number;
grid_fixed_columns?: number;
```

### 3. Oppdater displaySettingsDefaults

**Fil:** `src/utils/displaySettingsDefaults.ts`
```typescript
grid_layout_mode: 'auto',
grid_fixed_rows: 3,
grid_fixed_columns: 4,
```

### 4. Ny UI-komponent: GridLayoutSelector

**Ny fil:** `src/components/display-settings/GridLayoutSelector.tsx`

```tsx
interface GridLayoutSelectorProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
  customerCount?: number; // For advarsel
}

const GridLayoutSelector = ({ settings, onUpdate, customerCount = 0 }: GridLayoutSelectorProps) => {
  const capacity = (settings.grid_fixed_rows ?? 3) * (settings.grid_fixed_columns ?? 4);
  const overflow = Math.max(0, customerCount - capacity);

  return (
    <div className="space-y-4">
      <RadioGroup
        value={settings.grid_layout_mode ?? 'auto'}
        onValueChange={(value) => onUpdate({ grid_layout_mode: value as 'auto' | 'fixed' })}
      >
        <RadioGroupItem value="auto" label="Automatisk tilpasning" />
        <RadioGroupItem value="fixed" label="Fast rutenett" />
      </RadioGroup>

      {settings.grid_layout_mode === 'fixed' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <SliderControl
              label="Kolonner"
              value={settings.grid_fixed_columns ?? 4}
              onChange={(v) => onUpdate({ grid_fixed_columns: v })}
              min={1} max={6} step={1}
            />
            <SliderControl
              label="Rader"
              value={settings.grid_fixed_rows ?? 3}
              onChange={(v) => onUpdate({ grid_fixed_rows: v })}
              min={1} max={6} step={1}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span>Kapasitet: {capacity} kunder</span>
            {overflow > 0 && (
              <span className="text-amber-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {overflow} kunder får ikke plass
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
```

### 5. Oppdater SharedLayoutSection

**Fil:** `src/components/display-settings/sections/SharedLayoutSection.tsx`

Erstatt dagens `auto_fit_screen` toggle med den nye `GridLayoutSelector`:

```tsx
import GridLayoutSelector from '../GridLayoutSelector';

const SharedLayoutSection = ({ settings, onUpdate, customerCount }: Props) => {
  return (
    <div className="space-y-4">
      <ToggleSetting
        id="shared_compact_table_mode"
        label="Kompakt tabell-modus"
        description="..."
        checked={settings.shared_compact_table_mode ?? false}
        onCheckedChange={(checked) => onUpdate({ shared_compact_table_mode: checked })}
      />

      <ToggleSetting
        id="auto_fit_screen"
        label="Tilpass til skjerm"
        description="..."
        checked={settings.auto_fit_screen ?? false}
        onCheckedChange={(checked) => onUpdate({ auto_fit_screen: checked })}
      />

      {settings.auto_fit_screen && (
        <GridLayoutSelector 
          settings={settings} 
          onUpdate={onUpdate}
          customerCount={customerCount}
        />
      )}
      
      {/* Resten av innstillingene */}
    </div>
  );
};
```

### 6. Oppdater AutoFitGrid med fast rutenett-modus

**Fil:** `src/components/display/shared/AutoFitGrid.tsx`

```tsx
const AutoFitGrid = ({ customerCount, settings, children }: AutoFitGridProps) => {
  // ... eksisterende kode ...

  const isFixedMode = settings?.grid_layout_mode === 'fixed';
  const fixedRows = settings?.grid_fixed_rows ?? 3;
  const fixedColumns = settings?.grid_fixed_columns ?? 4;
  const capacity = fixedRows * fixedColumns;
  
  // Beregn layout basert på modus
  const { columns, rows, cardHeight } = useMemo(() => {
    if (isFixedMode) {
      // Fast rutenett - bruk definerte verdier
      const totalGapHeight = Math.max(0, fixedRows - 1) * gap;
      const totalGapWidth = Math.max(0, fixedColumns - 1) * gap;
      const calculatedHeight = Math.floor((dimensions.height - totalGapHeight) / fixedRows);
      
      return {
        columns: fixedColumns,
        rows: fixedRows,
        cardHeight: Math.max(minCardHeight, calculatedHeight)
      };
    }
    
    // Automatisk modus - bruk eksisterende algoritme
    return calculateOptimalLayout(...);
  }, [isFixedMode, fixedRows, fixedColumns, ...]);

  // Bestem hvilke barn som skal vises
  const visibleChildren = React.Children.toArray(children);
  const displayedChildren = isFixedMode 
    ? visibleChildren.slice(0, capacity) 
    : visibleChildren;
  const overflowCount = isFixedMode 
    ? Math.max(0, visibleChildren.length - capacity) 
    : 0;

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {dimensions.height > 0 && (
        <>
          <div 
            className="grid w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gap: `${gap}px`,
            }}
          >
            {displayedChildren.map((child, index) => (
              <div key={index} style={{ ... }}>
                {child}
              </div>
            ))}
            
            {/* Overflow-indikator i siste celle */}
            {overflowCount > 0 && (
              <div className="flex items-center justify-center bg-amber-500/10 rounded-lg border-2 border-dashed border-amber-500">
                <span className="text-amber-600 font-medium">
                  +{overflowCount} kunder
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
```

### 7. Visuell grid-preview i innstillinger

**Ny fil:** `src/components/display-settings/GridPreview.tsx`

En mini-visualisering av det valgte rutenettet:

```tsx
const GridPreview = ({ rows, columns, customerCount }: Props) => {
  const capacity = rows * columns;
  const cells = Array.from({ length: capacity }, (_, i) => i);
  
  return (
    <div 
      className="aspect-video border rounded-lg p-2 bg-muted/50"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '4px'
      }}
    >
      {cells.map((i) => (
        <div 
          key={i}
          className={cn(
            "rounded border-2 flex items-center justify-center text-xs",
            i < customerCount 
              ? "bg-primary/20 border-primary/40" 
              : "bg-muted border-dashed border-muted-foreground/30"
          )}
        >
          {i < customerCount ? i + 1 : ''}
        </div>
      ))}
    </div>
  );
};
```

---

## Oppsummering av filer

| Fil | Endring |
|-----|---------|
| `supabase/migrations/...` | Legg til `grid_layout_mode`, `grid_fixed_rows`, `grid_fixed_columns` |
| `src/hooks/useDisplaySettings.ts` | Utvid interface med nye felter |
| `src/utils/displaySettingsDefaults.ts` | Legg til defaults |
| `src/components/display-settings/GridLayoutSelector.tsx` | **NY** - Modus-velger |
| `src/components/display-settings/GridPreview.tsx` | **NY** - Visuell forhåndsvisning |
| `src/components/display-settings/sections/SharedLayoutSection.tsx` | Integrer ny komponent |
| `src/components/display/shared/AutoFitGrid.tsx` | Støtte for fast rutenett + overflow |
| `src/pages/display/SharedDisplay.tsx` | Sende customerCount til grid |

---

## Forventet brukeropplevelse

1. **Standard:** Automatisk modus fungerer som før - ingen endring for eksisterende brukere
2. **Fast rutenett:** Brukeren velger f.eks. 4x3 = 12 plasser
3. **Advarsel:** Hvis 14 kunder har varer den dagen, vises "2 kunder får ikke plass"
4. **På displayet:** De 12 første kundene vises + en boks med "+2 kunder"
5. **Forhåndsvisning:** Mini-grid viser oppsettet visuelt i sanntid

---

## Innovasjon: Smart sortering ved overflow

Som tilleggsfeature kan vi prioritere hvilke kunder som vises først:
- Kunder med pågående pakking prioriteres over ventende
- Alfabetisk innenfor hver gruppe
- Ferdige kunder flyttes til slutten (og kuttes først ved overflow)

Dette sikrer at de mest relevante kundene alltid er synlige på skjermen.
