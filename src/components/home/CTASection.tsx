
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ArrowRight, CheckCircle } from 'lucide-react';

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

  const benefits = [
    "Enkel oppsett på under 5 minutter",
    "Ingen kredittkort nødvendig",
    "Full tilgang til alle funksjoner"
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-foreground via-foreground/95 to-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
          Kom i gang i dag
        </span>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background mb-6 leading-tight">
          Klar til å modernisere<br />ditt bakeri?
        </h2>
        
        <p className="text-xl text-background/70 mb-8 max-w-2xl mx-auto">
          Start med å utforske systemet vårt og se hvordan det kan effektivisere din daglige drift
        </p>

        {/* Benefits list */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-background/80">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <Button 
          size="lg" 
          onClick={handleLoginClick} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg font-semibold shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 group"
        >
          {user ? 'Gå til Dashboard' : 'Prøv gratis nå'}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="mt-6 text-sm text-background/50">
          Ingen binding • Avbryt når som helst
        </p>
      </div>
    </section>
  );
};

export default CTASection;
