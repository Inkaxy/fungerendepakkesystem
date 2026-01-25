import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { 
  User, 
  Layout, 
  TrendingUp, 
  Package, 
  Palette, 
  CheckCircle2, 
  Accessibility,
  Paintbrush
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
    <Accordion type="multiple" defaultValue={['header', 'products']} className="space-y-2">
      {/* Header Settings */}
      <SettingsSection
        value="header"
        icon={User}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Kunde-header"
      >
        <CustomerHeaderSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      {/* Layout Settings */}
      <SettingsSection
        value="layout"
        icon={Layout}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Layout"
      >
        <CustomerLayoutSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      {/* Progress & Status */}
      <SettingsSection
        value="progress"
        icon={TrendingUp}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Status & Fremdrift"
      >
        <CustomerProgressSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      {/* Product Display */}
      <SettingsSection
        value="products"
        icon={Package}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Produktvisning"
      >
        <CustomerProductSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      {/* Product Colors */}
      <SettingsSection
        value="product-colors"
        icon={Paintbrush}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Produktfarger"
      >
        <CustomerProductColorsSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      {/* Status Colors */}
      <SettingsSection
        value="status-colors"
        icon={Palette}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Statusfarger"
      >
        <CustomerStatusColorsSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      {/* Completion */}
      <SettingsSection
        value="completion"
        icon={CheckCircle2}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Fullføring"
      >
        <CustomerCompletionSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      {/* Accessibility */}
      <SettingsSection
        value="accessibility"
        icon={Accessibility}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Tilgjengelighet"
      >
        <CustomerAccessibilitySection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      {/* Info Box */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border mt-4">
        <div className="flex items-start gap-2">
          <div className="text-primary mt-0.5">💡</div>
          <div>
            <p className="text-sm font-medium">Live oppdateringer aktivert</p>
            <p className="text-xs text-muted-foreground mt-1">
              Kunde-displayene oppdateres automatisk via websockets - ingen forsinkelse!
            </p>
          </div>
        </div>
      </div>
    </Accordion>
  );
};

export default CustomerDisplayTab;
