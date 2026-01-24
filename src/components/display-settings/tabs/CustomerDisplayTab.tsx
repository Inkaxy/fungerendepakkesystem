import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { User, Package, TrendingUp, Layers, Sparkles, CheckCircle2, Accessibility, Maximize } from 'lucide-react';
import SettingsSection from '../SettingsSection';
import CustomerHeaderSection from '../sections/CustomerHeaderSection';
import CustomerProductSection from '../sections/CustomerProductSection';
import CustomerProgressSection from '../sections/CustomerProgressSection';
import CustomerProductColorsSection from '../sections/CustomerProductColorsSection';
import CustomerStatusColorsSection from '../sections/CustomerStatusColorsSection';
import CustomerCompletionSection from '../sections/CustomerCompletionSection';
import CustomerAccessibilitySection from '../sections/CustomerAccessibilitySection';
import CustomerLayoutSection from '../sections/CustomerLayoutSection';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerDisplayTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerDisplayTab = ({ settings, onUpdate }: CustomerDisplayTabProps) => {
  return (
    <Accordion type="multiple" defaultValue={['header', 'products']} className="space-y-3">
      <SettingsSection
        value="header"
        icon={User}
        iconColor="text-purple-600"
        bgColor="bg-purple-100"
        title="Kunde-header"
        description="Kundenavn, dato og leveringsinfo"
      >
        <CustomerHeaderSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="products"
        icon={Package}
        iconColor="text-orange-600"
        bgColor="bg-orange-100"
        title="Produktvisning"
        description="Layout, status-badges og fonter"
      >
        <CustomerProductSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="progress"
        icon={TrendingUp}
        iconColor="text-green-600"
        bgColor="bg-green-100"
        title="Status & Fremdrift"
        description="Fremdriftslinje, prosent og ikon"
      >
        <CustomerProgressSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="product-colors"
        icon={Layers}
        iconColor="text-pink-600"
        bgColor="bg-pink-100"
        title="Produktfarger"
        description="Farger for alternerende produktrader"
      >
        <CustomerProductColorsSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="status-colors"
        icon={Sparkles}
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        title="Status-farger"
        description="Farger for ulike pakkestatus"
      >
        <CustomerStatusColorsSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="completion"
        icon={CheckCircle2}
        iconColor="text-emerald-600"
        bgColor="bg-emerald-100"
        title="Fullført-visning"
        description="Melding, animasjon og lyd"
      >
        <CustomerCompletionSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="accessibility"
        icon={Accessibility}
        iconColor="text-teal-600"
        bgColor="bg-teal-100"
        title="Tilgjengelighet"
        description="Kontrast, touch-størrelse og bevegelse"
      >
        <CustomerAccessibilitySection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="layout"
        icon={Maximize}
        iconColor="text-indigo-600"
        bgColor="bg-indigo-100"
        title="Layout"
        description="Fullskjerm, padding og maksbredde"
      >
        <CustomerLayoutSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>
    </Accordion>
  );
};

export default CustomerDisplayTab;
