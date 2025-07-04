import React, { useEffect, useState } from 'react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';

interface ProductTransitionAnimationProps {
  settings: DisplaySettings;
  isActive: boolean;
  onComplete: () => void;
}

const ProductTransitionAnimation = ({ settings, isActive, onComplete }: ProductTransitionAnimationProps) => {
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'shrinking' | 'collecting' | 'boosting' | 'sliding'>('idle');

  useEffect(() => {
    if (!isActive || !settings.enable_animations || !settings.product_change_animation) {
      onComplete();
      return;
    }

    const runAnimation = async () => {
      // Phase 1: Shrink and move products (300ms)
      setAnimationPhase('shrinking');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Phase 2: Collect in truck (200ms)
      setAnimationPhase('collecting');
      await new Promise(resolve => setTimeout(resolve, 200));

      // Phase 3: Truck boost (200ms)
      setAnimationPhase('boosting');
      await new Promise(resolve => setTimeout(resolve, 200));

      // Phase 4: Slide in new products (300ms)
      setAnimationPhase('sliding');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Complete
      setAnimationPhase('idle');
      onComplete();
    };

    runAnimation();
  }, [isActive, settings.enable_animations, settings.product_change_animation, onComplete]);

  if (!isActive || !settings.enable_animations || !settings.product_change_animation) {
    return null;
  }

  const animationDuration = settings.animation_speed === 'slow' ? '1.5s' : 
                            settings.animation_speed === 'fast' ? '0.7s' : '1s';

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Animation overlay */}
      <div 
        className="absolute inset-0"
        style={{
          '--animation-duration': animationDuration,
        } as React.CSSProperties}
      >
        {/* Truck boost effect */}
        {animationPhase === 'boosting' && settings.show_truck_icon && (
          <div className="fixed bottom-8 right-8">
            <div 
              className="text-4xl animate-pulse"
              style={{
                animation: `truckBoost ${animationDuration} ease-out`,
              }}
            >
              🚚
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTransitionAnimation;