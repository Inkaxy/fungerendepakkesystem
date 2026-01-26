import React from 'react';
import { Settings as SettingsIcon, Cloud, Bell, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
