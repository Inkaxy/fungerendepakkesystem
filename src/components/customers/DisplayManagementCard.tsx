
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Users, Copy, ExternalLink, Settings, BarChart3, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DisplayManagementCard = () => {
  const { toast } = useToast();

  const copySharedDisplayUrl = () => {
    const fullUrl = `${window.location.origin}/dashboard/display/shared`;
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: "URL kopiert",
      description: "Felles display-URL er kopiert til utklippstavlen",
    });
  };

  const openSharedDisplayUrl = () => {
    const fullUrl = `${window.location.origin}/dashboard/display/shared`;
    window.open(fullUrl, '_blank');
  };

  return (
    <Card className="border-2 border-gradient-to-r from-blue-200 to-indigo-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Display Kontrollsenter</CardTitle>
              <CardDescription>
                Moderne løsning for kunde-displays
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Zap className="w-3 h-3 mr-1" />
            Neste generasjon
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shared Display Section */}
        <div className="p-4 bg-white/70 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Felles Display</h3>
              <Badge variant="outline" className="text-xs">
                Primær visning
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copySharedDisplayUrl}
                className="h-8"
              >
                <Copy className="w-3 h-3 mr-1" />
                Kopier URL
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openSharedDisplayUrl}
                className="h-8"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Forhåndsvis
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Hovedvisning for alle kunder uten privat display. Optimalisert for oversikt og effektivitet.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">24/7</div>
              <div className="text-xs text-blue-500">Tilgjengelighet</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">∞</div>
              <div className="text-xs text-green-500">Kunder støttet</div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Fremtidige Funksjoner</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-purple-700">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>AI-drevet tilpasning</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>Sanntids analytikk</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>Avanserte integrasjoner</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Avanserte innstillinger
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <BarChart3 className="w-3 h-3 mr-1" />
            Visningsstatistikk
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayManagementCard;
