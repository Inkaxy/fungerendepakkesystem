import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuthStore } from '@/stores/authStore';
import { Eye } from 'lucide-react';

interface DisplayPreviewPanelProps {
  settings: DisplaySettings;
  displayType: 'shared' | 'customer';
}

const DisplayPreviewPanel = ({ settings, displayType }: DisplayPreviewPanelProps) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [iframeKey, setIframeKey] = useState(0);
  
  const { data: customers } = useCustomers();
  const { profile } = useAuthStore();
  const bakeryId = profile?.bakery_id;
  
  // Filtrer kun kunder med dedikert display
  const customersWithDisplay = customers?.filter(c => c.has_dedicated_display && c.display_url) || [];

  // Generer iframe URL basert på valgt display type
  const getIframeUrl = () => {
    if (displayType === 'shared') {
      return bakeryId ? `/display/shared/${bakeryId}` : '/display/shared';
    }
    
    if (selectedCustomerId) {
      const customer = customers?.find(c => c.id === selectedCustomerId);
      if (customer?.display_url) {
        return `/display/${customer.display_url}`;
      }
    }
    
    return bakeryId ? `/display/shared/${bakeryId}` : '/display/shared';
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

  const displayLabel = displayType === 'shared' ? 'Delt visning' : 'Kundevisning';

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span className="text-sm">Forhåndsvisning ({displayLabel})</span>
        </div>

        {/* Customer Selector for customer display */}
        {displayType === 'customer' && customersWithDisplay.length > 0 && (
          <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
            <SelectTrigger className="w-48">
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
        )}
      </div>

      {/* Preview Card */}
      <Card className="overflow-hidden border-2 border-muted">
        <CardContent className="p-0">
          <div className="relative bg-muted/20" style={{ height: '400px' }}>
            {displayType === 'customer' && customersWithDisplay.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-sm">Ingen kunder med dedikert display ennå</p>
              </div>
            ) : (
              <iframe
                key={iframeKey}
                src={iframeUrl}
                className="w-full h-full border-0"
                title="Display Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Helper text */}
      <p className="text-center text-xs text-muted-foreground">
        Endringer vises umiddelbart i forhåndsvisningen
      </p>
    </div>
  );
};

export default DisplayPreviewPanel;
