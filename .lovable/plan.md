
# Plan: Optimalisert lastetid og oppdateringsmekanisme for SharedDisplay

## Analyse av nåværende arkitektur

### Sammenligning: SharedDisplay vs CustomerDisplay

| Aspekt | CustomerDisplay | SharedDisplay |
|--------|-----------------|---------------|
| Data-henting | 1 kunde - direkte hooks | N kunder via CustomerDataLoader |
| Queries per kunde | 2 (activeProducts, packingData) | 2 per kunde = **N×2 queries** |
| WebSocket | Delt listener | Delt listener |
| Broadcast | Delt listener | Delt listener |
| Cache-strategi | Samme hooks | Samme hooks |

### Identifisert flaskehals: N+1 Query-problemet

SharedDisplay bruker `CustomerDataLoader` som renderer **én komponent per kunde**, og hver komponent kjører sine egne hooks:

```text
SharedDisplay
  └── CustomerDataLoader (Kunde 1)
        ├── usePublicActivePackingProducts() ← Query 1
        └── usePublicPackingData()           ← Query 2
  └── CustomerDataLoader (Kunde 2)
        ├── usePublicActivePackingProducts() ← Query 3 (DUPLIKAT!)
        └── usePublicPackingData()           ← Query 4
  └── CustomerDataLoader (Kunde 3)
        ├── usePublicActivePackingProducts() ← Query 5 (DUPLIKAT!)
        └── usePublicPackingData()           ← Query 6
  ... (og så videre)
```

**Problem 1**: `usePublicActivePackingProducts` kalles **N ganger** med identiske parametere (bakeryId + dato).

**Problem 2**: `usePublicPackingData` kjører **separate database-queries per kunde** - dette er tregt.

**Problem 3**: Ved produktbytte invalideres ALLE cacher samtidig, som trigger **N parallelle refetcher**.

### Eksisterende batch-hook ikke i bruk

Det finnes allerede en `usePublicAllCustomersPackingData` hook (linje 467-613 i usePublicDisplayData.ts) som gjør **én enkelt batch-query** for alle kunder. Men SharedDisplay bruker den ikke.

---

## Løsning: Tre-trinns optimalisering

### Trinn 1: Heis activeProducts til SharedDisplay-nivå (eliminerer N-1 dupliserte queries)

I stedet for at hver `CustomerDataLoader` henter activeProducts, henter SharedDisplay det **én gang** og sender det ned som prop.

**Endring i SharedDisplay.tsx:**
```tsx
// Flytt denne UTENFOR CustomerDataLoader-loopen
const { data: activeProducts } = usePublicActivePackingProducts(
  bakeryId,
  activePackingDate
);

// Send ned som prop
<CustomerDataLoader
  activeProducts={activeProducts} // ← NY PROP
  ...
/>
```

**Endring i CustomerDataLoader.tsx:**
```tsx
interface CustomerDataLoaderProps {
  activeProducts?: any[]; // ← NY PROP
  // ...andre props
}

// Bruk prop i stedet for egen hook
const { data: packingData } = usePublicPackingData(
  customer.id,
  bakeryId,
  activePackingDate,
  activeProducts, // ← Fra prop, ikke egen hook
  customer.name
);
```

**Resultat**: Reduserer queries fra **N×2** til **N+1**.

### Trinn 2: Bruk batch-query for packing data (eliminerer N-1 queries til)

Erstatt N individuelle `usePublicPackingData`-kall med én `usePublicAllCustomersPackingData`.

**Endring i SharedDisplay.tsx:**
```tsx
// Hent alle kunders data i ETT kall
const { data: allPackingData } = usePublicAllCustomersPackingData(
  bakeryId,
  sortedCustomers.map(c => ({ id: c.id, name: c.name })),
  activePackingDate,
  activeProducts
);

// Lag en lookup-map for O(1) tilgang
const packingDataMap = useMemo(() => {
  const map = new Map<string, PackingCustomer>();
  allPackingData?.forEach(d => map.set(d.id, d));
  return map;
}, [allPackingData]);

// Send pre-fetched data til CustomerDataLoader
<CustomerDataLoader
  prefetchedPackingData={packingDataMap.get(customer.id)} // ← NY PROP
  ...
/>
```

**Endring i CustomerDataLoader.tsx:**
```tsx
interface CustomerDataLoaderProps {
  prefetchedPackingData?: PackingCustomer; // ← NY PROP
  // ...
}

// Bruk prefetched data hvis tilgjengelig
const customerData = prefetchedPackingData || packingData?.find(...);
```

**Resultat**: Reduserer queries fra **N+1** til **2** (activeProducts + batch packing data).

### Trinn 3: Granulær cache-invalidering ved produktbytte

Nåværende oppførsel: Når produkter endres, invalideres ALL packing data som trigger full re-render.

