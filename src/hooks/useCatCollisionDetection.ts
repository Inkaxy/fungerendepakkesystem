
import { useState, useEffect, useCallback } from 'react';

interface CatCollisionState {
  score: number;
  collectedItems: number;
  collisions: Array<{ id: string; x: number; y: number; timestamp: number }>;
}

export const useCatCollisionDetection = () => {
  const [collisionState, setCollisionState] = useState<CatCollisionState>({
    score: 0,
    collectedItems: 0,
    collisions: []
  });

  const checkCatCollisions = useCallback(() => {
    const runningCat = document.querySelector('.animate-cat-run');
    const fallingCats = document.querySelectorAll('.animate-cat-fall');
    const bouncingCats = document.querySelectorAll('.animate-cat-bounce');
    
    if (!runningCat) return;
    
    const runnerRect = runningCat.getBoundingClientRect();
    const runnerCenterX = runnerRect.left + runnerRect.width / 2;
    const runnerCenterY = runnerRect.top + runnerRect.height / 2;
    
    // Check collisions with falling cats
    fallingCats.forEach((cat, index) => {
      const catRect = cat.getBoundingClientRect();
      const catCenterX = catRect.left + catRect.width / 2;
      const catCenterY = catRect.top + catRect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(runnerCenterX - catCenterX, 2) + 
        Math.pow(runnerCenterY - catCenterY, 2)
      );
      
      // Collision detected (within 60px for cats)
      if (distance < 60 && !cat.classList.contains('collected')) {
        cat.classList.add('collected');
        
        const points = getCatPoints(cat.textContent || '🐱');
        
        setCollisionState(prev => ({
          score: prev.score + points,
          collectedItems: prev.collectedItems + 1,
          collisions: [
            ...prev.collisions,
            {
              id: `cat-collision-${Date.now()}-${index}`,
              x: catCenterX,
              y: catCenterY,
              timestamp: Date.now()
            }
          ]
        }));
        
        // Remove cat element after collection with longer delay for effect
        setTimeout(() => {
          cat.remove();
        }, 500);
      }
    });

    // Check collisions with bouncing cats (bonus points!)
    bouncingCats.forEach((cat, index) => {
      const catRect = cat.getBoundingClientRect();
      const catCenterX = catRect.left + catRect.width / 2;
      const catCenterY = catRect.top + catRect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(runnerCenterX - catCenterX, 2) + 
        Math.pow(runnerCenterY - catCenterY, 2)
      );
      
      // Collision detected with bouncing cat (bonus!)
      if (distance < 70 && !cat.classList.contains('collected')) {
        cat.classList.add('collected');
        
        const bonusPoints = getCatPoints(cat.textContent || '😺') * 2; // Double points for bouncing cats!
        
        setCollisionState(prev => ({
          score: prev.score + bonusPoints,
          collectedItems: prev.collectedItems + 1,
          collisions: [
            ...prev.collisions,
            {
              id: `bounce-cat-collision-${Date.now()}-${index}`,
              x: catCenterX,
              y: catCenterY,
              timestamp: Date.now()
            }
          ]
        }));
        
        // Temporarily hide the bouncing cat, then show it again
        setTimeout(() => {
          cat.classList.remove('collected');
        }, 2000);
      }
    });
  }, []);

  const getCatPoints = (catEmoji: string): number => {
    const catPointMap: { [key: string]: number } = {
      '🐱': 75,   // Basic cat
      '😺': 100,  // Happy cat
      '😸': 125,  // Grinning cat
      '😻': 150,  // Heart eyes cat
      '🙀': 200,  // Surprised cat (rare!)
      '😿': 50,   // Crying cat (lower points)
      '😾': 80,   // Pouting cat
      '🐈': 90,   // Cat face
    };
    return catPointMap[catEmoji] || 75;
  };

  useEffect(() => {
    const interval = setInterval(checkCatCollisions, 100);
    return () => clearInterval(interval);
  }, [checkCatCollisions]);

  // Clean up old collision effects
  useEffect(() => {
    const cleanup = setInterval(() => {
      setCollisionState(prev => ({
        ...prev,
        collisions: prev.collisions.filter(
          collision => Date.now() - collision.timestamp < 2000
        )
      }));
    }, 500);
    
    return () => clearInterval(cleanup);
  }, []);

  return collisionState;
};
