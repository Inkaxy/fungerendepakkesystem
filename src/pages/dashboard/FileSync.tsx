import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSyncSettingsCard } from '@/components/file-sync/FileSyncSettingsCard';
import { FileSyncLogsCard } from '@/components/file-sync/FileSyncLogsCard';
import { SyncScheduleCard } from '@/components/file-sync/SyncScheduleCard';
import { TestConnectionCard } from '@/components/file-sync/TestConnectionCard';
import { RefreshCw, Cloud, Settings, History } from 'lucide-react';

const FileSync = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Automatisk Filhenting</h1>
            <p className="text-muted-foreground">
              Konfigurer automatisk henting av filer fra OneDrive, Google Drive, FTP og andre tjenester
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Innstillinger</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center space-x-2">
            <Cloud className="h-4 w-4" />
            <span>Tidsplan</span>
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Test Tilkobling</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>Logg</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tjeneste-konfigurasjoner</CardTitle>
              <CardDescription>
                Konfigurer tilkoblinger til forskjellige fil-tjenester for automatisk henting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileSyncSettingsCard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Synkroniseringstidsplan</CardTitle>
              <CardDescription>
                Definer når automatisk filhenting skal kjøre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SyncScheduleCard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Tilkoblinger</CardTitle>
              <CardDescription>
                Test om tilkoblingene til dine fil-tjenester fungerer som forventet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TestConnectionCard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Synkroniseringslogg</CardTitle>
              <CardDescription>
                Se historikk og status for automatiske filhentinger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileSyncLogsCard />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileSync;