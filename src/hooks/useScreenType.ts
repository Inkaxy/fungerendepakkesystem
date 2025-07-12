import { useState, useEffect } from 'react';
import { ScreenType } from '@/hooks/useDisplaySettings';
import { getScreenSizeCategory } from '@/utils/screenSizeDetection';

export const useScreenType = (): ScreenType => {
  const [screenType, setScreenType] = useState<ScreenType>(() => {
    // Try to get from localStorage first
    const stored = localStorage.getItem('screen-type-override');
    if (stored && ['small', 'large'].includes(stored)) {
      return stored as ScreenType;
    }
    
    // Detect automatically
    const category = getScreenSizeCategory();
    return category === 'large' ? 'large' : 'small';
  });

  useEffect(() => {
    const handleResize = () => {
      // Only auto-detect if no manual override is set
      const override = localStorage.getItem('screen-type-override');
      if (!override) {
        const category = getScreenSizeCategory();
        const newType = category === 'large' ? 'large' : 'small';
        setScreenType(newType);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenType;
};

export const setScreenTypeOverride = (type: ScreenType | null) => {
  if (type === null) {
    localStorage.removeItem('screen-type-override');
  } else {
    localStorage.setItem('screen-type-override', type);
  }
  // Trigger resize to recalculate
  window.dispatchEvent(new Event('resize'));
};