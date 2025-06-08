
import React from 'react';
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
  if (!customer) return null;

  const getDisplayPath = (customer: Customer) => {
    return customer.has_dedicated_display
      ? `/display/customer/${customer.id}`
      : '/display/shared';
  };

  const displayPath = getDisplayPath(customer);

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
                onCheckedChange={(checked) => onToggleDisplay(customer, checked)}
              />
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Skjerm URL</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 text-xs bg-muted px-3 py-2 rounded border font-mono">
                {window.location.origin}{displayPath}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCopyUrl(displayPath)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onCopyUrl(displayPath)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Kopier URL
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenUrl(displayPath)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Åpne skjerm
            </Button>
          </div>

          <Button
            variant="default"
            className="w-full bg-gray-800 hover:bg-gray-700"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Vis QR-kode
          </Button>

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
