
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
