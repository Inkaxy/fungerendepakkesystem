
import React from 'react';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">Loaf & Load</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md mb-6">
              Profesjonelt pakking- og leveringssystem designet spesielt for moderne bakerier. 
              Effektiviser driften og gi kundene en bedre opplevelse.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Hurtiglenker</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features-section" className="text-muted-foreground hover:text-primary transition-colors">
                  Funksjoner
                </a>
              </li>
              <li>
                <a href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Logg inn
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Dokumentasjon
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontakt</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>hei@loafandload.no</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+47 123 45 678</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Oslo, Norge</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Loaf & Load. Alle rettigheter forbeholdt.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Personvern
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Vilkår
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
