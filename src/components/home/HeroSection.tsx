
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

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
    <section className="relative overflow-hidden gradient-bread py-20 px-4">
      <div className="absolute inset-0 bg-black/10"></div>
      
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
            className="h-20 w-auto"
          />
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto text-center z-30">
        <div className="mb-8 flex justify-center">
          <img 
            src="/lovable-uploads/3406f920-0e02-4d94-ae46-754d24d13db4.png" 
            alt="Loaf & Load" 
            className="h-64 w-auto animate-bread-rise" 
          />
        </div>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          Komplett pakking- og leveringssystem for moderne bakerier
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={handleLoginClick} 
            className="bg-white text-bakery-brown hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            {user ? 'Gå til Dashboard' : 'Logg inn'}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleLearnMore} 
            className="bg-white/20 backdrop-blur border-white text-white hover:bg-white hover:text-bakery-brown px-8 py-3 text-lg font-semibold"
          >
            Les mer
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
