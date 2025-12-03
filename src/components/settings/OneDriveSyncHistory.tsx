import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useOneDriveSyncSettings } from '@/hooks/useOneDriveSyncSettings';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const OneDriveSyncHistory: React.FC = () => {
  const { syncLogs, isLoading } = useOneDriveSyncSettings();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Vellykket</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Feilet</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Delvis</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pågår</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFileStats = (fileDetails: any[] | null) => {
    if (!fileDetails || fileDetails.length === 0) return null;

    const totals = fileDetails.reduce(
      (acc, file) => ({
        products: acc.products + (file.products || 0),
        customers: acc.customers + (file.customers || 0),
        orders: acc.orders + (file.orders || 0),
      }),
      { products: 0, customers: 0, orders: 0 }
    );

    const parts = [];
    if (totals.products > 0) parts.push(`${totals.products} produkter`);
    if (totals.customers > 0) parts.push(`${totals.customers} kunder`);
    if (totals.orders > 0) parts.push(`${totals.orders} ordrer`);

    return parts.length > 0 ? parts.join(', ') : null;
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

  if (syncLogs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle className="text-lg">Synkroniseringshistorikk</CardTitle>
            <CardDescription>Oversikt over de siste synkroniseringene</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tidspunkt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Filer</TableHead>
              <TableHead>Importert</TableHead>
              <TableHead>Varighet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {syncLogs.map((log) => {
              const startTime = new Date(log.sync_started_at);
              const endTime = log.sync_completed_at ? new Date(log.sync_completed_at) : null;
              const duration = endTime
                ? Math.round((endTime.getTime() - startTime.getTime()) / 1000)
                : null;

              return (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(startTime, 'dd.MM.yyyy HH:mm', { locale: nb })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      {getStatusBadge(log.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.files_processed !== null && log.files_found !== null ? (
                      <span>
                        {log.files_processed}/{log.files_found}
                        {log.files_failed && log.files_failed > 0 && (
                          <span className="text-destructive ml-1">
                            ({log.files_failed} feilet)
                          </span>
                        )}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getFileStats(log.file_details) || '-'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {duration !== null ? `${duration}s` : '-'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OneDriveSyncHistory;
