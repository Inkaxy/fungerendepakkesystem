import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuthStore } from '@/stores/authStore';
import { Users, User, ExternalLink } from 'lucide-react';

interface DisplayPreviewProps {
  settings: DisplaySettings;
}

const DisplayPreview = ({ settings }: DisplayPreviewProps) => {
  const [displayType, setDisplayType] = useState<'shared' | 'customer'>('shared');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [iframeKey, setIframeKey] = useState(0);
  
  const { data: customers } = useCustomers();
  const { profile } = useAuthStore();
  const bakeryId = profile?.bakery_id;
  
  // Filtrer kun kunder med dedikert display
  const customersWithDisplay = customers?.filter(c => c.has_dedicated_display && c.display_url) || [];

  // Generer iframe URL basert på valgt display type - alltid med demo=true for forhåndsvisning
  const getIframeUrl = () => {
    if (displayType === 'shared') {
      return bakeryId ? `/display/shared/${bakeryId}?demo=true` : null;
    }
    
    if (selectedCustomerId) {
      const customer = customers?.find(c => c.id === selectedCustomerId);
      if (customer?.display_url) {
        return `/display/${customer.display_url}?demo=true`;
      }
    }
    
    return bakeryId ? `/display/shared/${bakeryId}?demo=true` : null;
  };

  const iframeUrl = getIframeUrl();

  // Sett første kunde som default når type endres til customer
  useEffect(() => {
    if (displayType === 'customer' && customersWithDisplay.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId(customersWithDisplay[0].id);
    }
  }, [displayType, customersWithDisplay.length, selectedCustomerId]);

  // Force iframe refresh når settings endres (via key prop)
  useEffect(() => {
    setIframeKey(prev => prev + 1);
  }, [settings]);

  const handleOpenInNewTab = () => {
    window.open(iframeUrl, '_blank');
  };

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Live Forhåndsvisning</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Slik vil displayet se ut med nåværende innstillinger
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Åpne
            </Button>
          </div>

          {/* Display Type Toggle */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={displayType === 'shared' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDisplayType('shared')}
              className="gap-2 flex-1"
            >
              <Users className="h-4 w-4" />
              Felles Display
            </Button>
            <Button
              variant={displayType === 'customer' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDisplayType('customer')}
              className="gap-2 flex-1"
              disabled={customersWithDisplay.length === 0}
            >
              <User className="h-4 w-4" />
              Kunde-Display
            </Button>
          </div>

          {/* Customer Selector */}
          {displayType === 'customer' && customersWithDisplay.length > 0 && (
            <div className="mt-3">
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg kunde" />
                </SelectTrigger>
                <SelectContent>
                  {customersWithDisplay.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {displayType === 'customer' && customersWithDisplay.length === 0 && (
            <p className="text-sm text-muted-foreground mt-3 text-center py-2 bg-muted rounded-md">
              Ingen kunder med dedikert display ennå
            </p>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <div className="relative bg-muted/30 rounded-b-lg overflow-hidden" style={{ height: '700px' }}>
            {iframeUrl ? (
              <iframe
                key={iframeKey}
                src={iframeUrl}
                className="w-full h-full border-0"
                title="Display Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Laster forhåndsvisning...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayPreview;
