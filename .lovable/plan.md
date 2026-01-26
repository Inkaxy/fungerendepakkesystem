
# Plan: Forbedret Produktpakkeside - Smartere, Mer Innovativ og Brukervennlig

## Oversikt
Basert på analysen av skjermbildet og kodebasen, ser jeg at den nåværende `PackingProductOverview`-siden og `ProductsTable`-komponenten har et funksjonelt, men statisk design. Planen er å transformere den til en moderne, intuitiv arbeidsflyt med bedre visuell hierarki, smartere interaksjon, og forbedret "flow" i tabellen.

---

## Hovedforbedringer

### 1. Ny Header med Statistikk-kort
Erstatt den enkle headeren med en visuelt rik header som inkluderer:
- Gradient-bakgrunn og moderne styling (som `ActivePackingCard`)
- Tre statistikk-kort øverst: **Totalt antall produkter**, **Totale enheter**, **Fremgang** (hvor mange er 100% pakket)
- Live-indikator som pulserer for å vise sanntidstilkobling

### 2. Forbedret Valgt-produkter Panel (Floating Sidebar/Drawer)
- Et "sticky" panel på høyre side som viser de valgte produktene (0-3)
- Visuell representasjon med fargekoder som matcher display-fargene
- Drag-and-drop for å endre rekkefølge (påvirker farge-slot)
- Tydelig "Start pakking"-knapp som er alltid synlig

### 3. Smartere Tabell med Forbedret Flow

#### A) Visuell Hierarki
- Rad-gruppering etter kategori med kollapsbare seksjoner
- Tydeligere hover-effekter og valgt-tilstand med gradient-bakgrunn
- Animert overgang når produkter velges/avvelges

#### B) Forbedret Søk og Filter
- Inline søkefelt over tabellen med debounced input
- Quick-filter chips for kategorier
- Filter for status: "Alle", "Pågår", "Ferdig", "Ikke startet"

#### C) Smartere Progress-visning
- Bredere, animert progressbar med gradient (grå→oransje→grønn)
- Tooltip med detaljert info ved hover (f.eks. "5 av 9 enheter pakket")
- Micro-animasjon når prosent oppdateres

#### D) Forbedret Rad-interaksjon
- Klikk på rad = velg/avvelg (allerede implementert)
- Dobbeltklikk = gå direkte til pakking (allerede implementert)
- Hover viser "quick actions" ikon for rask navigasjon
- Valgte rader har en tydelig farge-indikator på venstre kant

### 4. Keyboard Shortcuts Panel
- Liten, sammenleggbar guide nederst/øverst som viser tastatursnarveier
- Flyttes fra inline tekst til et diskret ikon med popover

### 5. Tomme-tilstand Forbedring
- Illustrasjon og call-to-action når ingen produkter finnes
- Veiledning til hvordan laste opp data

---

## Teknisk Implementering

### Filer som opprettes

| Fil | Beskrivelse |
|-----|-------------|
| `src/components/packing/PackingOverviewHeader.tsx` | Ny header-komponent med statistikk og gradient |
| `src/components/packing/SelectedProductsPanel.tsx` | Sticky panel for valgte produkter |
| `src/components/packing/ProductRow.tsx` | Forbedret tabellrad med animasjoner |
| `src/components/packing/ProductFilters.tsx` | Søk og filter-komponent |
| `src/components/packing/KeyboardShortcutsHint.tsx` | Popover med tastaturhjelp |

### Filer som endres

| Fil | Endring |
|-----|---------|
| `src/pages/dashboard/PackingProductOverview.tsx` | Integrerer nye komponenter, forbedret layout |
| `src/components/packing/ProductsTable.tsx` | Major refaktorering med nye features |

---

## Detaljert Design

### A) PackingOverviewHeader.tsx
```text
+------------------------------------------------------------------+
|  ← Tilbake                                                       |
|                                                                  |
|  🗓️ Pakking for 26. januar 2026                      🔴 Live     |
|  Velg opptil 3 produkter for pakking                             |
|                                                                  |
|  +----------------+  +----------------+  +------------------+    |
|  | 📦 32          |  | 📊 428         |  | ✅ 28/32         |    |
|  | Produkter      |  | Totale enheter |  | Ferdig pakket    |    |
|  +----------------+  +----------------+  +------------------+    |
+------------------------------------------------------------------+
```

