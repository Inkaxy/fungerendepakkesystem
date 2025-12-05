import React, { useState } from 'react';
import { History, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useImportHistory, ImportLog } from '@/hooks/useOneDriveFiles';

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  completed: { 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    label: 'Fullført', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
  },
  failed: { 
    icon: <XCircle className="h-4 w-4" />, 
    label: 'Feilet', 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
  },
  running: { 
    icon: <Clock className="h-4 w-4 animate-spin" />, 
    label: 'Kjører', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
  },
};

function formatDuration(ms: number | null): string {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

const ImportLogRow: React.FC<{ log: ImportLog }> = ({ log }) => {
  const [isOpen, setIsOpen] = useState(false);
  const status = STATUS_CONFIG[log.status] || STATUS_CONFIG.running;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg">
        <CollapsibleTrigger asChild>
          <button className="w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left">
            <Badge className={status.color}>
              {status.icon}
              <span className="ml-1">{status.label}</span>
            </Badge>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {new Date(log.started_at).toLocaleString('nb-NO')}
              </p>
              <p className="text-xs text-muted-foreground">
                {log.source === 'onedrive' ? 'OneDrive' : 'Manuell'} • {formatDuration(log.execution_time_ms)}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span title="Filer">{log.files_processed || 0} filer</span>
              <span title="Produkter">{log.products_imported || 0} prod.</span>
              <span title="Kunder">{log.customers_imported || 0} kunder</span>
              <span title="Ordrer">{log.orders_created || 0} ordrer</span>
            </div>

            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-3 pb-3 space-y-2 border-t pt-2">
            {log.error_message && (
              <div className="bg-destructive/10 text-destructive text-sm p-2 rounded">
                <strong>Feil:</strong> {log.error_message}
              </div>
            )}

            {log.file_results && log.file_results.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Fildetaljer:</p>
                <div className="space-y-1">
                  {log.file_results.map((result: any, index: number) => (
                    <div 
                      key={index} 
                      className={`text-xs p-2 rounded ${
                        result.status === 'success' ? 'bg-muted/50' : 'bg-destructive/10'
                      }`}
                    >
                      <span className="font-medium">{result.file}</span>
                      <span className="text-muted-foreground ml-2">
                        {result.type} • {result.count || 0} elementer
                        {result.created !== undefined && ` • ${result.created} opprettet`}
                        {result.skipped !== undefined && ` • ${result.skipped} hoppet over`}
                      </span>
                      {result.error && (
                        <span className="text-destructive ml-2">• {result.error}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

const OneDriveImportHistoryCard: React.FC = () => {
  const { data: logs, isLoading } = useImportHistory(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Import-historikk
        </CardTitle>
        <CardDescription>
          Oversikt over tidligere importer
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Ingen importer utført ennå</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <ImportLogRow key={log.id} log={log} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OneDriveImportHistoryCard;
