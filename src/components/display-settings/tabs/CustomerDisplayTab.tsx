import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { TrendingUp, Palette, CheckCircle2 } from 'lucide-react';
import SettingsSection from '../SettingsSection';
import CustomerProgressSection from '../sections/CustomerProgressSection';
import CustomerStatusColorsSection from '../sections/CustomerStatusColorsSection';
import CustomerCompletionSection from '../sections/CustomerCompletionSection';
import type { DisplaySettings } from '@/types/displaySettings';

interface CustomerDisplayTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const CustomerDisplayTab = ({ settings, onUpdate }: CustomerDisplayTabProps) => {
  return (
    <Accordion type="multiple" defaultValue={['completion']} className="space-y-2">
      <SettingsSection
        value="progress"
        icon={TrendingUp}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Fremgangslinje"
      >
        <CustomerProgressSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="status-colors"
        icon={Palette}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Statusfarger"
      >
        <CustomerStatusColorsSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="completion"
        icon={CheckCircle2}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Fullføring"
      >
        <CustomerCompletionSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>
    </Accordion>
  );
};

export default CustomerDisplayTab;
