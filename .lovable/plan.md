

# Plan: Nettbrett-administrasjon for Bakeri Pakkesystem

## Oversikt

Basert på PDF-dokumentet om fleet management (Headwind MDM + ws-scrcpy + ADB) og eksisterende systemstruktur, skal vi implementere en nettbrett-administrasjonsmodul som integreres naturlig med bakeri-systemet.

## Funksjonalitet

### Hovedfunksjoner

| Funksjon | Beskrivelse |
|----------|-------------|
| Nettbrett-oversikt | Dedikert side med alle registrerte nettbrett og status |
| Butikk-tilknytning | Koble nettbrett til spesifikke kunder/butikker |
| Snarveier fra kundeoversikt | Hurtighandlinger for nettbrett-kontroll per kunde |
| Status-overvåking | Se online/offline-status og siste aktivitet |
| Fjernkontroll-lenker | Integrasjon med eksterne verktøy (Headwind MDM, ws-scrcpy) |

---

## Del 1: Database-struktur

### Ny tabell: `tablets`

```sql
CREATE TABLE tablets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bakery_id UUID NOT NULL REFERENCES bakeries(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  
  -- Identifikasjon
  name VARCHAR NOT NULL,
  device_id VARCHAR,           -- Android device ID
  ip_address VARCHAR,          -- For ADB-tilkobling
  
  -- Status
  status VARCHAR DEFAULT 'offline',  -- online, offline, error
  last_seen_at TIMESTAMPTZ,
  last_heartbeat_at TIMESTAMPTZ,
  
  -- Konfigurering
  kiosk_mode BOOLEAN DEFAULT true,
  display_url VARCHAR,         -- URL som vises på nettbrettet
  
  -- Metadata
  model VARCHAR,               -- Enhetsmodell
  android_version VARCHAR,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### RLS-policies

```sql
-- Brukere kan se nettbrett fra eget bakeri
CREATE POLICY "Users can view tablets from their bakery"
  ON tablets FOR SELECT
  USING (bakery_id = get_current_user_bakery_id());

-- Admins kan administrere nettbrett
CREATE POLICY "Admins can manage tablets"
  ON tablets FOR ALL
  USING (bakery_id = get_current_user_bakery_id() 
         AND get_current_user_role() IN ('super_admin', 'bakery_admin'));
```

---

## Del 2: Navigasjon og Routing

### Ny meny i AuthLayout

Legge til "Nettbrett" i navigasjonsmenyen (synlig for bakery_admin og super_admin):

```tsx
// AuthLayout.tsx - navigationItems
{ name: 'Nettbrett', href: '/dashboard/tablets', icon: Tablet }
```

### Ny route i App.tsx

```tsx
<Route path="/dashboard/tablets" element={
  <AuthLayout>
    <Tablets />
  </AuthLayout>
} />
```

---

## Del 3: Nettbrett-side

### Ny side: `src/pages/dashboard/Tablets.tsx`

Struktur:
```
┌─────────────────────────────────────────────────────────────┐
│ [PageHeader: Nettbrett-administrasjon]                      │
├─────────────────────────────────────────────────────────────┤
│ [Stats: Totalt | Online | Offline | Uten butikk]           │
├─────────────────────────────────────────────────────────────┤
│ [Søk og filtre]                     [+ Legg til nettbrett] │
├─────────────────────────────────────────────────────────────┤
│ [Tabell med nettbrett]                                      │
│  - Navn | Status | Butikk | IP | Sist sett | Handlinger    │
└─────────────────────────────────────────────────────────────┘
```

### Tabellkolonner

| Kolonne | Innhold |
|---------|---------|
| Navn | Enhetsnavn med status-ikon |
| Status | Online/Offline badge med farge |
| Tilknyttet butikk | Kundenavn eller "Ikke tilknyttet" |
| IP-adresse | For ADB-tilkobling |
| Sist aktiv | Relativ tid (f.eks. "2 min siden") |
| Handlinger | Se skjerm, Omstart, Innstillinger, Koble til butikk |

---

## Del 4: Snarvei fra kundeoversikt

### Forbedre CustomersTable.tsx

Legge til Tablet-ikon i handlingsmenyen:

```tsx
<DropdownMenuItem onClick={() => onManageTablet(customer)}>
  <Tablet className="w-4 h-4 mr-2" />
  Administrer nettbrett
