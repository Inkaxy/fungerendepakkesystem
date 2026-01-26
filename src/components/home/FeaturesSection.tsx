
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, Users, BarChart3, QrCode, Bell, Shield, Clock } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Package,
      title: "Smart Pakking",
      description: "Effektiv pakking med sanntidsovervåking, produktgruppering og automatisk statusoppdatering",
      highlight: true
    },
    {
      icon: Truck,
      title: "Levering & Logistikk",
      description: "Spor leveranser, administrer ruter og gi kundene sanntidsinformasjon"
    },
    {
      icon: Users,
      title: "Kundeadministrasjon",
      description: "Komplett oversikt over kunder, deres bestillinger og leveringspreferanser"
    },
    {
      icon: BarChart3,
      title: "Rapporter & Innsikt",
      description: "Detaljerte rapporter med avviksregistrering og statistikk for bedre beslutninger"
    },
    {
      icon: QrCode,
      title: "QR-kode System",
      description: "Hver kunde får sin unike QR-kode for enkel tilgang til pakkestatus"
    },
    {
      icon: Bell,
      title: "Sanntidsvarsler",
      description: "Automatiske oppdateringer når bestillinger pakkes og sendes"
    },
    {
      icon: Shield,
      title: "Sikker & Pålitelig",
      description: "Rollebasert tilgangskontroll og sikker skylagring av alle data"
    },
    {
      icon: Clock,
      title: "Tidsbesparende",
      description: "Importer ordrer fra Excel og automatiser repetitive oppgaver"
    }
  ];

  return (
    <section id="features-section" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Funksjoner
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Alt du trenger for effektiv bakeri-drift
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Fra bestilling til levering - vi forenkler hele prosessen med moderne teknologi og intuitive verktøy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 hover:-translate-y-1 ${
                feature.highlight ? 'md:col-span-2 lg:col-span-1 ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-transparent' : ''
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    feature.highlight 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-primary/10 group-hover:bg-primary/20 transition-colors'
                  }`}>
                    <feature.icon className={`h-6 w-6 ${feature.highlight ? '' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-foreground mb-1">
                      {feature.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
