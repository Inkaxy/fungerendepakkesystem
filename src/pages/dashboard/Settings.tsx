import React from 'react';
import { Settings as SettingsIcon, Cloud, Bell, Palette, Tablet, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import OneDriveConnectionCard from '@/components/settings/OneDriveConnectionCard';
import PageHeader from '@/components/shared/PageHeader';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={SettingsIcon}
        title="Innstillinger"
        subtitle="Administrer integrasjoner og automatiseringer"
      />

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* Integrations Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Cloud className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Integrasjoner</h2>
          </div>
          
          <OneDriveConnectionCard />
        </div>

        {/* Tablet/MDM Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Tablet className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Nettbrett-administrasjon</h2>
          </div>
          
          <Card className="card-warm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base">Eksternt MDM-system</CardTitle>
                  <CardDescription>Koble til Headwind MDM eller ws-scrcpy for fjernkontroll</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mdm-url">Headwind MDM URL</Label>
                <Input 
                  id="mdm-url"
                  placeholder="https://mdm.dittbakeri.no" 
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  URL til ditt Headwind MDM-panel for enhetsadministrasjon
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scrcpy-url">ws-scrcpy URL</Label>
                <Input 
                  id="scrcpy-url"
                  placeholder="https://scrcpy.dittbakeri.no" 
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  URL til ws-scrcpy for fjernvisning og kontroll av nettbrett
                </p>
              </div>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Konfigurasjon av MDM-integrasjon kommer snart. 
                  Administrer nettbrett fra <a href="/dashboard/tablets" className="text-primary hover:underline">Nettbrett-siden</a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Future sections placeholder */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="card-warm opacity-60">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base">Varsler</CardTitle>
                  <CardDescription>Kommer snart</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Konfigurer e-post og push-varsler for ordrer og pakking.
              </p>
            </CardContent>
          </Card>

          <Card className="card-warm opacity-60">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base">Utseende</CardTitle>
                  <CardDescription>Kommer snart</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tilpass farger, logo og branding for ditt bakeri.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
