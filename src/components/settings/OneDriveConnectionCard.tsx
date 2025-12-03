import React from 'react';
import { Cloud, CheckCircle, XCircle, AlertTriangle, Loader2, Unplug, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOneDriveConnection, useDisconnectOneDrive } from '@/hooks/useOneDriveConnection';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

export const OneDriveConnectionCard: React.FC = () => {
  const { data: connection, isLoading, error } = useOneDriveConnection();
  const disconnectMutation = useDisconnectOneDrive();

  const handleConnect = () => {
    // TODO: Implementer OAuth flow via edge function
    // For nå, vis placeholder
    window.alert('OAuth-integrasjon kommer i neste fase. Edge function må implementeres først.');
  };

  const handleDisconnect = () => {
    if (window.confirm('Er du sikker på at du vil koble fra OneDrive?')) {
      disconnectMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Kunne ikke laste OneDrive-status: {(error as Error).message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const isConnected = connection?.is_connected ?? false;
  const hasErrors = (connection?.consecutive_failures ?? 0) > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Cloud className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg">OneDrive Tilkobling</CardTitle>
              <CardDescription>
                Koble til Microsoft OneDrive for filimport
              </CardDescription>
            </div>
          </div>
          <ConnectionStatusBadge 
            isConnected={isConnected} 
            hasErrors={hasErrors} 
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isConnected ? (
          <ConnectedState 
            connection={connection!}
            onDisconnect={handleDisconnect}
            isDisconnecting={disconnectMutation.isPending}
          />
        ) : (
          <DisconnectedState onConnect={handleConnect} />
        )}

        {hasErrors && connection?.last_error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Siste feil:</strong> {connection.last_error}
              <br />
              <span className="text-xs">
                Antall påfølgende feil: {connection.consecutive_failures}
              </span>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

interface ConnectionStatusBadgeProps {
  isConnected: boolean;
  hasErrors: boolean;
}

const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({ 
  isConnected, 
  hasErrors 
}) => {
  if (isConnected && !hasErrors) {
    return (
      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
        <CheckCircle className="h-3 w-3 mr-1" />
        Tilkoblet
      </Badge>
    );
  }

  if (isConnected && hasErrors) {
    return (
      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Tilkoblet (med feil)
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-muted-foreground">
      <XCircle className="h-3 w-3 mr-1" />
      Ikke tilkoblet
    </Badge>
  );
};

interface ConnectedStateProps {
  connection: {
    microsoft_email: string | null;
    connected_at: string | null;
  };
  onDisconnect: () => void;
  isDisconnecting: boolean;
}

const ConnectedState: React.FC<ConnectedStateProps> = ({ 
  connection, 
  onDisconnect,
  isDisconnecting 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground">Microsoft-konto</span>
          <span className="font-medium">{connection.microsoft_email || 'Ukjent'}</span>
        </div>
        {connection.connected_at && (
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Tilkoblet</span>
            <span className="font-medium">
              {format(new Date(connection.connected_at), 'PPp', { locale: nb })}
            </span>
          </div>
        )}
      </div>

      <Button 
        variant="outline" 
        onClick={onDisconnect}
        disabled={isDisconnecting}
        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        {isDisconnecting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Unplug className="h-4 w-4 mr-2" />
        )}
        Koble fra OneDrive
      </Button>
    </div>
  );
};

interface DisconnectedStateProps {
  onConnect: () => void;
}

const DisconnectedState: React.FC<DisconnectedStateProps> = ({ onConnect }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Koble til OneDrive for å automatisk importere produkt-, kunde- og ordrefiler 
        (.PRD, .CUS, .OD0) fra en mappe i din OneDrive.
      </p>

      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-medium">Før du kobler til:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Opprett en mappe i OneDrive (f.eks. "Pakkesystem")</li>
          <li>Legg filer som skal importeres i denne mappen</li>
          <li>Du vil gi tilgang til å lese filer fra OneDrive</li>
        </ul>
      </div>

      <Button onClick={onConnect} className="w-full">
        <Cloud className="h-4 w-4 mr-2" />
        Koble til OneDrive
        <ExternalLink className="h-3 w-3 ml-2" />
      </Button>
    </div>
  );
};

export default OneDriveConnectionCard;
