import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuthStore } from '@/stores/authStore';
import { Eye, AlertTriangle, Loader2 } from 'lucide-react';

interface DisplayPreviewPanelProps {
  settings: DisplaySettings;
  displayType: 'shared' | 'customer';
}

const DisplayPreviewPanel = ({ settings, displayType }: DisplayPreviewPanelProps) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeError, setIframeError] = useState(false);
  
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { profile, isLoading: profileLoading } = useAuthStore();
  const bakeryId = profile?.bakery_id;
  
  // Filtrer kun kunder med dedikert display
  const customersWithDisplay = customers?.filter(c => c.has_dedicated_display && c.display_url) || [];

  // Generer iframe URL basert på valgt display type - alltid med demo=true for forhåndsvisning
  // Bruker bakeryId midlertidig - i prod vil dette være short_id
  const getIframeUrl = (): string | null => {
    if (!bakeryId) return null;
    
    if (displayType === 'shared') {
      return `/s/${bakeryId}?demo=true`;
    }
    
    if (selectedCustomerId) {
      const customer = customers?.find(c => c.id === selectedCustomerId);
      if (customer?.display_url) {
        return `/d/${customer.display_url}?demo=true`;
      }
    }
    
    // Fallback til shared med demo
    return `/s/${bakeryId}?demo=true`;
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
    setIframeError(false);
    setIframeKey(prev => prev + 1);
  }, [settings]);

  const handleIframeError = () => {
    setIframeError(true);
  };

  const displayLabel = displayType === 'shared' ? 'Delt visning' : 'Kundevisning';
  const isLoading = profileLoading || customersLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span className="text-sm">Forhåndsvisning ({displayLabel})</span>
        </div>
        <Card className="overflow-hidden border-2 border-muted">
          <CardContent className="p-0">
            <div className="flex items-center justify-center h-[400px] bg-muted/20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No bakeryId state
  if (!bakeryId) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span className="text-sm">Forhåndsvisning ({displayLabel})</span>
        </div>
        <Card className="overflow-hidden border-2 border-muted">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center h-[400px] bg-muted/20 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mb-4 text-destructive/70" />
              <p className="text-sm">Kan ikke vise forhåndsvisning</p>
              <p className="text-xs mt-1">Bakeri-informasjon mangler</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            ) : iframeError ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mb-4 text-destructive/70" />
                <p className="text-sm">Kunne ikke laste forhåndsvisning</p>
                <button 
                  onClick={() => { setIframeError(false); setIframeKey(prev => prev + 1); }}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Prøv igjen
                </button>
              </div>
            ) : iframeUrl ? (
              <iframe
                key={iframeKey}
                src={iframeUrl}
                className="w-full h-full border-0"
                title="Display Preview"
                onError={handleIframeError}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-sm">Ingen forhåndsvisning tilgjengelig</p>
              </div>
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
