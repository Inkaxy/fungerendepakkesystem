
import React from 'react';
import { Shield, Zap, CheckCircle, Clock } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Pålitelig System",
      description: "Stabil plattform du kan stole på, med 99.9% oppetid"
    },
    {
      icon: Zap,
      title: "Enkelt å Bruke",
      description: "Intuitivt grensesnitt designet for travle hender"
    },
    {
      icon: CheckCircle,
      title: "Komplett Løsning",
      description: "Alt du trenger for pakking og levering på ett sted"
    },
    {
      icon: Clock,
      title: "Spar Tid",
      description: "Automatiser oppgaver og fokuser på det som betyr mest"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/50 to-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Fordeler
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hvorfor velge Loaf & Load?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi gjør bakeri-drift enklere og mer effektiv med moderne teknologi
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group text-center p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
