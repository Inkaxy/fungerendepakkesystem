
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CollisionEffect {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

interface CatGameOverlayProps {
  score: number;
  collectedItems: number;
  collisions: CollisionEffect[];
}

export const CatGameOverlay = ({ score, collectedItems, collisions }: CatGameOverlayProps) => {
  return (
    <>
      {/* Score Display with Cat Theme */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <Badge variant="default" className="bg-orange-500 text-white px-4 py-2 text-lg font-bold">
          🐾 Score: {score}
        </Badge>
        <Badge variant="secondary" className="bg-amber-600 text-white px-4 py-2">
          😸 Cats: {collectedItems}
        </Badge>
      </div>

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
          <div className="text-orange-500 font-bold text-sm mt-1">Mjau! +{Math.floor(Math.random() * 100) + 50}</div>
        </div>
      ))}

      {/* Running Cats */}
      <div className="animate-cat-run">🐱</div>
      
      {/* Bouncing Cats */}
      <div className="animate-cat-bounce cat-bounce-1">😺</div>
      <div className="animate-cat-bounce cat-bounce-2">😸</div>
      <div className="animate-cat-bounce cat-bounce-3">😻</div>
      <div className="animate-cat-bounce cat-bounce-4">🙀</div>

      {/* Falling Cats */}
      <div className="animate-cat-fall cat-1">🐱</div>
      <div className="animate-cat-fall cat-2">😺</div>
      <div className="animate-cat-fall cat-3">😸</div>
      <div className="animate-cat-fall cat-4">😻</div>
      <div className="animate-cat-fall cat-5">🙀</div>
      <div className="animate-cat-fall cat-6">😿</div>
      <div className="animate-cat-fall cat-7">😾</div>
      <div className="animate-cat-fall cat-8">🐈</div>
    </>
  );
};
