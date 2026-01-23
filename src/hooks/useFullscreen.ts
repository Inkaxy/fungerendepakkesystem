import { useState, useEffect, useCallback } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Fullscreen API is supported
    setIsSupported(document.fullscreenEnabled ?? false);
    
    // Set initial state
    setIsFullscreen(!!document.fullscreenElement);
    
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const enterFullscreen = useCallback(async () => {
    if (!document.fullscreenEnabled) {
      console.warn('Fullscreen API not supported');
      return;
    }
    
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Failed to exit fullscreen:', err);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return { 
    isFullscreen, 
    isSupported, 
    enterFullscreen, 
    exitFullscreen, 
    toggleFullscreen 
  };
};
