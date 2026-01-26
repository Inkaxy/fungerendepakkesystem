
# Plan: Forbedret kundevisning på SharedDisplay

## Problemanalyse

Basert på dine tre krav:

1. **Ingen faste plasser** - Kunder skal automatisk fylle griddet basert på antall aktive kunder
2. **Vis kunder selv uten valgte produkter** - Kunder med ordrer for pakkedatoen skal ALLTID vises, selv før produkter er valgt for pakking (viktig for sjåfører som skal se status)
3. **Konsistent produktfarge** - Samme produkt skal alltid ha samme farge uansett antall produkter kunden har

---

## Tekniske løsninger

### 1. Dynamisk plassering (allerede fungerer)

Dagens `AutoFitGrid`-komponent plasserer allerede kunder dynamisk uten faste plasser. Griddet beregner automatisk kolonner og rader basert på:
- Tilgjengelig skjermplass
- Antall kunder med data

Dette er korrekt implementert - ingen endring nødvendig.

### 2. Vis kunder med ordrer UAVHENGIG av valgte produkter

**Nåværende problem:**
I `CustomerDataLoader.tsx` (linje 55-57) returnerer komponenten `null` hvis ingen produkter er valgt:
```typescript
if (!activeProducts || activeProducts.length === 0) {
  return null; // ← Skjuler kunden helt!
}
```

**Løsning:**
Endre logikken slik at kunder med ordrer for pakkedatoen ALLTID vises, med status-indikator (blå/grønn), selv om ingen produkter er valgt ennå.

#### Fil: `src/components/display/shared/CustomerDataLoader.tsx`

```typescript
// GAMMEL LOGIKK (linje 54-57):
if (!activeProducts || activeProducts.length === 0) {
  return null;
}

// NY LOGIKK:
// Hent ordredata UAVHENGIG av valgte produkter
// Vis kunden med status-indikator selv om ingen produkter er valgt ennå
```

**Ny tilnærming:**
1. Sjekk om kunden har ordrer for pakkedatoen (via `usePublicPackingData` uten produkt-filter)
2. Hvis ja: Vis kundekortet med status-indikator
3. Produktlisten viser kun valgte produkter (eller "Ingen produkter valgt" melding)
4. Status-indikatoren (blå/grønn prikk) baseres på ALLE ordrer for dagen, ikke bare valgte produkter

#### Fil: `src/hooks/usePublicDisplayData.ts`

Må oppdatere `usePublicPackingData` til å:
1. Alltid hente ordredata for kunden på den aktuelle datoen
2. Beregne overall_status basert på ALLE produkter (ikke bare de valgte)
3. Returnere produktliste kun for visning (filtrert på valgte produkter)

```typescript
// Ny parameter: alwaysShowCustomer?: boolean
export const usePublicPackingData = (
  customerId?: string, 
  bakeryId?: string, 
  date?: string, 
  activeProducts?: any[], 
  customerName?: string,
  alwaysShowCustomer?: boolean // ← NY
) => {
  // ...
  
  // ✅ KRITISK ENDRING: Hent ALLTID alle ordrer for kunden
  // Status beregnes på ALLE produkter
  // Produktlisten filtreres kun for VISNING
}
```

### 3. Konsistent produktfarge uavhengig av antall

**Nåværende problem:**
Innstillingen `use_consistent_product_colors` eksisterer, men er satt til `false` som standard. Når den er `false`, brukes `index % 3` som gir forskjellige farger avhengig av produktets posisjon i listen.

**Løsning:**
Endre standardverdien til `true` slik at `getConsistentColorIndex(productId)` alltid brukes. Dette sikrer at:
- "Grovbrød" alltid får farge 0 (uansett antall produkter)
- "Kanelboller" alltid får farge 1 (basert på produkt-ID hash)
- Samme produkt = samme farge på alle displays

#### Fil: `src/utils/displaySettingsDefaults.ts`

```typescript
// GAMMEL (linje 187):
use_consistent_product_colors: false,

// NY:
use_consistent_product_colors: true, // ← Alltid konsistent farge
```

---

## Detaljerte filendringer

### 1. `src/components/display/shared/CustomerDataLoader.tsx`

| Linje | Endring |
|-------|---------|
| 54-57 | Fjern `if (!activeProducts) return null` |
| 62-64 | Endre til å vise kort selv uten produkter - vis "Venter på valg" |

**Ny logikk:**
```typescript
// Hent ordredata UTEN avhengighet av activeProducts
const { data: allOrdersData } = usePublicPackingData(
  customer.id,
  bakeryId,
  activePackingDate,
  undefined, // ← Ingen filter
  customer.name,
  true // ← alwaysShowCustomer
);

// Sjekk om kunden har ordrer for denne datoen
const hasOrdersForDate = allOrdersData && allOrdersData.length > 0 && 
  allOrdersData[0]?.total_line_items_all > 0;

// Hvis ingen ordrer for datoen - ikke vis
if (!hasOrdersForDate) {
  return null;
}

// Vis kortet - produktlisten kan være tom, men status vises alltid
```

### 2. `src/hooks/usePublicDisplayData.ts`

Oppdater `usePublicPackingData` til å separere:
- **Status-beregning:** Basert på ALLE produkter for datoen
- **Produktvisning:** Kun valgte produkter

### 3. `src/utils/displaySettingsDefaults.ts`

```typescript
// Linje 187
use_consistent_product_colors: true, // Endret fra false
```

### 4. `src/components/display/shared/CustomerPackingCard.tsx`

Legg til støtte for visning når ingen produkter er valgt:

```typescript
{displayProducts.length === 0 && (
  <div className="text-center py-2 opacity-60" style={{ color: settings?.text_color }}>
    <span style={{ fontSize: `${Math.max(10, 12 * scaleFactor)}px` }}>
      Ingen produkter valgt for pakking
    </span>
  </div>
)}
```

### 5. `src/components/display/shared/DemoCustomerCard.tsx`

Samme endring for demo-visning.

---

## Oppsummering

| Krav | Løsning | Fil |
|------|---------|-----|
| Dynamisk plassering | Allerede implementert i AutoFitGrid | Ingen endring |
| Vis kunder med ordrer | Fjern avhengighet av activeProducts | CustomerDataLoader.tsx, usePublicDisplayData.ts |
| Konsistent produktfarge | Endre default til true | displaySettingsDefaults.ts |

---

## Forventet resultat

**Før:**
- Kunde A har 3 ordrer for 27. januar, men ingen produkter er valgt → Kunden er USYNLIG
- Produkt "Grovbrød" vises med farge 0 hos kunde A, men farge 1 hos kunde B (fordi rekkefølgen er annerledes)

**Etter:**
- Kunde A har 3 ordrer for 27. januar → Vises med blå status-prikk + "Ingen produkter valgt"
- Når produkter velges → Vises med produktliste + grønn prikk når ferdig
- "Grovbrød" har ALLTID samme farge på alle displays (basert på produkt-ID hash)

---

## Visuelt eksempel

```text
FØR (kunde skjult):                 ETTER (kunde synlig):
+---------------------------+       +---------------------------+
|                           |       | Cafe Solberg          (●) |  ← Blå = venter
|     (TOMT - INGEN KORT)   |       +---------------------------+
|                           |       | Ingen produkter valgt     |
+---------------------------+       +---------------------------+

Når produkter velges:
+---------------------------+
| Cafe Solberg          (●) |  ← Grønn når ferdig
+---------------------------+
| Grovbrød     25  ✓        |  ← Samme farge som på alle andre displays
| Kanelboller  48  ◐        |
| Rundstykker  60  ○        |
+---------------------------+
```
