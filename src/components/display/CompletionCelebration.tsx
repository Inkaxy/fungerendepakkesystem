import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CompletionCelebrationProps {
  truckImageUrl?: string;
  compact?: boolean;
  loop?: boolean;
}

interface BreadItem {
  id: number;
  emoji: string;
  loaded: boolean;
}

export const CompletionCelebration = ({ 
  truckImageUrl = '/lovable-uploads/37c33860-5f09-44ea-a64c-a7e7fb7c925b.png',
  compact = true,
  loop = true
}: CompletionCelebrationProps) => {
  const breadEmojis = ['🍞', '🥖', '🥐', '🥯', '🥨', '🧈', '🍰', '🥧'];
  const [breads, setBreads] = useState<BreadItem[]>(
    breadEmojis.map((emoji, id) => ({ id, emoji, loaded: false }))
  );
  const [currentBreadIndex, setCurrentBreadIndex] = useState(0);
  const [workerState, setWorkerState] = useState<'idle' | 'walking-to-bread' | 'picking' | 'carrying' | 'loading' | 'waving'>('idle');
  const [showFarewellMessage, setShowFarewellMessage] = useState(false);
  const [truckLeaving, setTruckLeaving] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Start loading sequence
  useEffect(() => {
    const loadingSequence = async () => {
      // Reset states
      setBreads(breadEmojis.map((emoji, id) => ({ id, emoji, loaded: false })));
      setShowFarewellMessage(false);
      setTruckLeaving(false);
      
      // Wait 0.5s before starting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      for (let i = 0; i < breadEmojis.length; i++) {
        setCurrentBreadIndex(i);
        
        // Walk to bread
        setWorkerState('walking-to-bread');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Pick up bread
        setWorkerState('picking');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Carry to truck
        setWorkerState('carrying');
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Load bread
        setWorkerState('loading');
        setBreads(prev => prev.map(b => 
          b.id === i ? { ...b, loaded: true } : b
        ));
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // All bread loaded - wave goodbye
      setWorkerState('waving');
      setShowFarewellMessage(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Truck drives away
      setTruckLeaving(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Restart animation if loop is enabled
      if (loop) {
        setAnimationKey(prev => prev + 1);
      }
    };
    
    loadingSequence();
  }, [animationKey, loop]);

  const workerEmoji = workerState === 'carrying' ? '🚶‍♂️🥖' : 
                      workerState === 'waving' ? '👋🧑‍🍳' : 
                      '🚶‍♂️';

  const workerTransform = workerState === 'walking-to-bread' || workerState === 'picking' 
    ? 'translateX(-120px)' 
    : 'translateX(0)';

  return (
    <Card className="loaf-load-container">
      <CardContent className="p-6 relative w-full h-full">
        {/* Header message */}
        <div className="completion-message">
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            🎉 FERDIG PAKKET! 🎉
          </h2>
          <p className="text-xl text-gray-700">
            {showFarewellMessage ? '✅ Alt lastet - klar for levering!' : 'Laster inn varene...'}
          </p>
        </div>

        {/* Bread pile (left side) */}
        <div className="bread-pile">
          {breads.map((bread) => (
            <div
              key={bread.id}
              className={`bread-item ${bread.loaded ? 'loaded' : ''}`}
              style={{
                opacity: bread.loaded ? 0 : 1
              }}
            >
              {bread.emoji}
            </div>
          ))}
        </div>

        {/* Worker */}
        <div 
          className={`worker-character ${workerState === 'carrying' ? 'carrying' : ''} ${workerState === 'waving' ? 'waving' : ''}`}
          style={{
            transform: `translateX(-50%) ${workerTransform}`
          }}
        >
          {workerEmoji}
        </div>

        {/* Truck (right side) */}
        <div className={`truck-vehicle ${truckLeaving ? 'driving-away' : ''}`}>
          <img 
            src={truckImageUrl}
            alt="Varebil"
            className="w-full h-auto"
          />
        </div>
      </CardContent>
    </Card>
  );
};
