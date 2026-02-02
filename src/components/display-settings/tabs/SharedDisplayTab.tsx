import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { 
  Type, 
  BarChart3, 
  LayoutGrid, 
  Palette, 
  Maximize, 
  Zap, 
  RefreshCw 
} from 'lucide-react';
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
    <div className="space-y-4">
      {/* Quick info */}
      <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary">
        <strong>Delt visning</strong> er skjermen som viser pakkestatus for alle kunder på én felles skjerm (TV, storskjerm).
      </div>

      <Accordion type="multiple" defaultValue={['header', 'customer-cards']} className="space-y-2">
        <SettingsSection
          value="header"
          icon={Type}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
          title="Topptekst & Logo"
        >
          <SharedHeaderSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        <SettingsSection
          value="stats"
          icon={BarChart3}
          iconColor="text-green-600"
          bgColor="bg-green-50"
          title="Statistikk-kort"
        >
          <SharedStatsSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        <SettingsSection
          value="customer-cards"
          icon={LayoutGrid}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
          title="Kundekort"
        >
          <SharedCustomerCardsSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        <SettingsSection
          value="appearance"
          icon={Palette}
          iconColor="text-pink-600"
          bgColor="bg-pink-50"
          title="Farger & Utseende"
        >
          <SharedAppearanceSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        <SettingsSection
          value="layout"
          icon={Maximize}
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
          title="Skjermlayout"
        >
          <SharedLayoutSection settings={settings} onUpdate={onUpdate} customerCount={customerCount} />
        </SettingsSection>

        <SettingsSection
          value="animation"
          icon={Zap}
          iconColor="text-yellow-600"
          bgColor="bg-yellow-50"
          title="Animasjoner"
        >
          <SharedAnimationSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>

        <SettingsSection
          value="realtime"
          icon={RefreshCw}
          iconColor="text-cyan-600"
          bgColor="bg-cyan-50"
          title="Oppdatering & Synlighet"
        >
          <SharedRealtimeSection settings={settings} onUpdate={onUpdate} />
        </SettingsSection>
      </Accordion>
    </div>
  );
};

export default SharedDisplayTab;
