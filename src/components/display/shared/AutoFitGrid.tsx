import React, { useMemo, useState, useEffect, useRef } from 'react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface AutoFitGridProps {
  customerCount: number;
  settings: DisplaySettings | undefined;
  children: React.ReactNode;
}

interface OptimalLayout {
  columns: number;
  rows: number;
  cardHeight: number;
}

const DEFAULT_MIN_CARD_HEIGHT = 180;
const DEFAULT_MIN_CARD_WIDTH = 280;

const calculateOptimalLayout = (
  customerCount: number,
  availableHeight: number,
  availableWidth: number,
  gap: number,
  minCardHeight: number,
  minCardWidth: number
): OptimalLayout => {
  if (customerCount === 0 || availableHeight <= 0 || availableWidth <= 0) {
    return { columns: 1, rows: 1, cardHeight: 300 };
  }

  let bestConfig = { columns: 1, rows: customerCount, cardHeight: minCardHeight };
  let bestScore = 0;

  // Prøv kolonner fra 1 til maks 6, men ikke mer enn antall kunder
  for (let cols = 1; cols <= Math.min(6, customerCount); cols++) {
    const rows = Math.ceil(customerCount / cols);
    const totalGapHeight = Math.max(0, rows - 1) * gap;
    const totalGapWidth = Math.max(0, cols - 1) * gap;
    
    const cardHeight = Math.floor((availableHeight - totalGapHeight) / rows);
    const cardWidth = Math.floor((availableWidth - totalGapWidth) / cols);

    // Sjekk om denne konfigurasjonen er gyldig
    if (cardHeight >= minCardHeight && cardWidth >= minCardWidth) {
      // Score basert på hvor godt kortene utnytter plassen
      const score = cardHeight * cardWidth;
      if (score > bestScore) {
        bestScore = score;
        bestConfig = { columns: cols, rows, cardHeight };
      }
    }
  }

  // Fallback: Hvis ingen konfigurasjon fungerer, bruk 1 kolonne
  if (bestScore === 0) {
    const rows = customerCount;
    const cardHeight = Math.max(minCardHeight, Math.floor((availableHeight - (rows - 1) * gap) / rows));
    bestConfig = { columns: 1, rows, cardHeight };
  }

  return bestConfig;
};

const AutoFitGrid = ({ customerCount, settings, children }: AutoFitGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Use ResizeObserver for dynamic updates
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });

    observer.observe(containerRef.current);

    // Also listen for fullscreen changes
    document.addEventListener('fullscreenchange', updateDimensions);

    return () => {
      observer.disconnect();
      document.removeEventListener('fullscreenchange', updateDimensions);
    };
  }, []);

  const gap = settings?.customer_cards_gap ?? 24;
  const minCardHeight = settings?.auto_fit_min_card_height ?? DEFAULT_MIN_CARD_HEIGHT;
  const minCardWidth = settings?.auto_fit_min_card_width ?? DEFAULT_MIN_CARD_WIDTH;

  const { columns, cardHeight } = useMemo(() => 
    calculateOptimalLayout(
      customerCount, 
      dimensions.height,
      dimensions.width,
      gap,
      minCardHeight,
      minCardWidth
    ),
    [customerCount, dimensions.height, dimensions.width, gap, minCardHeight, minCardWidth]
  );

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
    >
      {dimensions.height > 0 && (
        <div 
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${Math.ceil(customerCount / columns)}, 1fr)`,
            gap: `${gap}px`,
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div 
              key={index}
              style={{ 
                height: '100%',
                minHeight: `${minCardHeight}px`,
                maxHeight: `${cardHeight}px`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {React.isValidElement(child)
                ? React.cloneElement(child as React.ReactElement<any>, { 
                    maxHeight: cardHeight 
                  })
                : child
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoFitGrid;
