import React, { useMemo, useState, useEffect } from 'react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface AutoFitGridProps {
  customerCount: number;
  settings: DisplaySettings | undefined;
  children: React.ReactNode;
}

interface OptimalLayout {
  columns: number;
  rows: number;
  cardMaxHeight: number;
}

const MIN_CARD_HEIGHT = 150;
const HEADER_HEIGHT = 120; // Header + stats
const FOOTER_HEIGHT = 80;  // Footer with connection status

const calculateOptimalLayout = (
  customerCount: number,
  screenHeight: number,
  screenWidth: number,
  contentPadding: number,
  gap: number
): OptimalLayout => {
  if (customerCount === 0) {
    return { columns: 3, rows: 1, cardMaxHeight: 300 };
  }

  // Available space
  const availableHeight = screenHeight - HEADER_HEIGHT - FOOTER_HEIGHT - (contentPadding * 2);
  const availableWidth = screenWidth - (contentPadding * 2);

  let bestColumns = 1;
  let bestCardHeight = MIN_CARD_HEIGHT;
  let bestRows = customerCount;

  // Try different column configurations (1-6)
  for (let cols = 1; cols <= 6; cols++) {
    const rows = Math.ceil(customerCount / cols);
    const totalGapHeight = (rows - 1) * gap;
    const totalGapWidth = (cols - 1) * gap;
    
    const cardHeight = (availableHeight - totalGapHeight) / rows;
    const cardWidth = (availableWidth - totalGapWidth) / cols;

    // Check if this configuration provides larger cards
    // Also ensure minimum width is reasonable (200px)
    if (cardHeight >= MIN_CARD_HEIGHT && cardWidth >= 200 && cardHeight > bestCardHeight) {
      bestColumns = cols;
      bestCardHeight = cardHeight;
      bestRows = rows;
    }
  }

  // If no valid configuration found, use fallback
  if (bestCardHeight < MIN_CARD_HEIGHT) {
    bestCardHeight = MIN_CARD_HEIGHT;
    bestRows = Math.ceil(customerCount / bestColumns);
  }

  return { 
    columns: bestColumns, 
    rows: bestRows,
    cardMaxHeight: Math.floor(bestCardHeight)
  };
};

const AutoFitGrid = ({ customerCount, settings, children }: AutoFitGridProps) => {
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1920, 
    height: typeof window !== 'undefined' ? window.innerHeight : 1080 
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Also listen for fullscreen changes
    document.addEventListener('fullscreenchange', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      document.removeEventListener('fullscreenchange', updateDimensions);
    };
  }, []);

  const contentPadding = settings?.shared_content_padding ?? 24;
  const gap = settings?.customer_cards_gap ?? 24;

  const { columns, cardMaxHeight } = useMemo(() => 
    calculateOptimalLayout(
      customerCount, 
      dimensions.height, 
      dimensions.width,
      contentPadding,
      gap
    ),
    [customerCount, dimensions.height, dimensions.width, contentPadding, gap]
  );

  return (
    <div 
      className="grid w-full"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT + contentPadding * 2}px)`,
        overflow: 'hidden'
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div 
          key={index}
          style={{ 
            maxHeight: `${cardMaxHeight}px`, 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, { 
                maxHeight: cardMaxHeight 
              })
            : child
          }
        </div>
      ))}
    </div>
  );
};

export default AutoFitGrid;
