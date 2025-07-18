import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Info } from 'lucide-react';

interface ServiceConfigFormProps {
  serviceType: string;
  config: any;
  onChange: (config: any) => void;
}

export const ServiceConfigForm = ({ serviceType, config, onChange }: ServiceConfigFormProps) => {
  const updateConfig = (key: string, value: string | number) => {
    onChange({ ...config, [key]: value });
  };

  const renderOneDriveForm = () => (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Slik finner du OneDrive-innstillingene:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Gå til <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">Azure Portal <ExternalLink className="h-3 w-3" /></a></li>
            <li>Velg "App registrations" → "New registration"</li>
            <li>Gi appen et navn og velg "Single tenant"</li>
            <li>Kopier "Application (client) ID" til Client ID-feltet</li>
            <li>Gå til "Certificates & secrets" → "New client secret"</li>
            <li>Kopier verdien til Client Secret-feltet</li>
            <li>Finn "Directory (tenant) ID" på oversikt-siden</li>
          </ol>
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor="client_id">Client ID</Label>
        <Input
          id="client_id"
          value={config.client_id || ''}
          onChange={(e) => updateConfig('client_id', e.target.value)}
          placeholder="f.eks. 12345678-1234-1234-1234-123456789012"
          required
        />
        <p className="text-sm text-muted-foreground">Application (client) ID fra Azure Portal</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="client_secret">Client Secret</Label>
        <Input
          id="client_secret"
          type="password"
          value={config.client_secret || ''}
          onChange={(e) => updateConfig('client_secret', e.target.value)}
          placeholder="Din hemmelige nøkkel fra Azure"
          required
        />
        <p className="text-sm text-muted-foreground">Hemmeligheten opprettet under "Certificates & secrets"</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tenant_id">Tenant ID</Label>
        <Input
          id="tenant_id"
          value={config.tenant_id || ''}
          onChange={(e) => updateConfig('tenant_id', e.target.value)}
          placeholder="f.eks. 87654321-4321-4321-4321-210987654321"
          required
        />
        <p className="text-sm text-muted-foreground">Directory (tenant) ID fra Azure Portal</p>
      </div>
    </div>
  );

  const renderGoogleDriveForm = () => (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Slik finner du Google Drive-innstillingene:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Gå til <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="h-3 w-3" /></a></li>
            <li>Opprett et nytt prosjekt eller velg eksisterende</li>
            <li>Gå til "APIs & Services" → "Library"</li>
            <li>Aktiver "Google Drive API"</li>
            <li>Gå til "Credentials" → "Create Credentials" → "OAuth client ID"</li>
            <li>Velg "Desktop application" som applikasjonstype</li>
            <li>Kopier Client ID og Client Secret</li>
          </ol>
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="client_id">Client ID</Label>
        <Input
          id="client_id"
          value={config.client_id || ''}
          onChange={(e) => updateConfig('client_id', e.target.value)}
          placeholder="f.eks. 123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
          required
        />
        <p className="text-sm text-muted-foreground">OAuth 2.0 Client ID fra Google Cloud Console</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="client_secret">Client Secret</Label>
        <Input
          id="client_secret"
          type="password"
          value={config.client_secret || ''}
          onChange={(e) => updateConfig('client_secret', e.target.value)}
          placeholder="Din OAuth client secret"
          required
        />
        <p className="text-sm text-muted-foreground">OAuth 2.0 Client Secret fra Google Cloud Console</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="redirect_uri">Redirect URI</Label>
        <Input
          id="redirect_uri"
          value={config.redirect_uri || 'urn:ietf:wg:oauth:2.0:oob'}
          onChange={(e) => updateConfig('redirect_uri', e.target.value)}
          placeholder="urn:ietf:wg:oauth:2.0:oob"
        />
        <p className="text-sm text-muted-foreground">Standard verdi for desktop-applikasjoner</p>
      </div>
    </div>
  );

  const renderFtpForm = () => (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>FTP/SFTP-innstillinger:</strong>
          <p className="mt-2">Du finner disse innstillingene hos din hosting-leverandør eller IT-administrator. Kontakt dem hvis du er usikker.</p>
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="host">Server (Host)</Label>
        <Input
          id="host"
          value={config.host || ''}
          onChange={(e) => updateConfig('host', e.target.value)}
          placeholder="f.eks. ftp.example.com eller 192.168.1.100"
          required
        />
        <p className="text-sm text-muted-foreground">FTP-serverens adresse eller IP</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="port">Port</Label>
        <Input
          id="port"
          type="number"
          value={config.port || (serviceType === 'sftp' ? 22 : 21)}
          onChange={(e) => updateConfig('port', parseInt(e.target.value))}
          placeholder={serviceType === 'sftp' ? '22' : '21'}
          required
        />
        <p className="text-sm text-muted-foreground">
          Standard: {serviceType === 'sftp' ? '22 for SFTP' : '21 for FTP'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Brukernavn</Label>
        <Input
          id="username"
          value={config.username || ''}
          onChange={(e) => updateConfig('username', e.target.value)}
          placeholder="Ditt FTP-brukernavn"
          required
        />
        <p className="text-sm text-muted-foreground">Brukernavnet du bruker for å logge inn på FTP-serveren</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Passord</Label>
        <Input
          id="password"
          type="password"
          value={config.password || ''}
          onChange={(e) => updateConfig('password', e.target.value)}
          placeholder="Ditt FTP-passord"
          required
        />
        <p className="text-sm text-muted-foreground">Passordet du bruker for å logge inn på FTP-serveren</p>
      </div>
    </div>
  );

  if (!serviceType) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Velg en tjeneste-type ovenfor for å se konfigurasjonsskjemaet.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {serviceType === 'onedrive' && renderOneDriveForm()}
      {serviceType === 'google_drive' && renderGoogleDriveForm()}
      {(serviceType === 'ftp' || serviceType === 'sftp') && renderFtpForm()}
    </div>
  );
};