
## Mål (basert på det du beskriver)
1) Produktene skal få farge fra **paletten du velger i Display-innstillinger** (typisk 3 farger).
2) Hvert produkt (Kneipp/Hvasser/Loff) skal ha **sin faste “slot-farge”** (1/2/3) på tvers av alle displayer.
3) Denne slot-tilordningen skal være **stabil selv om en kunde bare har 1 av produktene** (f.eks. bare Loff) – Loff skal fortsatt ha sin farge.

## Hvorfor alt blir grønt nå
Dagens “konsistent farge” bygger på `hash(product_id) % 3`. Det gir ofte riktig, men kan gi kollisjoner: to forskjellige produkter kan få samme index (0/1/2). Hvis både Kneipp og Hvasser tilfeldigvis får samme index, og den indexen peker til “grønn” i innstillingene, ser du “alt blir grønt”.

I tillegg finnes det allerede en `colorIndex` i datalaget (hooks), men UI-komponentene re-beregner ofte farge lokalt på nytt, som gjør at resultat kan avvike mellom ulike displayer.

## Løsning: Lagre farge-slot per valgt produkt (kilde = active_packing_products)
Vi gjør farge-slot til en del av “aktiv pakking” for valgt dato:

### A) Database: legg til `color_index` i `active_packing_products`
- Ny kolonne: `color_index int` (0..2).
- Backfill for eksisterende rader (f.eks. basert på product_name sortert eller created_at) slik at dagens aktive produkter får 0/1/2.

Dette gjør at:
- Kneipp får f.eks. slot 2 (gul),
- Hvasser får slot 1 (blå),
- Loff får slot 0 (grønn),
og de beholder dette uansett hvilke kunder som har hvilke produkter.

### B) Endre “velg aktive produkter”-lagring slik at color_index bevares
I dag gjør `useSetActivePackingProducts`:
1) delete alt
2) insert på nytt  
Dette sletter all “hukommelse” om fargene.

Vi endrer den til:
1) Hent eksisterende rader for bakery+date (inkl `product_id`, `color_index`, `id`)
2) Bygg `existingColorMap: product_id -> color_index`
3) For produktene brukeren nå velger:
   - hvis produktet finnes fra før: behold samme `color_index`
   - hvis nytt produkt: tildel første ledige slot (0/1/2) som ikke er brukt blant de som er valgt
4) Slett kun rader som er fjernet
5) Update eksisterende rader (by `id`) og insert nye rader (med `color_index`)

Resultat: Når du fjerner Hvasser, endres ikke Kneipp/Loff sine farger. Hvis du legger Hvasser tilbake igjen senere, får den sin gamle slot hvis den fortsatt finnes (eller en ledig slot hvis det var helt nytt).

### C) Bruk `color_index` i alle display-komponenter (slutt å re-hashe)
Vi standardiserer at UI bruker:
- `product.colorIndex` (fra datalaget), eller
- `activeProducts.color_index` map, som fallback
Ikke `hash(product_id) % 3` for SharedDisplay/CustomerDisplay når vi har lagret mapping.

Konkrete endringer:
1) `useActivePackingProducts` og `usePublicActivePackingProducts` må returnere `color_index`.
2) `usePublicPackingData` (og evt batch-varianten `usePublicAllCustomersPackingData`) bygger `productColorMap` fra `activeProducts.color_index` først:
   - `productColorMap.set(ap.product_id, ap.color_index)`
3) `CustomerPackingCard.tsx` og `CustomerProductsList.tsx` bruker `product.colorIndex` når den finnes.
4) `CustomerProductsList.tsx` må også bytte fra `product.id` til `product.product_id` (i de tilfellene den fortsatt beregner fallback).

Dette sikrer at:
- Samme produkt får samme farge på alle displayer
- Fargen påvirkes ikke av om kunden har 1 eller 3 produkter
- Fargene kommer fra de tre fargene i display-innstillinger (Produktrad 1/2/3)

## Viktig UX-regel (slik du ønsker)
- Fargene velges i Display-innstillinger: “Produktrad 1/2/3”.
- Produktene får “slot” 1/2/3 når de velges til pakking for datoen, og beholder slotten.

## Testing (konkret)
1) Sett Produktrad 1/2/3 til (Grønn/Blå/Gul).
2) Velg aktive produkter for dagen: Kneipp, Hvasser, Loff.
   - Verifiser at de får tre ulike farger.
3) Fjern Hvasser fra aktive produkter:
   - Kneipp og Loff skal beholde sine opprinnelige farger.
4) Åpne både fellesdisplay og kundedisplay:
   - Samme produkt skal ha samme farge begge steder.
5) Endre rekkefølge på produktene i valgskjermen:
   - Fargene skal ikke “bytte” hvis produktene var de samme.

## Filer som må endres / legges til
- DB migration: `supabase/migrations/...add_color_index_to_active_packing_products.sql`
- `src/integrations/supabase/types.ts` (for typegenerering/typing av `color_index`)
- `src/hooks/useActivePackingProducts.ts` (inkluder/bruk `color_index`)
- `src/hooks/usePublicDisplayData.ts`
  - `usePublicActivePackingProducts` (inkluder `color_index` + gjerne `.order('color_index')`)
  - `usePublicPackingData` + `usePublicAllCustomersPackingData` (bruk `color_index`)
- `src/components/display/shared/CustomerPackingCard.tsx` (bruk `product.colorIndex` fremfor ny beregning)
- `src/components/display/customer/CustomerProductsList.tsx` (bruk `product.colorIndex` og korriger `product.product_id`)
- (Valgfritt) `src/components/display/shared/DemoCustomerCard.tsx` kan fortsatt bruke index/preview-logikk, men vi kan også simulere color_index der for å matche live.

## Mulige fallgruver og hvordan vi håndterer dem
- Hvis noen velger mer enn 3 produkter: vi må enten (a) tillate gjenbruk av slots eller (b) begrense til 3 i UI. (Per beskrivelsen din virker “max 3” som ønsket praksis.)
- Eksisterende aktive produkter etter migrasjon: backfill gir dem midlertidig slot 0/1/2 slik at displayet ser riktig ut uten at dere må re-velge.

## Leveranse etter endringen
- Kneipp/Hvasser/Loff får hver sin faste farge-slot.
- Ingen hash-kollisjoner, ingen “alle blir grønne”.
- Fargene styres kun av Display-innstillingene (Produktrad 1/2/3).
