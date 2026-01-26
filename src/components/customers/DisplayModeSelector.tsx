
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Monitor, Users, Copy, ExternalLink, Zap, Globe, Lock, Loader2 } from 'lucide-react';
import { Customer } from '@/types/database';
import { getDisplayPath, getSharedDisplayPath } from '@/utils/displayUtils';
import { cn } from '@/lib/utils';

interface DisplayModeSelectorProps {
  customer: Customer;
  bakeryId?: string;
  onToggleDisplay: (customer: Customer, hasDedicatedDisplay: boolean) => void;
  onCopyUrl: (url: string) => void;
  onOpenUrl: (url: string) => void;
}

const DisplayModeSelector = ({ 
  customer, 
  bakeryId,
  onToggleDisplay, 
  onCopyUrl, 
  onOpenUrl 
}: DisplayModeSelectorProps) => {
  const hasDedicatedDisplay = customer.has_dedicated_display || false;
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true);
    try {
      await onToggleDisplay(customer, checked);
    } finally {
      // Add a small delay for smooth animation completion
      setTimeout(() => setIsToggling(false), 300);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toggle Section */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 transition-all duration-200">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg transition-all duration-300 ease-out",
            hasDedicatedDisplay 
              ? "bg-green-100 text-green-600" 
              : "bg-blue-100 text-blue-600",
            isToggling && "animate-pulse"
          )}>
            {isToggling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : hasDedicatedDisplay ? (
              <Lock key="lock" className="w-4 h-4 animate-scale-in" />
            ) : (
              <Globe key="globe" className="w-4 h-4 animate-scale-in" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {hasDedicatedDisplay ? "Privat Display" : "Felles Display"}
            </p>
            <p className="text-sm text-gray-500">
              {hasDedicatedDisplay 
                ? "Eksklusiv visning for denne kunden" 
                : "Delt visning med andre kunder"}
            </p>
          </div>
        </div>
        <Switch
          checked={hasDedicatedDisplay}
          onCheckedChange={handleToggle}
          disabled={isToggling}
          className="data-[state=checked]:bg-green-500"
        />
      </div>

      {/* Display Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Shared Display Card */}
        <Card className={cn(
          "p-3 transition-all duration-300 ease-out cursor-pointer border-2",
          !hasDedicatedDisplay 
            ? "border-blue-500 bg-blue-50 shadow-md" 
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm active:scale-[0.98]"
        )}>
          <div className="flex items-start space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              !hasDedicatedDisplay ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
            )}>
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-sm">Felles Display</h4>
                {!hasDedicatedDisplay && (
                  <Badge variant="default" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Aktiv
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Kostnadseffektiv løsning med delte ressurser
              </p>
              {!hasDedicatedDisplay && bakeryId && (
                <div className="flex items-center space-x-1 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopyUrl(getSharedDisplayPath(bakeryId))}
                    className="h-6 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Kopier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenUrl(getSharedDisplayPath(bakeryId))}
                    className="h-6 text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Åpne
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Dedicated Display Card */}
        <Card className={cn(
          "p-3 transition-all duration-300 ease-out cursor-pointer border-2",
          hasDedicatedDisplay 
            ? "border-green-500 bg-green-50 shadow-md" 
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm active:scale-[0.98]"
        )}>
          <div className="flex items-start space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              hasDedicatedDisplay ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
            )}>
              <Monitor className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-sm">Privat Display</h4>
                {hasDedicatedDisplay && (
                  <Badge variant="default" className="text-xs bg-green-600">
                    <Zap className="w-3 h-3 mr-1" />
                    Aktiv
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Eksklusiv og tilpasset visning
              </p>
              {hasDedicatedDisplay && customer.display_url && (
                <div className="mt-2 space-y-1">
                  <code className="text-xs bg-white px-2 py-1 rounded border block truncate">
                    {getDisplayPath(customer, bakeryId)}
                  </code>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCopyUrl(getDisplayPath(customer, bakeryId))}
                      className="h-6 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Kopier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenUrl(getDisplayPath(customer, bakeryId))}
                      className="h-6 text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Åpne
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Future Features Teaser */}
      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
            <Zap className="w-3 h-3" />
          </div>
          <p className="text-xs text-purple-700 font-medium">
            Kommende: AI-drevet tilpasning, sanntidsanalyse og avanserte integrasjoner
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisplayModeSelector;
