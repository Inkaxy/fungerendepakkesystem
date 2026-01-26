
import React from 'react';
import { useCollisionDetection } from '@/hooks/useCollisionDetection';
import { GameOverlay } from '@/components/GameOverlay';
import HeroSection from '@/components/home/HeroSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';

const Index = () => {
  const {
    score,
    collectedItems,
    collisions
  } = useCollisionDetection();

  return (
    <div className="min-h-screen bg-background">
      <GameOverlay score={score} collectedItems={collectedItems} collisions={collisions} />
      
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
