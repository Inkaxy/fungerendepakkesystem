import { useEffect, useRef, useState, useCallback } from 'react';

export const useWakeLock = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) {
      console.warn('⚠️ Wake Lock API er ikke støttet på denne enheten');
      return false;
    }

    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      setIsActive(true);
      console.log('✅ Wake Lock aktivert - skjermen vil ikke slukkes');

      wakeLockRef.current.addEventListener('release', () => {
        console.log('⚠️ Wake Lock ble released');
        setIsActive(false);
      });
      
      return true;
    } catch (err: any) {
      console.error('❌ Kunne ikke aktivere Wake Lock:', err.message);
      setIsActive(false);
      return false;
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setIsActive(false);
        console.log('✅ Wake Lock deaktivert');
      } catch (err: any) {
        console.error('❌ Kunne ikke deaktivere Wake Lock:', err.message);
      }
    }
  }, []);

  // Reaktiver wake lock når bruker kommer tilbake til tab
  useEffect(() => {
    if (!isSupported) return;
    
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) {
        console.log('👁️ Tab ble synlig - reaktiverer Wake Lock');
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSupported, requestWakeLock]);

  // Aktiver wake lock når komponenten mounter
  useEffect(() => {
    requestWakeLock();
    
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [requestWakeLock]);

  return {
    isSupported,
    isActive,
    requestWakeLock,
    releaseWakeLock,
  };
};
