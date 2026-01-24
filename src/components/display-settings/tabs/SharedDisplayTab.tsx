import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Type, BarChart3, Grid3X3, List, Palette, Maximize, Zap } from 'lucide-react';
import SettingsSection from '../SettingsSection';
import SharedHeaderSection from '../sections/SharedHeaderSection';
import SharedStatsSection from '../sections/SharedStatsSection';
import SharedCustomerCardsSection from '../sections/SharedCustomerCardsSection';
import SharedProductListSection from '../sections/SharedProductListSection';
import SharedAppearanceSection from '../sections/SharedAppearanceSection';
import SharedLayoutSection from '../sections/SharedLayoutSection';
import SharedAnimationSection from '../sections/SharedAnimationSection';
import type { DisplaySettings } from '@/types/displaySettings';

interface SharedDisplayTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedDisplayTab = ({ settings, onUpdate }: SharedDisplayTabProps) => {
  return (
    <Accordion type="multiple" defaultValue={['header', 'stats']} className="space-y-3">
      <SettingsSection
        value="header"
        icon={Type}
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        title="Header og Titler"
        description="Hovedtittel, undertittel, logo og klokke"
      >
        <SharedHeaderSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="stats"
        icon={BarChart3}
        iconColor="text-green-600"
        bgColor="bg-green-100"
        title="Statistikk-kort"
        description="Oppsummeringskort med nøkkeltall"
      >
        <SharedStatsSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="customer-cards"
        icon={Grid3X3}
        iconColor="text-purple-600"
        bgColor="bg-purple-100"
        title="Kunde-kort Layout"
        description="Kolonner, høyde og sortering"
      >
        <SharedCustomerCardsSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="product-list"
        icon={List}
        iconColor="text-orange-600"
        bgColor="bg-orange-100"
        title="Produktliste"
        description="Produkter per kort og visningsstil"
      >
        <SharedProductListSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="appearance"
        icon={Palette}
        iconColor="text-pink-600"
        bgColor="bg-pink-100"
        title="Utseende"
        description="Bakgrunn, farger og kort-styling"
      >
        <SharedAppearanceSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="layout"
        icon={Maximize}
        iconColor="text-indigo-600"
        bgColor="bg-indigo-100"
        title="Layout & Fullskjerm"
        description="Fullskjerm, auto-scroll og padding"
      >
        <SharedLayoutSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>

      <SettingsSection
        value="animation"
        icon={Zap}
        iconColor="text-yellow-600"
        bgColor="bg-yellow-100"
        title="Animasjoner"
        description="Animasjoner og overganger"
      >
        <SharedAnimationSection settings={settings} onUpdate={onUpdate} />
      </SettingsSection>
    </Accordion>
  );
};

export default SharedDisplayTab;
