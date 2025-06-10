
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface CollisionEffect {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

interface CatGameOverlayProps {
  settings?: DisplaySettings;
  score?: number;
  collectedItems?: number;
  collisions?: CollisionEffect[];
}

export const CatGameOverlay = ({ 
  settings, 
  score = 0, 
  collectedItems = 0, 
  collisions = [] 
}: CatGameOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (settings?.enable_cat_animations) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [settings?.enable_cat_animations]);

  if (!isVisible || !settings?.enable_cat_animations) {
    return null;
  }

  const animationSpeed = settings.cat_animation_speed || 'normal';
  const speedClass = animationSpeed === 'slow' ? 'duration-slow' : 
                     animationSpeed === 'fast' ? 'duration-fast' : 'duration-normal';

  return (
    <>
      {/* Score Display with Cat Theme */}
      {(score > 0 || collectedItems > 0) && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          <Badge variant="default" className="bg-orange-500 text-white px-4 py-2 text-lg font-bold">
            🐾 Score: {score}
          </Badge>
          <Badge variant="secondary" className="bg-amber-600 text-white px-4 py-2">
            😸 Cats: {collectedItems}
          </Badge>
        </div>
      )}

      {/* Cat Collision Effects */}
      {collisions.map((collision) => (
        <div
          key={collision.id}
          className="fixed pointer-events-none z-40"
          style={{
            left: collision.x - 20,
            top: collision.y - 20,
            animation: 'catCollectEffect 1s ease-out forwards'
          }}
        >
          <div className="text-3xl">💖</div>
          <div className="text-orange-500 font-bold text-sm mt-1">
            Mjau! +{Math.floor(Math.random() * 100) + 50}
          </div>
        </div>
      ))}

      {/* Running Cats */}
      {settings.show_running_cats && (
        <div 
          className={`animate-cat-run ${speedClass}`}
          style={{
            animationDuration: settings.cat_animation_speed === 'slow' ? '20s' : 
                              settings.cat_animation_speed === 'fast' ? '8s' : '15s'
          }}
        >
          🐱
        </div>
      )}
      
      {/* Bouncing Cats */}
      {settings.show_bouncing_cats && (
        <>
          <div 
            className={`animate-cat-bounce ${speedClass}`}
            style={{ 
              position: 'absolute', 
              left: '10%', 
              top: '20%',
              animationDelay: '0s',
              animationDuration: settings.cat_animation_speed === 'slow' ? '3s' : 
                                settings.cat_animation_speed === 'fast' ? '1s' : '1.5s'
            }}
          >
            😺
          </div>
          <div 
            className={`animate-cat-bounce ${speedClass}`}
            style={{ 
              position: 'absolute', 
              right: '15%', 
              top: '30%',
              animationDelay: '0.5s',
              animationDuration: settings.cat_animation_speed === 'slow' ? '3s' : 
                                settings.cat_animation_speed === 'fast' ? '1s' : '1.5s'
            }}
          >
            😸
          </div>
          <div 
            className={`animate-cat-bounce ${speedClass}`}
            style={{ 
              position: 'absolute', 
              left: '50%', 
              top: '40%',
              animationDelay: '1s',
              animationDuration: settings.cat_animation_speed === 'slow' ? '3s' : 
                                settings.cat_animation_speed === 'fast' ? '1s' : '1.5s'
            }}
          >
            😻
          </div>
        </>
      )}

      {/* Falling Cats */}
      {settings.show_falling_cats && (
        <>
          {[...Array(6)].map((_, i) => (
            <div
              key={`falling-cat-${i}`}
              className={`animate-cat-fall ${speedClass}`}
              style={{
                position: 'absolute',
                left: `${10 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: settings.cat_animation_speed === 'slow' ? '8s' : 
                                  settings.cat_animation_speed === 'fast' ? '3s' : '5s'
              }}
            >
              {['🐱', '😺', '😸', '😻', '🙀', '😿'][i]}
            </div>
          ))}
        </>
      )}
    </>
  );
};
