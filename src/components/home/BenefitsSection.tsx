
import React from 'react';
import { Shield, Zap, CheckCircle, Clock } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Pålitelig System",
      description: "Stabil plattform du kan stole på"
    },
    {
      icon: Zap,
      title: "Enkelt å Bruke",
      description: "Intuitivt grensesnitt for alle"
    },
    {
      icon: CheckCircle,
      title: "Komplett Løsning",
      description: "Alt du trenger på ett sted"
    },
    {
      icon: Clock,
      title: "Spar Tid",
      description: "Automatiser repetitive oppgaver"
    }
  ];

  return (
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
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
