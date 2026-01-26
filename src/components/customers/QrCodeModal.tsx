
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Customer } from '@/types/database';
import { QrCode, Copy, ExternalLink, X, Loader2 } from 'lucide-react';
import { getDisplayPath, getDisplayUrl, generateQrCodeUrl } from '@/utils/displayUtils';
import { cn } from '@/lib/utils';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuthStore } from '@/stores/authStore';

interface QrCodeModalProps {
  customerId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleDisplay: (customer: Customer, hasDedicatedDisplay: boolean) => void;
  onCopyUrl: (displayPath: string) => void;
  onOpenUrl: (displayPath: string) => void;
}

const QrCodeModal = ({
  customerId,
  isOpen,
  onClose,
  onToggleDisplay,
  onCopyUrl,
  onOpenUrl,
}: QrCodeModalProps) => {
  const [showQrCode, setShowQrCode] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  
  // Hent bakeryId fra auth store - ALLTID kall hooks først
  const { profile } = useAuthStore();
  const bakeryId = profile?.bakery_id;
  
  // Hent customer-data fra React Query cache
  const { data: customers } = useCustomers();
  const customer = customers?.find(c => c.id === customerId);

  // Beregn displayPath og fullUrl - bruk bakeryId for shared display
  const displayPath = customer ? getDisplayPath(customer, bakeryId || undefined) : '';
  const fullUrl = customer ? getDisplayUrl(customer, bakeryId || undefined) : '';

  const handleShowQrCode = () => {
    setShowQrCode(!showQrCode);
  };

  const handleCopyUrl = () => {
    if (displayPath) onCopyUrl(displayPath);
  };

  const handleOpenUrl = () => {
    if (displayPath) onOpenUrl(displayPath);
  };

  // Early return ETTER alle hooks er kalt
  if (!customer) return null;

  const handleToggleDisplay = async (checked: boolean) => {
    setIsToggling(true);
    try {
      await onToggleDisplay(customer, checked);
    } finally {
      setTimeout(() => setIsToggling(false), 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            Skjerminnstillinger for {customer.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Administrer dedikert skjerm for kunde #{customer.customer_number}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 transition-all duration-200">
            <div>
              <p className="font-medium">Dedikert skjerm</p>
              <p className="text-sm text-muted-foreground">
                Aktiver individuell skjerm for denne kunden
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={cn(
                "text-sm font-medium transition-all duration-300 ease-out",
                customer.has_dedicated_display 
                  ? "text-green-600 animate-fade-in" 
                  : "text-gray-500 animate-fade-in",
                isToggling && "animate-pulse"
              )}>
                {isToggling ? (
                  <Loader2 className="w-4 h-4 animate-spin inline" />
                ) : (
                  customer.has_dedicated_display ? 'Aktiv' : 'Inaktiv'
                )}
              </span>
              <Switch
                checked={customer.has_dedicated_display}
                onCheckedChange={handleToggleDisplay}
                disabled={isToggling}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Skjerm URL</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 text-xs bg-muted px-3 py-2 rounded border font-mono">
                {fullUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCopyUrl}
            >
              <Copy className="w-4 h-4 mr-2" />
              Kopier URL
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleOpenUrl}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Åpne skjerm
            </Button>
          </div>

          <Button
            variant="default"
            className="w-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
            onClick={handleShowQrCode}
          >
            <QrCode className="w-4 h-4 mr-2 transition-transform duration-300" />
            {showQrCode ? 'Skjul QR-kode' : 'Vis QR-kode'}
          </Button>

          {showQrCode && (
            <div className="flex flex-col items-center space-y-4 animate-fade-in">
              <div className="p-4 bg-white rounded-lg border animate-scale-in">
                <img
                  src={generateQrCodeUrl(fullUrl)}
                  alt="QR-kode for display"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-xs text-center text-muted-foreground animate-fade-in">
                Scan QR-koden for å åpne display-siden
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>QR-koden kan scannes for enkel tilgang til skjermen</li>
              <li>Skjermen viser real-time status for kundens ordrer</li>
              <li>URL kan deles direkte med kunden</li>
              <li>Automatisk oppdatering hvert 30. sekund</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeModal;