### B) Forbedret Tabell Layout
```text
+------------------------------------------------------------------+
| 🔍 Søk produkter...    [Brød ▾] [Kaker ▾] [Alle] [Pågår] [Ferdig]|
+------------------------------------------------------------------+
| ☐ | Produktnavn ↑ | Vnr   | Kat.    | Antall | Kunder | Fremgang |
+------------------------------------------------------------------+
| ▼ BRØD (12 produkter)                                            |
+------------------------------------------------------------------+
| █ ☑ | Dobbelt Stekt.. | 709 | Imported | 9 stk | 4     | ████ 100%|
| █ ☑ | Dobbeltstekt..  | 9   | Imported | 2 stk | 1     | ████ 100%|
|   ☐ | Fiberbrød Med.. | 729 | Imported | 24 stk| 9     | ███░ 80% |
+------------------------------------------------------------------+
| ▼ KAKER (8 produkter)                                            |
+------------------------------------------------------------------+
| ...                                                              |
+------------------------------------------------------------------+

█ = Fargekode for valgt produkt (grønn/blå/gul)
```

### C) Selected Products Panel (Sticky Høyre Side)
```text
+------------------------+
| Valgte produkter (2/3) |
+------------------------+
| 🟢 Dobbelt Stekt Kneipp|
|    9 stk • 4 kunder    |
+------------------------+
| 🔵 Fiberbrød Med Frø   |
|    24 stk • 9 kunder   |
+------------------------+
| + Velg ett til...      |
+------------------------+
|                        |
| [🚀 Start pakking (2)] |
|                        |
+------------------------+
```

---

## Implementeringsrekkefølge

1. **Opprett PackingOverviewHeader.tsx** - Statistikk-kort og moderne header
2. **Opprett ProductFilters.tsx** - Søk og filter-komponenter
3. **Opprett KeyboardShortcutsHint.tsx** - Popover for tastaturhjelp
4. **Refaktorer ProductsTable.tsx** - Legg til:
   - Kategori-gruppering
   - Forbedrede rad-stiler med fargekoder
   - Animerte progress-barer
   - Integrert søk/filter
5. **Opprett SelectedProductsPanel.tsx** - Sticky valgt-panel
6. **Oppdater PackingProductOverview.tsx** - Integrer alt med nytt layout
7. **Test** - Verifiser keyboard navigation, animasjoner og responsivitet

---

## Forventet Brukeropplevelse

| Før | Etter |
|-----|-------|
| Statisk tabell uten visuell hierarki | Kategoridelt tabell med kollapsbare seksjoner |
| Ingen søk/filter | Instant-søk med status-filter |
| Enkel checkbox-valg | Fargekodede valg med visuell feedback |
| Inline keyboard-instruksjoner | Diskret popover-guide |
| Knapp langt opp i headeren | Alltid synlig sticky panel |
| Enkel progress-bar | Animert gradient progress med tooltip |

---

## Tekniske Detaljer

### Animasjoner
- Bruk `framer-motion` eller CSS transitions for smooth row selection
- Progress-bar: `transition: width 0.5s ease-out`
- Row hover: `transition: background-color 0.15s ease`

### Responsivitet
- På mobil: Selected panel blir en bottom drawer
- Tabellen får horisontal scroll med faste kolonner (velg + navn)

### Performance
- Virtualisering av rader hvis > 50 produkter (react-window)
- Debounced søk (300ms)
- Memoized rad-komponenter

---

## Visuelt Eksempel: Før vs. Etter

**Før**: Flat tabell med grunnleggende styling, alle rader ser like ut, vanskelig å skille status.

**Etter**: 
- Gradient header med pulserende live-indikator
- Søkefelt og filter-chips for rask navigering
- Kategoriseksjoner som kan kollapses
- Valgte produkter har tydelig fargekode på venstre kant
- Moderne progress-bar med smooth animasjon
- Floating panel viser valgte produkter alltid synlig
- "Start pakking"-knapp er alltid tilgjengelig uten scrolling
