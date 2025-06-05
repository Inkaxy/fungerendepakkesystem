
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CollisionEffect {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

interface GameOverlayProps {
  score: number;
  collectedItems: number;
  collisions: CollisionEffect[];
}

export const GameOverlay = ({ score, collectedItems, collisions }: GameOverlayProps) => {
  return (
    <>
      {/* Score Display */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <Badge variant="default" className="bg-bakery-orange text-white px-4 py-2 text-lg font-bold">
          Score: {score}
        </Badge>
        <Badge variant="secondary" className="bg-bakery-brown text-white px-4 py-2">
          Collected: {collectedItems}
        </Badge>
      </div>

      {/* Collision Effects */}
      {collisions.map((collision) => (
        <div
          key={collision.id}
          className="fixed pointer-events-none z-40 animate-pulse"
          style={{
            left: collision.x - 15,
            top: collision.y - 15,
            animation: 'collectEffect 1s ease-out forwards'
          }}
        >
          <div className="text-2xl">✨</div>
          <div className="text-bakery-orange font-bold text-sm mt-1">+{Math.floor(Math.random() * 50) + 10}</div>
        </div>
      ))}
    </>
  );
};
