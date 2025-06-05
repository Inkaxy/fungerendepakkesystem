
import { useState, useEffect, useCallback } from 'react';

interface CollisionState {
  score: number;
  collectedItems: number;
  collisions: Array<{ id: string; x: number; y: number; timestamp: number }>;
}

export const useCollisionDetection = () => {
  const [collisionState, setCollisionState] = useState<CollisionState>({
    score: 0,
    collectedItems: 0,
    collisions: []
  });

  const checkCollisions = useCallback(() => {
    const truck = document.querySelector('.animate-truck-drive');
    const breads = document.querySelectorAll('.animate-bread-fall');
    
    if (!truck) return;
    
    const truckRect = truck.getBoundingClientRect();
    const truckCenterX = truckRect.left + truckRect.width / 2;
    const truckCenterY = truckRect.top + truckRect.height / 2;
    
    breads.forEach((bread, index) => {
      const breadRect = bread.getBoundingClientRect();
      const breadCenterX = breadRect.left + breadRect.width / 2;
      const breadCenterY = breadRect.top + breadRect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(truckCenterX - breadCenterX, 2) + 
        Math.pow(truckCenterY - breadCenterY, 2)
      );
      
      // Collision detected (within 50px)
      if (distance < 50 && !bread.classList.contains('collected')) {
        bread.classList.add('collected');
        
        const points = getItemPoints(bread.textContent || '🍞');
        
        setCollisionState(prev => ({
          score: prev.score + points,
          collectedItems: prev.collectedItems + 1,
          collisions: [
            ...prev.collisions,
            {
              id: `collision-${Date.now()}-${index}`,
              x: breadCenterX,
              y: breadCenterY,
              timestamp: Date.now()
            }
          ]
        }));
        
        // Remove bread element after collection
        setTimeout(() => {
          bread.remove();
        }, 300);
      }
    });
  }, []);

  const getItemPoints = (item: string): number => {
    const pointMap: { [key: string]: number } = {
      '🍞': 10,
      '🥖': 15,
      '🥐': 20,
      '🧁': 30,
      '🥯': 15,
      '🥧': 50,
      '🍰': 100,
      '🥨': 25,
      '🍪': 20,
      '🍩': 35
    };
    return pointMap[item] || 10;
  };

  useEffect(() => {
    const interval = setInterval(checkCollisions, 100);
    return () => clearInterval(interval);
  }, [checkCollisions]);

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
