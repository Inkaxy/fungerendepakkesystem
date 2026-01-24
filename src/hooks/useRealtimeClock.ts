import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

export const useRealtimeClock = (enabled: boolean = true) => {
  const [time, setTime] = useState(() => format(new Date(), 'HH:mm:ss'));

  useEffect(() => {
    if (!enabled) return;

    const updateTime = () => {
      setTime(format(new Date(), 'HH:mm:ss'));
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  return time;
};
