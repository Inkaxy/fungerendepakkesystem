
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/80 py-24 px-4 min-h-[90vh] flex items-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
      </div>
      
      {/* Fallende brød og bakevarer animasjon */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="animate-bread-fall bread-1">🍞</div>
        <div className="animate-bread-fall bread-2">🥖</div>
        <div className="animate-bread-fall bread-3">🥐</div>
        <div className="animate-bread-fall bread-4">🧁</div>
        <div className="animate-bread-fall bread-5">🥯</div>
        <div className="animate-bread-fall bread-6">🥧</div>
        <div className="animate-bread-fall bread-7">🍰</div>
        <div className="animate-bread-fall bread-8">🥨</div>
        <div className="animate-bread-fall bread-9">🍪</div>
        <div className="animate-bread-fall bread-10">🍩</div>
      </div>

      {/* Kjørende lastebil */}
      <div className="absolute bottom-0 w-full pointer-events-none z-20">
        <div className="animate-truck-drive">
          <img 
            src="/lovable-uploads/c571ae09-9560-45aa-ac6e-6cf14306c1ec.png" 
            alt="Bread delivery truck" 
            className="h-24 w-auto drop-shadow-2xl"
          />
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto text-center z-30">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white/90">Profesjonelt pakkesystem for bakerier</span>
        </div>

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/lovable-uploads/3406f920-0e02-4d94-ae46-754d24d13db4.png" 
            alt="Loaf & Load" 
            className="h-48 md:h-64 w-auto animate-bread-rise drop-shadow-2xl" 
          />
        </div>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
          Komplett pakking- og leveringssystem for moderne bakerier
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={handleLoginClick} 
            className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 group"
          >
            {user ? 'Gå til Dashboard' : 'Kom i gang'}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleLearnMore} 
            className="bg-transparent backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-6 text-lg font-semibold transition-all duration-300"
          >
            Les mer om løsningen
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Sanntidsoppdateringer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Sikker datalagring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Norsk støtte</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
