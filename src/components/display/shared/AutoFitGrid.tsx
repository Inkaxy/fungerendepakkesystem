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

const MIN_CARD_HEIGHT = 180;
const MIN_CARD_WIDTH = 250;

const calculateOptimalLayout = (
  customerCount: number,
  availableHeight: number,
  availableWidth: number,
  gap: number
): OptimalLayout => {
  if (customerCount === 0 || availableHeight <= 0 || availableWidth <= 0) {
    return { columns: 3, rows: 1, cardHeight: 300 };
  }

  let bestColumns = 1;
  let bestCardHeight = MIN_CARD_HEIGHT;
  let bestRows = customerCount;

  // Try different column configurations (1-6)
  for (let cols = 1; cols <= 6; cols++) {
    const rows = Math.ceil(customerCount / cols);
    const totalGapHeight = Math.max(0, rows - 1) * gap;
    const totalGapWidth = Math.max(0, cols - 1) * gap;
    
    const cardHeight = (availableHeight - totalGapHeight) / rows;
    const cardWidth = (availableWidth - totalGapWidth) / cols;

    // Check if this configuration provides usable card sizes
    if (cardHeight >= MIN_CARD_HEIGHT && cardWidth >= MIN_CARD_WIDTH && cardHeight > bestCardHeight) {
      bestColumns = cols;
      bestCardHeight = cardHeight;
      bestRows = rows;
    }
  }

  // Fallback: If no configuration gives MIN_CARD_HEIGHT, use minimum rows possible
  if (bestCardHeight < MIN_CARD_HEIGHT) {
    const maxRows = Math.max(1, Math.floor(availableHeight / (MIN_CARD_HEIGHT + gap)));
    const optimalRows = Math.max(1, Math.min(customerCount, maxRows));
    bestColumns = Math.ceil(customerCount / optimalRows);
    bestRows = optimalRows;
    bestCardHeight = Math.max(MIN_CARD_HEIGHT, (availableHeight - (optimalRows - 1) * gap) / optimalRows);
  }

  return { 
    columns: bestColumns, 
    rows: bestRows,
    cardHeight: Math.floor(bestCardHeight)
  };
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

  const { columns, cardHeight } = useMemo(() => 
    calculateOptimalLayout(
      customerCount, 
      dimensions.height,
      dimensions.width,
      gap
    ),
    [customerCount, dimensions.height, dimensions.width, gap]
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
                minHeight: `${MIN_CARD_HEIGHT}px`,
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