**Forbedring i useRealTimePublicDisplay.ts og usePackingBroadcastListener.ts:**

Ved `PRODUCTS_SELECTED`/`PRODUCTS_CLEARED`:
1. Oppdater kun `PUBLIC_ACTIVE_PRODUCTS` cache direkte (ingen full refetch)
2. Marker `PUBLIC_PACKING_DATA` som stale, men **ikke tving umiddelbar refetch**
3. La React Query håndtere background refetch uten loading-spinner

```tsx
case 'PRODUCTS_SELECTED': {
  // Direkte cache-oppdatering av aktive produkter
  queryClient.setQueryData(
    [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0], bakeryId, date],
    payload.newProducts
  );
  
  // Merk som stale uten å tvinge refetch (unngår loading-spinner)
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.PUBLIC_PACKING_DATA[0]],
    exact: false,
    refetchType: 'none', // ← Kritisk: ikke tving refetch
  });
  
  // Background refetch
  queryClient.refetchQueries({
    queryKey: [QUERY_KEYS.PUBLIC_ALL_CUSTOMERS_PACKING[0]],
    exact: false,
  });
  break;
}
```

**Resultat**: Produktbytte oppdaterer UI umiddelbart uten loading-spinner.

---

## Tekniske detaljer

### Filer som endres

| Fil | Endring |
|-----|---------|
| `src/pages/display/SharedDisplay.tsx` | Heis hooks til topp, bruk batch-query |
| `src/components/display/shared/CustomerDataLoader.tsx` | Aksepter pre-fetched data som props |
| `src/hooks/usePackingBroadcastListener.ts` | Granulær invalidering uten loading |
| `src/hooks/useRealTimePublicDisplay.ts` | Samme forbedring |
| `src/lib/queryKeys.ts` | Legg til `PUBLIC_ALL_CUSTOMERS_PACKING` hvis mangler |

### Ny data-flyt etter optimalisering

```text
SharedDisplay
  ├── usePublicActivePackingProducts()     ← 1 query (delt)
  ├── usePublicAllCustomersPackingData()   ← 1 query (batch)
  │
  └── CustomerDataLoader (Kunde 1)
        └── Bruker pre-fetched data        ← 0 queries
  └── CustomerDataLoader (Kunde 2)
        └── Bruker pre-fetched data        ← 0 queries
  └── CustomerDataLoader (Kunde 3)
        └── Bruker pre-fetched data        ← 0 queries
```

**Total: 2 queries uansett antall kunder** (ned fra N×2)

---

## Ytterligere optimalisering: React.memo og stabile referanser

### Hindre unødvendige re-renders

`CustomerPackingCard` er allerede wrapped i `React.memo`, men `CustomerDataLoader` er ikke.

**Endring:**
```tsx
const CustomerDataLoader = React.memo(({ ... }) => {
  // ...
}, (prevProps, nextProps) => {
  // Custom sammenligning - kun re-render ved faktiske data-endringer
  return (
    prevProps.customer.id === nextProps.customer.id &&
    prevProps.prefetchedPackingData?.progress_percentage === 
      nextProps.prefetchedPackingData?.progress_percentage &&
    prevProps.prefetchedPackingData?.products.length === 
      nextProps.prefetchedPackingData?.products.length
  );
});
```

---

## Forventet forbedring

| Metrikk | Før | Etter |
|---------|-----|-------|
| Database-queries ved lasting | N×2 | 2 |
| Queries ved produktbytte | N×2 | 1 (batch) |
| Loading-spinner ved produktbytte | Ja | Nei |
| Re-renders ved oppdatering | Alle kort | Kun endrede |

For 10 kunder: **20 queries → 2 queries** (90% reduksjon)

---

## Implementasjonsrekkefølge

1. **Oppdater SharedDisplay.tsx** - Heis activeProducts hook, integrer batch-query
2. **Oppdater CustomerDataLoader.tsx** - Aksepter prefetched data, fjern egne hooks
3. **Oppdater broadcast/websocket hooks** - Granulær invalidering
4. **Wrap CustomerDataLoader i React.memo** - Hindre unødvendige re-renders
5. **Test** - Verifiser at produktbytte ikke trigger loading-spinner

---

## Bonus: Skeleton loading i stedet for loading-spinner

For enda jevnere UX kan vi vise skeleton-kort som bevarer layout under lasting:

```tsx
{isLoading ? (
  <AutoFitGrid customerCount={previousCustomerCount || 6}>
    {Array.from({ length: previousCustomerCount || 6 }).map((_, i) => (
      <SkeletonCustomerCard key={i} settings={effectiveSettings} />
    ))}
  </AutoFitGrid>
) : (
  // Faktiske kort
)}
```

Dette bevarer grid-layouten og gir brukeren visuell kontinuitet.
