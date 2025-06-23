
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const CTASection = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleLoginClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="py-20 bg-bakery-brown text-white">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold mb-6">
          Klar til å modernisere ditt bakeri?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Start med å utforske systemet vårt og se hvordan det kan hjelpe ditt bakeri
        </p>
        <Button 
          size="lg" 
          onClick={handleLoginClick} 
          className="bg-bakery-orange hover:bg-bakery-orange-light text-white px-8 py-3 text-lg font-semibold"
        >
          {user ? 'Gå til Dashboard' : 'Kom i gang i dag'}
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
