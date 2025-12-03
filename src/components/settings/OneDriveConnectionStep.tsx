import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Link2, Link2Off, CheckCircle2, Mail, Clock } from 'lucide-react';
import { useOneDriveConnection } from '@/hooks/useOneDriveConnection';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const OneDriveConnectionStep: React.FC = () => {
  const {
    connection,
    isConnected,
    isLoading,
    connectOneDrive,
    disconnectOneDrive,
    isDisconnecting,
  } = useOneDriveConnection();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
          1
        </div>
        <div>
          <h3 className="font-semibold">Koble til OneDrive</h3>
          <p className="text-sm text-muted-foreground">
            Logg inn med Microsoft-kontoen som har tilgang til filene
          </p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="ml-11 space-y-4">
        {isConnected && connection ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">OneDrive er tilkoblet</span>
            </div>
            
            <div className="space-y-2 text-sm">
              {connection.user_email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{connection.user_email}</span>
                </div>
              )}
              {connection.connected_at && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Tilkoblet {format(new Date(connection.connected_at), 'PPp', { locale: nb })}
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => disconnectOneDrive()}
              disabled={isDisconnecting}
              className="text-destructive hover:text-destructive"
            >
              {isDisconnecting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Link2Off className="h-4 w-4 mr-2" />
              )}
              Koble fra
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                Klikk på knappen under for å logge inn med Microsoft og gi tilgang til OneDrive-filene dine.
              </p>
              <Button onClick={connectOneDrive} className="gap-2">
                <svg className="h-5 w-5" viewBox="0 0 23 23" fill="none">
                  <path d="M11.5 0L0 11.5L11.5 23L23 11.5L11.5 0Z" fill="#F25022"/>
                  <path d="M11.5 0L0 11.5H11.5V0Z" fill="#7FBA00"/>
                  <path d="M11.5 11.5L0 11.5L11.5 23V11.5Z" fill="#00A4EF"/>
                  <path d="M11.5 11.5V23L23 11.5H11.5Z" fill="#FFB900"/>
                </svg>
                Koble til Microsoft OneDrive
              </Button>
            </div>

            {connection?.connection_error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {connection.connection_error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OneDriveConnectionStep;
