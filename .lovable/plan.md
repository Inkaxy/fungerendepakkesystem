
# Plan: Bruk kort `short_id` for felles display-URL

## Status: ✅ FULLFØRT

## Implementerte endringer

| Fil | Endring | Status |
|-----|---------|--------|
| `src/hooks/useResolveBakeryId.ts` | Ny hook for oppløsning short_id → bakery_id | ✅ |
| `src/pages/display/SharedDisplay.tsx` | Bruker useResolveBakeryId for å oppløse URL-param | ✅ |
| `src/components/customers/DisplayManagementCard.tsx` | Bruker bakery_short_id i URL | ✅ |
| `src/stores/authStore.ts` | Lagt til bakery_short_id i UserProfile | ✅ |
| `src/components/display-settings/DisplayPreview.tsx` | Bruker short_id | ✅ |
| `src/components/display-settings/DisplayPreviewPanel.tsx` | Bruker short_id | ✅ |
| `src/utils/displayUtils.ts` | Oppdatert med kort-URL dokumentasjon | ✅ |

## Resultat

| Før | Etter |
|-----|-------|
| `/s/13dfc88b-76a0-485e-8ca7-e2ecb1155d11` | `/s/cf3819` |

Totalt spart: **30 tegn** - mye enklere å dele og scanne via QR.

## Bakoverkompatibilitet

✅ Hvis en full UUID sendes til `/s/`, vil systemet oppdage at det er en UUID og bruke den direkte uten oppslag.

