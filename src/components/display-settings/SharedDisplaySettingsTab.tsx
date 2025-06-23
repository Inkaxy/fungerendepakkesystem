
import React from 'react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import HeaderSettingsCard from './shared/HeaderSettingsCard';
import StatisticsSettingsCard from './shared/StatisticsSettingsCard';
import CustomerCardsSettingsCard from './shared/CustomerCardsSettingsCard';
import ProductListSettingsCard from './shared/ProductListSettingsCard';

interface SharedDisplaySettingsTabProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

const SharedDisplaySettingsTab = ({ settings, onUpdate }: SharedDisplaySettingsTabProps) => {
  return (
    <div className="space-y-6">
      <HeaderSettingsCard settings={settings} onUpdate={onUpdate} />
      <StatisticsSettingsCard settings={settings} onUpdate={onUpdate} />
      <CustomerCardsSettingsCard settings={settings} onUpdate={onUpdate} />
      <ProductListSettingsCard settings={settings} onUpdate={onUpdate} />
    </div>
  );
};

export default SharedDisplaySettingsTab;
