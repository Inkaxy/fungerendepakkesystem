
# Plan: Tematisk Animasjonsoppdatering for Landingsiden

## Analyse av Nåværende Situasjon

Den nåværende animasjonen har:
- **Fallende bakevarer** (🍞🥖🥐 etc.) som faller ned fra toppen
- **Kjørende lastebil** som samler opp brød (game-mekanikk)
- **Score-system** med collision detection

**Problem**: Animasjonen fremstår som et spill/lek-element som ikke kommuniserer systemets hovedformål - **profesjonell pakking av bakevarer uten feil og mangler**.

---

## Ny Animasjonskonsept: "Perfekt Pakkeflyt"

Erstatte spill-animasjonen med en visuell fortelling som viser:

```text
┌─────────────────────────────────────────────────────────────────┐
│                        HERO SECTION                             │
│                                                                 │
│   [Bakevarer glir inn fra venstre]                             │
│         🥖 ──→    ┌─────┐    ──→  ✓                            │
│         🥐 ──→    │📦   │    ──→  ✓   [Pakkede varer ut]       │
│         🍞 ──→    └─────┘    ──→  ✓                            │
│                                                                 │
│   [Samlebånd-effekt med sjekkmerker]                           │
│                                                                 │
│   ═══════════════════════════════════════════════              │
│                    Samlebånd                                    │
│                                                                 │
│   [Lastebil kjører ut til høyre med pakkede varer]             │
│                                      🚚 ──→                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Del 1: Nye Keyframe-animasjoner

### 1.1 Samlebånd-animasjon

```css
@keyframes conveyor-belt {
  0% { background-position: 0 0; }
  100% { background-position: 40px 0; }
}
```

### 1.2 Glide-inn animasjon for bakevarer

```css
@keyframes item-slide-in {
  0% { 
    transform: translateX(-100px);
    opacity: 0;
  }
  20% { 
    opacity: 1;
  }
  50% { 
    transform: translateX(50%);
  }
  80% {
    transform: translateX(100%);
  }
  100% { 
    transform: translateX(calc(100vw + 50px));
    opacity: 0;
  }
}
```

### 1.3 Pakke-animasjon

```css
@keyframes pack-item {
  0% { transform: scale(1); }
  50% { transform: scale(0.8) translateY(10px); }
  100% { transform: scale(0) translateY(20px); opacity: 0; }
}
```

### 1.4 Sjekkmerke-animasjon

```css
@keyframes checkmark-pop {
  0% { transform: scale(0) rotate(-45deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(0deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
```

### 1.5 Lastebil-utgang

```css
@keyframes truck-exit {
  0% { transform: translateX(-50%); }
  80% { transform: translateX(0); }
  100% { transform: translateX(100vw); }
}
```

---

## Del 2: Ny HeroSection Animasjonsstruktur

### 2.1 Visuell Oppbygging

```tsx
// Lag 1: Bakgrunn med subtile dekorative elementer
<div className="absolute inset-0">
  {/* Dekorative sirkler */}
</div>

// Lag 2: Samlebånd nederst
<div className="absolute bottom-20 left-0 right-0">
  <div className="conveyor-belt" />
</div>

// Lag 3: Flygende bakevarer på samlebåndet
<div className="absolute bottom-24 left-0 right-0">
  <div className="animate-item-flow item-1">🥖</div>
  <div className="animate-item-flow item-2">🥐</div>
  <div className="animate-item-flow item-3">🍞</div>
  ...
</div>

// Lag 4: Pakkestasjoner med sjekkmerker
<div className="absolute bottom-16 left-1/3">
  <div className="packing-station">📦 ✓</div>
</div>

// Lag 5: Lastebil som lastes
<div className="absolute bottom-0 right-0">
  <div className="animate-truck-load">
    <img src="truck.png" />
  </div>
</div>
```

### 2.2 Fjerne Spill-elementene

- Fjerne `GameOverlay` komponenten fra landingssiden
- Fjerne `useCollisionDetection` hook fra Index
- Beholde filene for eventuell fremtidig bruk, men ikke bruke dem

---

## Del 3: Nye CSS-klasser

### 3.1 Animasjonsklasser (classes.css)

```css
/* Samlebånd */
.conveyor-belt {
  height: 8px;
  background: repeating-linear-gradient(
    90deg,
    hsl(var(--bakery-brown)) 0px,
    hsl(var(--bakery-brown)) 20px,
    hsl(var(--bakery-brown-light)) 20px,
    hsl(var(--bakery-brown-light)) 40px
  );
  animation: conveyor-belt 1s linear infinite;
}

/* Flyende varer */
.animate-item-flow {
  position: absolute;
  font-size: 2.5rem;
  animation: item-slide-in 8s linear infinite;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

/* Pakkestasjon */
.packing-station {
  animation: gentle-pulse 2s ease-in-out infinite;
}

/* Sjekkmerke */
.animate-checkmark {
  animation: checkmark-pop 0.5s ease-out forwards;
}
```

### 3.2 Posisjonering (positioning.css)

```css
/* Item flow positioning - staggered timing */
.item-1 { animation-delay: 0s; top: 0; }
.item-2 { animation-delay: 1.5s; top: 10px; }
.item-3 { animation-delay: 3s; top: 5px; }
.item-4 { animation-delay: 4.5s; top: 15px; }
.item-5 { animation-delay: 6s; top: 8px; }
```

---

## Del 4: Interaktive Hover-effekter

### 4.1 Bakevare-hover

```css
.baked-item:hover {
  transform: scale(1.1) rotate(5deg);
  filter: drop-shadow(0 8px 12px rgba(0,0,0,0.15));
}
```

### 4.2 Pulserende pakke-ikon

```css
@keyframes gentle-pulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
}
```

---

## Del 5: Responsive Tilpasning

### 5.1 Mobil

- Redusere antall synlige bakevarer fra 5 til 3
- Forenkle samlebånd-visualisering
- Mindre fontstørrelse på emojis

### 5.2 Tablet

- 4 bakevarer synlig
- Full samlebånd med enklere animasjon

---

## Filer som Endres

| Fil | Endring |
|-----|---------|
| `src/styles/animations/keyframes.css` | Nye keyframes for pakkeflyt |
| `src/styles/animations/classes.css` | Nye animasjonsklasser |
| `src/styles/animations/positioning.css` | Oppdatert posisjonering |
| `src/components/home/HeroSection.tsx` | Ny animasjonsstruktur |
| `src/pages/Index.tsx` | Fjerne GameOverlay-referanse |

---

## Forventet Resultat

| Aspekt | Før | Etter |
|--------|-----|-------|
| Tema | Spill/lek | Profesjonell pakking |
| Budskap | "Samle brød" | "Effektiv, feilfri pakking" |
| Visuell stil | Kaotisk fallende elementer | Ordnet samlebånd-flyt |
| Brukeropplevelse | Interaktivt spill | Elegant visualisering |
| Harmoni med resten | Avvikende | Konsistent bakeri-estetikk |

Animasjonen vil kommunisere systemets kjerneverdi: **strukturert, pålitelig pakking av bakevarer uten feil og mangler**.
