
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Monitor, Maximize, Tv } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import HeaderSettingsCard from './shared/HeaderSettingsCard';
import StatisticsSettingsCard from './shared/StatisticsSettingsCard';
import CustomerCardsSettingsCard from './shared/CustomerCardsSettingsCard';
import ProductListSettingsCard from './shared/ProductListSettingsCard';
import BasketQuantitySettingsCard from './BasketQuantitySettingsCard';

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
      
      {/* Enhanced Features for Shared Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Avanserte felles display-innstillinger
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tilleggsfunksjoner for optimalisert brukeropplevelse på felles skjerm
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="hide-empty-customers">Skjul tomme kunder</Label>
                <p className="text-sm text-muted-foreground">
                  Kunder uten produkter for dagen vises ikke på felles skjerm
                </p>
              </div>
              <Switch
                id="hide-empty-customers"
                checked={settings.hide_empty_customers}
                onCheckedChange={(checked) => onUpdate({ hide_empty_customers: checked })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="show-delivery-indicators">Leveringsdato-indikatorer</Label>
                <p className="text-sm text-muted-foreground">
                  Vis merker for "I dag", "I morgen" osv. på kundekort
                </p>
              </div>
              <Switch
                id="show-delivery-indicators"
                checked={settings.show_delivery_date_indicators}
                onCheckedChange={(checked) => onUpdate({ show_delivery_date_indicators: checked })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-hide-completed">Auto-skjul ferdige kunder</Label>
                <p className="text-sm text-muted-foreground">
                  Skjul automatisk kunder som er 100% ferdige etter angitt tid
                </p>
              </div>
              <Switch
                id="auto-hide-completed"
                checked={settings.auto_hide_completed_customers}
                onCheckedChange={(checked) => onUpdate({ auto_hide_completed_customers: checked })}
              />
            </div>
          </div>

          {settings.auto_hide_completed_customers && (
            <div className="space-y-3">
              <Label htmlFor="auto-hide-timer">Auto-skjul timer (minutter)</Label>
              <Select 
                value={settings.auto_hide_completed_timer.toString()} 
                onValueChange={(value) => onUpdate({ auto_hide_completed_timer: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg tid" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutter</SelectItem>
                  <SelectItem value="10">10 minutter</SelectItem>
                  <SelectItem value="15">15 minutter</SelectItem>
                  <SelectItem value="30">30 minutter</SelectItem>
                  <SelectItem value="60">1 time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="customer-priority">Kunde-prioritering</Label>
            <Select 
              value={settings.customer_priority_mode} 
              onValueChange={(value) => onUpdate({ customer_priority_mode: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg prioritering" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ingen spesiell prioritering</SelectItem>
                <SelectItem value="delivery_date">Prioriter etter leveringsdato</SelectItem>
                <SelectItem value="progress">Prioriter etter fremgang</SelectItem>
                <SelectItem value="custom">Tilpasset prioritering</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Spesiell fargekoding eller sortering basert på prioritet
            </p>
          </div>
        </CardContent>
      </Card>

      <BasketQuantitySettingsCard settings={settings} onUpdate={onUpdate} />
    </div>
  );
};

export default SharedDisplaySettingsTab;
