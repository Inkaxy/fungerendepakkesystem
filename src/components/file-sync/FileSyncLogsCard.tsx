import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFileSyncLogs } from '@/hooks/useFileSyncSettings';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'in_progress':
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'success':
      return <Badge variant="default" className="bg-green-500">Vellykket</Badge>;
    case 'error':
      return <Badge variant="destructive">Feil</Badge>;
    case 'in_progress':
      return <Badge variant="secondary">Pågår</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const FileSyncLogsCard = () => {
  const { data: logs, isLoading, error } = useFileSyncLogs();

  if (isLoading) {
    return <div>Laster logg...</div>;
  }

  if (error) {
    return <div className="text-red-500">Feil ved lasting av logg: {error.message}</div>;
  }

  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Ingen logg-oppføringer</h3>
          <p className="text-muted-foreground text-center">
            Når filsynkronisering kjører, vil aktiviteten vises her.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(log.status)}
                <CardTitle className="text-base">
                  Synkronisering #{log.id.slice(-8)}
                </CardTitle>
              </div>
              {getStatusBadge(log.status)}
            </div>
            <CardDescription>
              Startet: {format(new Date(log.sync_started_at), 'dd.MM.yyyy HH:mm:ss', { locale: nb })}
              {log.sync_completed_at && (
                <span>
                  {' • '}
                  Fullført: {format(new Date(log.sync_completed_at), 'HH:mm:ss', { locale: nb })}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Filer funnet</div>
                <div className="font-semibold">{log.files_found}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Prosessert</div>
                <div className="font-semibold text-green-600">{log.files_processed}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Feil</div>
                <div className="font-semibold text-red-600">{log.files_failed}</div>
              </div>
            </div>

            {log.error_message && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="text-sm font-medium text-red-800 mb-1">Feilmelding:</div>
                <div className="text-sm text-red-700">{log.error_message}</div>
              </div>
            )}

            {log.file_details && log.file_details.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Fildetaljer:</div>
                <div className="max-h-32 overflow-y-auto">
                  {log.file_details.map((file: any, index: number) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded border">
                      <div className="font-mono">{file.name || file.path}</div>
                      {file.size && (
                        <div className="text-muted-foreground">
                          Størrelse: {(file.size / 1024).toFixed(1)} KB
                        </div>
                      )}
                      {file.status && (
                        <div className={`text-xs ${
                          file.status === 'processed' ? 'text-green-600' : 
                          file.status === 'error' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          Status: {file.status}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};