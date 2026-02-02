import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { 
  User, 
  Layout, 
  TrendingUp, 
  Package, 
  Paintbrush,
  Palette, 
  PartyPopper, 
  Accessibility
} from 'lucide-react';
import SettingsSection from '../SettingsSection';
import CustomerHeaderSection from '../sections/CustomerHeaderSection';
import CustomerLayoutSection from '../sections/CustomerLayoutSection';
import CustomerProgressSection from '../sections/CustomerProgressSection';
import CustomerProductSection from '../sections/CustomerProductSection';
import CustomerProductColorsSection from '../sections/CustomerProductColorsSection';
import CustomerStatusColorsSection from '../sections/CustomerStatusColorsSection';
import CustomerCompletionSection from '../sections/CustomerCompletionSection';
import CustomerAccessibilitySection from '../sections/CustomerAccessibilitySection';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerDisplayTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerDisplayTab = ({ settings, onUpdate }: CustomerDisplayTabProps) => {
  return (
    <div className="space-y-4">
      {/* Quick info */}
      <div className="p-3 bg-accent border border-accent-foreground/10 rounded-lg text-sm text-accent-foreground">
        <strong>Kundevisning</strong> er skjermen som vises til én spesifikk kunde (nettbrett/skjerm hos kunden).
      </div>

      <Accordion type="multiple" defaultValue={['header', 'products']} className="space-y-2">
        {/* Header Settings */}
        <SettingsSection
          value="header"
          icon={User}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
          title="Kunde-header"
        >
          <CustomerHeaderSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        {/* Layout Settings */}
        <SettingsSection
          value="layout"
          icon={Layout}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
          title="Layout & Bakgrunn"
        >
          <CustomerLayoutSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        {/* Progress & Status */}
        <SettingsSection
          value="progress"
          icon={TrendingUp}
          iconColor="text-green-600"
          bgColor="bg-green-50"
          title="Fremdrift & Status"
        >
          <CustomerProgressSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        {/* Product Display */}
        <SettingsSection
          value="products"
          icon={Package}
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
          title="Produktvisning"
        >
          <CustomerProductSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        {/* Product Colors */}
        <SettingsSection
          value="product-colors"
          icon={Paintbrush}
          iconColor="text-pink-600"
          bgColor="bg-pink-50"
          title="Produktfarger"
        >
          <CustomerProductColorsSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        {/* Status Colors */}
        <SettingsSection
          value="status-colors"
          icon={Palette}
          iconColor="text-indigo-600"
          bgColor="bg-indigo-50"
          title="Statusfarger"
        >
          <CustomerStatusColorsSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        {/* Completion */}
        <SettingsSection
          value="completion"
          icon={PartyPopper}
          iconColor="text-yellow-600"
          bgColor="bg-yellow-50"
          title="Fullføring"
        >
          <CustomerCompletionSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        {/* Accessibility */}
        <SettingsSection
          value="accessibility"
          icon={Accessibility}
          iconColor="text-cyan-600"
          bgColor="bg-cyan-50"
          title="Tilgjengelighet & Animasjon"
        >
          <CustomerAccessibilitySection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>
      </Accordion>

      {/* Info Box */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start gap-2">
          <div className="text-primary mt-0.5">💡</div>
          <div>
            <p className="text-sm font-medium">Live oppdateringer</p>
            <p className="text-xs text-muted-foreground mt-1">
              Kunde-displayene oppdateres automatisk via websockets når pakking endres.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDisplayTab;
