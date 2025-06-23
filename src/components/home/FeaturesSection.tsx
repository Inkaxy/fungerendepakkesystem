
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, Users, BarChart3 } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Package,
      title: "Smart Pakking",
      description: "Effektiv pakking med sanntidsovervåking og QR-kode system"
    },
    {
      icon: Truck,
      title: "Levering & Logistikk",
      description: "Spor leveranser og administrer ruter enkelt"
    },
    {
      icon: Users,
      title: "Kundeadministrasjon",
      description: "Komplett oversikt over kunder og deres bestillinger"
    },
    {
      icon: BarChart3,
      title: "Rapporter",
      description: "Detaljerte rapporter og statistikk for bedre innsikt"
    }
  ];

  return (
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
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
            >
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
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
