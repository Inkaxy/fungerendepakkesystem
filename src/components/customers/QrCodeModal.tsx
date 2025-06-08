
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Customer } from '@/types/database';
import { QrCode, Copy, ExternalLink, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QrCodeModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleDisplay: (customer: Customer, hasDedicatedDisplay: boolean) => void;
  onCopyUrl: (displayPath: string) => void;
  onOpenUrl: (displayPath: string) => void;
}

const QrCodeModal = ({
  customer,
  isOpen,
  onClose,
  onToggleDisplay,
  onCopyUrl,
  onOpenUrl,
}: QrCodeModalProps) => {
  const [showQrCode, setShowQrCode] = useState(false);
  const { toast } = useToast();

  if (!customer) return null;

  const getDisplayPath = (customer: Customer) => {
    return customer.has_dedicated_display
      ? `/display/customer/${customer.id}`
      : '/display/shared';
  };

  const displayPath = getDisplayPath(customer);
  const fullUrl = `${window.location.origin}${displayPath}`;

  const generateQrCodeUrl = (url: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  };

  const handleShowQrCode = () => {
    setShowQrCode(!showQrCode);
  };

  const handleCopyUrl = () => {
    onCopyUrl(displayPath);
  };

  const handleOpenUrl = () => {
    onOpenUrl(displayPath);
  };

  const handleToggleDisplay = (checked: boolean) => {
    onToggleDisplay(customer, checked);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              Skjerminnstillinger for {customer.name}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Administrer dedikert skjerm for kunde #{customer.customer_number}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dedikert skjerm</p>
              <p className="text-sm text-muted-foreground">
                Aktiver individuell skjerm for denne kunden
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">
                {customer.has_dedicated_display ? 'Aktiv' : 'Inaktiv'}
              </span>
              <Switch
                checked={customer.has_dedicated_display}
                onCheckedChange={handleToggleDisplay}
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
            className="w-full bg-gray-800 hover:bg-gray-700"
            onClick={handleShowQrCode}
          >
            <QrCode className="w-4 h-4 mr-2" />
            {showQrCode ? 'Skjul QR-kode' : 'Vis QR-kode'}
          </Button>

          {showQrCode && (
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <img
                  src={generateQrCodeUrl(fullUrl)}
                  alt="QR-kode for display"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">
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
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeModal;
