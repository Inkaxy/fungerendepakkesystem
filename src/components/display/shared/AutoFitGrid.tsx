import React, { useMemo, useState, useEffect, useRef } from 'react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { AlertTriangle } from 'lucide-react';

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
      // Beregn aspect ratio bonus (favoriserer mer firkantede kort)
      const aspectRatio = cardWidth / cardHeight;
      const squareBonus = 1 - Math.abs(1 - aspectRatio); // 0-1, 1 = perfekt firkant
      
      // Kombinert score: areal + bonus for firkant-form
      const score = (cardHeight * cardWidth) * (1 + squareBonus * 0.3);
      
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
  const baseMinCardHeight = settings?.auto_fit_min_card_height ?? DEFAULT_MIN_CARD_HEIGHT;
  const baseMinCardWidth = settings?.auto_fit_min_card_width ?? DEFAULT_MIN_CARD_WIDTH;
  
  // Sjekk om vi er i fast rutenett-modus
  const isFixedMode = settings?.grid_layout_mode === 'fixed';
  const fixedRows = settings?.grid_fixed_rows ?? 3;
  const fixedColumns = settings?.grid_fixed_columns ?? 4;
  const capacity = fixedRows * fixedColumns;
  
  // I kompakt modus: Bruk lavere minimumsverdier for å få plass til flere kort
  const minCardHeight = settings?.shared_compact_table_mode 
    ? Math.min(baseMinCardHeight, 100) // Maks 100px i kompakt modus
    : baseMinCardHeight;
  const minCardWidth = settings?.shared_compact_table_mode
    ? Math.min(baseMinCardWidth, 180) // Maks 180px i kompakt modus
    : baseMinCardWidth;

  const { columns, rows, cardHeight } = useMemo(() => {
    if (isFixedMode) {
      // Fast rutenett - bruk definerte verdier
      const totalGapHeight = Math.max(0, fixedRows - 1) * gap;
      const calculatedHeight = dimensions.height > 0 
        ? Math.floor((dimensions.height - totalGapHeight) / fixedRows)
        : 200;
      
      return {
        columns: fixedColumns,
        rows: fixedRows,
        cardHeight: Math.max(80, calculatedHeight) // Minimum 80px
      };
    }
    
    // Automatisk modus - bruk eksisterende algoritme
    return calculateOptimalLayout(
      customerCount, 
      dimensions.height,
      dimensions.width,
      gap,
      minCardHeight,
      minCardWidth
    );
  }, [isFixedMode, fixedRows, fixedColumns, customerCount, dimensions.height, dimensions.width, gap, minCardHeight, minCardWidth]);

  // Bestem hvilke barn som skal vises
  const allChildren = React.Children.toArray(children);
  const displayedChildren = isFixedMode 
    ? allChildren.slice(0, capacity) 
    : allChildren;
  const overflowCount = isFixedMode 
    ? Math.max(0, allChildren.length - capacity) 
    : 0;

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
    >
      {dimensions.height > 0 && (
        <div 
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: `${gap}px`,
          }}
        >
          {displayedChildren.map((child, index) => (
            <div 
              key={index}
              style={{ 
                height: '100%',
                minHeight: isFixedMode ? undefined : `${minCardHeight}px`,
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
          
          {/* Overflow-indikator i siste celle når kunder ikke får plass */}
          {overflowCount > 0 && (
            <div 
              className="flex items-center justify-center rounded-lg border-2 border-dashed"
              style={{
                backgroundColor: 'hsl(var(--warning) / 0.1)',
                borderColor: 'hsl(var(--warning) / 0.5)',
              }}
            >
              <div className="flex flex-col items-center gap-1 text-center p-2">
                <AlertTriangle 
                  className="flex-shrink-0" 
                  style={{ 
                    width: Math.max(16, cardHeight * 0.15),
                    height: Math.max(16, cardHeight * 0.15),
                    color: 'hsl(var(--warning))'
                  }} 
                />
                <span 
                  className="font-medium"
                  style={{ 
                    fontSize: Math.max(12, cardHeight * 0.1),
                    color: 'hsl(var(--warning))'
                  }}
                >
                  +{overflowCount} {overflowCount === 1 ? 'kunde' : 'kunder'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoFitGrid;
