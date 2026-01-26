import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Type, Rainbow, Grid3X3, Sparkles, LayoutGrid, Zap, Bell } from 'lucide-react';
import SettingsSection from '../SettingsSection';
import SharedHeaderSection from '../sections/SharedHeaderSection';
import SharedStatsSection from '../sections/SharedStatsSection';
import SharedCustomerCardsSection from '../sections/SharedCustomerCardsSection';
import SharedAppearanceSection from '../sections/SharedAppearanceSection';
import SharedLayoutSection from '../sections/SharedLayoutSection';
import SharedAnimationSection from '../sections/SharedAnimationSection';
import SharedRealtimeSection from '../sections/SharedRealtimeSection';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedDisplayTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
  customerCount?: number;
}

const SharedDisplayTab = ({ settings, onUpdate, customerCount = 0 }: SharedDisplayTabProps) => {
  return (
    <Accordion type="multiple" defaultValue={['header']} className="space-y-2">
      <SettingsSection
        value="header"
        icon={Type}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Topptekst"
      >
        <SharedHeaderSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="stats"
        icon={Rainbow}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Statistikk-kort"
      >
        <SharedStatsSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="customer-cards"
        icon={Grid3X3}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Kundekort"
      >
        <SharedCustomerCardsSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="appearance"
        icon={Sparkles}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Utseende"
      >
        <SharedAppearanceSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="layout"
        icon={LayoutGrid}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Layout & Scroll"
      >
        <SharedLayoutSection settings={settings} onUpdate={onUpdate} customerCount={customerCount} />
      </SettingsSection>

      <SettingsSection
        value="animation"
        icon={Zap}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Animasjoner"
      >
        <SharedAnimationSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="realtime"
        icon={Bell}
        iconColor="text-foreground"
        bgColor="bg-transparent"
        title="Sanntid & Status"
      >
        <SharedRealtimeSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>
    </Accordion>
  );
};

export default SharedDisplayTab;