</DropdownMenuItem>
```

### Forbedre QrCodeModal.tsx

Legge til seksjon for nettbrett-status:

```tsx
{/* Nettbrett-seksjon */}
<div className="p-4 bg-slate-50 rounded-lg border">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Tablet className="w-4 h-4" />
      <span className="font-medium">Nettbrett</span>
    </div>
    {linkedTablet ? (
      <Badge variant="success">
        {linkedTablet.name} - {linkedTablet.status}
      </Badge>
    ) : (
      <Button variant="outline" size="sm" onClick={onLinkTablet}>
        Koble til nettbrett
      </Button>
    )}
  </div>
</div>
```

---

## Del 5: Dialoger og komponenter

### Nye komponenter

| Fil | Beskrivelse |
|-----|-------------|
| `CreateTabletDialog.tsx` | Registrer nytt nettbrett |
| `EditTabletDialog.tsx` | Rediger nettbrett-innstillinger |
| `LinkTabletDialog.tsx` | Koble nettbrett til kunde |
| `TabletStatusBadge.tsx` | Konsistent status-visning |
| `TabletActionsDropdown.tsx` | Handlingsmeny for nettbrett |

### CreateTabletDialog innhold

```tsx
// Felter:
- Navn (påkrevd)
- IP-adresse (for ADB)
- Velg butikk (dropdown med kunder)
- Kiosk-modus (toggle)
- Notater (tekstfelt)
```

---

## Del 6: Hooks for datatilgang

### Ny hook: `useTablets.ts`

```typescript
export const useTablets = () => {
  const { profile } = useAuthStore();
  
  return useQuery({
    queryKey: ['tablets', profile?.bakery_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tablets')
        .select(`
          *,
          customer:customers(id, name, customer_number)
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.bakery_id
  });
};
```

### Ny hook: `useTabletActions.ts`

```typescript
export const useTabletActions = () => {
  const queryClient = useQueryClient();
  
  const createTablet = useMutation({...});
  const updateTablet = useMutation({...});
  const deleteTablet = useMutation({...});
  const linkToCustomer = useMutation({...});
  
  return { createTablet, updateTablet, deleteTablet, linkToCustomer };
};
```

---

## Del 7: Integrasjon med ekstern MDM

### Innstillinger for MDM-kobling

I Settings.tsx, legge til ny seksjon:

```tsx
<Card className="card-warm">
  <CardHeader>
    <div className="flex items-center gap-3">
      <Tablet className="h-5 w-5" />
      <div>
        <CardTitle>Nettbrett-administrasjon</CardTitle>
        <CardDescription>
          Koble til eksternt MDM-system
        </CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div>
        <Label>Headwind MDM URL</Label>
        <Input placeholder="https://mdm.dittbakeri.no" />
      </div>
      <div>
        <Label>ws-scrcpy URL</Label>
        <Input placeholder="https://scrcpy.dittbakeri.no" />
      </div>
    </div>
  </CardContent>
</Card>
```

### Lenker til eksterne verktøy

I TabletActionsDropdown:

```tsx
<DropdownMenuItem onClick={() => openExternalMdm(tablet)}>
  <ExternalLink className="w-4 h-4 mr-2" />
  Åpne i Headwind MDM
</DropdownMenuItem>
<DropdownMenuItem onClick={() => openRemoteScreen(tablet)}>
  <Monitor className="w-4 h-4 mr-2" />
  Fjernkontroll (ws-scrcpy)
</DropdownMenuItem>
```

---

## Del 8: Heartbeat-system (valgfritt)

For å spore nettbrett-status i sanntid, kan vi implementere et enkelt heartbeat-system:

### Edge Function: `tablet-heartbeat`

```typescript
// supabase/functions/tablet-heartbeat/index.ts
Deno.serve(async (req) => {
  const { device_id, ip_address } = await req.json();
  
  // Oppdater sist sett og status
  await supabase
    .from('tablets')
    .update({ 
      last_heartbeat_at: new Date().toISOString(),
      status: 'online',
      ip_address
    })
    .eq('device_id', device_id);
    
  return new Response(JSON.stringify({ success: true }));
});
```

### Scheduled job for offline-deteksjon

```sql
-- Marker nettbrett som offline etter 5 min uten heartbeat
UPDATE tablets 
SET status = 'offline' 
WHERE last_heartbeat_at < NOW() - INTERVAL '5 minutes'
  AND status = 'online';
```

---

## Filer som opprettes

| Fil | Type | Beskrivelse |
|-----|------|-------------|
| `src/pages/dashboard/Tablets.tsx` | Side | Hovedside for nettbrett-oversikt |
| `src/components/tablets/CreateTabletDialog.tsx` | Komponent | Registrer nytt nettbrett |
| `src/components/tablets/EditTabletDialog.tsx` | Komponent | Rediger nettbrett |
| `src/components/tablets/LinkTabletDialog.tsx` | Komponent | Koble til kunde |
| `src/components/tablets/TabletStatusBadge.tsx` | Komponent | Status-badge |
| `src/components/tablets/TabletActionsDropdown.tsx` | Komponent | Handlingsmeny |
| `src/components/tablets/TabletsTable.tsx` | Komponent | Tabell med nettbrett |
| `src/components/tablets/TabletsStats.tsx` | Komponent | Statistikk-kort |
| `src/hooks/useTablets.ts` | Hook | Hent nettbrett-data |
| `src/hooks/useTabletActions.ts` | Hook | CRUD-operasjoner |
| `src/types/tablet.ts` | Type | TypeScript-definisjon |
| `supabase/functions/tablet-heartbeat/index.ts` | Edge Function | Heartbeat-mottak |

## Filer som endres

| Fil | Endringer |
|-----|-----------|
| `src/App.tsx` | Legge til /dashboard/tablets route |
| `src/components/layouts/AuthLayout.tsx` | Legge til Nettbrett i navigasjon |
| `src/components/customers/CustomersTable.tsx` | Legge til nettbrett-handling |
| `src/components/customers/QrCodeModal.tsx` | Vise tilknyttet nettbrett |
| `src/pages/dashboard/Settings.tsx` | Legge til MDM-konfigurasjon |
| `src/types/database.ts` | Legge til Tablet-type |

---

## Implementeringsrekkefølge

1. **Database** - Opprette tablets-tabell med RLS
2. **Types & Hooks** - Definere typer og datahenting
3. **Hovedside** - Tablets.tsx med tabell og statistikk
4. **Dialoger** - Create, Edit, Link-dialoger
5. **Navigasjon** - Legge til i AuthLayout og App.tsx
6. **Kunde-integrasjon** - Snarveier fra kundeoversikt
7. **Innstillinger** - MDM-konfigurasjon i Settings
8. **Heartbeat** - Edge function for status-sporing

---

## Forventet resultat

| Område | Funksjonalitet |
|--------|----------------|
| Nettbrett-meny | Dedikert side i hovednavigasjon |
| Oversikt | Se alle nettbrett med status og butikk-tilknytning |
| Fra kunde | Hurtigkontroll av nettbrett direkte fra kundekort |
| Status | Real-time online/offline-indikator |
| Fjernkontroll | Lenker til Headwind MDM og ws-scrcpy |

Denne løsningen gir en komplett administrasjonsflate for nettbrett, integrert sømløst med eksisterende kunde- og bakeri-struktur, med mulighet for utvidelse til ekstern MDM-integrasjon.

