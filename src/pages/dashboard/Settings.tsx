import React from 'react';
import { Settings as SettingsIcon, Cloud } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Innstillinger</h1>
          <p className="text-muted-foreground">Administrer integrasjoner og automatiseringer</p>
        </div>
      </div>

      {/* OneDrive Setup Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Cloud className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <CardTitle>OneDrive Integrasjon</CardTitle>
              <CardDescription>
                Koble til Microsoft OneDrive for automatisk import av filer
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            OneDrive-integrasjon blir re-implementert. Kommer snart.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
