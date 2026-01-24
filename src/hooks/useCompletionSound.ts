import { useEffect, useRef } from 'react';

export const useCompletionSound = (
  isCompleted: boolean, 
  enabled: boolean = true
) => {
  const hasPlayedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset when not completed
    if (!isCompleted) {
      hasPlayedRef.current = false;
      return;
    }

    // Only play once when transitioning to completed
    if (isCompleted && enabled && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      
      // Create audio element with a pleasant completion sound
      try {
        // Use Web Audio API for a simple beep sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create a pleasant "success" sound
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // First note
        oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator1.type = 'sine';
        
        // Second note (harmony)
        oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
        oscillator2.type = 'sine';
        
        // Fade out
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.5);
        oscillator2.stop(audioContext.currentTime + 0.5);
        
        console.log('🔊 Completion sound played');
      } catch (error) {
        console.warn('Could not play completion sound:', error);
      }
    }
  }, [isCompleted, enabled]);

  return { hasPlayed: hasPlayedRef.current };
};
