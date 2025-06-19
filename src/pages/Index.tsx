
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, Users, BarChart3, Clock, CheckCircle, Shield, Zap } from 'lucide-react';
import { useCollisionDetection } from '@/hooks/useCollisionDetection';
import { GameOverlay } from '@/components/GameOverlay';
import { useAuthStore } from '@/stores/authStore';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    score,
    collectedItems,
    collisions
  } = useCollisionDetection();

  const features = [{
    icon: Package,
    title: "Smart Pakking",
    description: "Effektiv pakking med sanntidsovervåking og QR-kode system"
  }, {
    icon: Truck,
    title: "Levering & Logistikk",
    description: "Spor leveranser og administrer ruter enkelt"
  }, {
    icon: Users,
    title: "Kundeadministrasjon",
    description: "Komplett oversikt over kunder og deres bestillinger"
  }, {
    icon: BarChart3,
    title: "Rapporter",
    description: "Detaljerte rapporter og statistikk for bedre innsikt"
  }];

  // Replace mock stats with realistic feature highlights
  const benefits = [{
    icon: Shield,
    title: "Pålitelig System",
    description: "Stabil plattform du kan stole på"
  }, {
    icon: Zap,
    title: "Enkelt å Bruke",
    description: "Intuitivt grensesnitt for alle"
  }, {
    icon: CheckCircle,
    title: "Komplett Løsning",
    description: "Alt du trenger på ett sted"
  }, {
    icon: Clock,
    title: "Spar Tid",
    description: "Automatiser repetitive oppgaver"
  }];

  const handleLearnMore = () => {
    // Scroll to features section
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

  return <div className="min-h-screen">
      <GameOverlay score={score} collectedItems={collectedItems} collisions={collisions} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bread py-20 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Fallende brød og bakevarer animasjon - kun i hero section */}
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

        {/* Kjørende lastebil - i bunnen av hero section */}
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
            <img src="/lovable-uploads/3406f920-0e02-4d94-ae46-754d24d13db4.png" alt="Loaf & Load" className="h-64 w-auto animate-bread-rise" />
          </div>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Komplett pakking- og leveringssystem for moderne bakerier
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleLoginClick} className="bg-white text-bakery-brown hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              {user ? 'Gå til Dashboard' : 'Logg inn'}
            </Button>
            <Button variant="outline" size="lg" onClick={handleLearnMore} className="bg-white/20 backdrop-blur border-white text-white hover:bg-white hover:text-bakery-brown px-8 py-3 text-lg font-semibold">
              Les mer
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section - Replacing Mock Stats */}
      <section className="py-16 bg-bakery-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-bakery-brown mb-4">
              Hvorfor velge Loaf & Load?
            </h2>
            <p className="text-lg text-gray-600">
              Vi gjør bakeri-drift enklere og mer effektiv
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-lg bg-bakery-orange/10">
                    <benefit.icon className="h-8 w-8 text-bakery-orange" />
                  </div>
                </div>
                <div className="text-xl font-semibold text-bakery-brown mb-2">
                  {benefit.title}
                </div>
                <div className="text-sm text-gray-600">
                  {benefit.description}
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-bakery-brown mb-4">
              Alt du trenger for effektiv bakeri-drift
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fra bestilling til levering - vi forenkler hele prosessen med moderne teknologi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <Card key={index} className="group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg bg-bakery-orange/10 group-hover:bg-bakery-orange/20 transition-colors">
                      <feature.icon className="h-8 w-8 text-bakery-orange" />
                    </div>
                  </div>
                  <CardTitle className="text-bakery-brown">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-bakery-brown text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Klar til å modernisere ditt bakeri?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start med å utforske systemet vårt og se hvordan det kan hjelpe ditt bakeri
          </p>
          <Button size="lg" onClick={handleLoginClick} className="bg-bakery-orange hover:bg-bakery-orange-light text-white px-8 py-3 text-lg font-semibold">
            {user ? 'Gå til Dashboard' : 'Kom i gang i dag'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold">Loaf & Load</h3>
              <p className="text-gray-400">Bakeri pakking- og leveringssystem</p>
            </div>
            <div className="text-gray-400">
              © 2024 Loaf & Load. Alle rettigheter forbeholdt.
            </div>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
