
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, Mail, Printer, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { PackingDeviation } from '@/hooks/usePackingDeviations';
import { useToast } from '@/hooks/use-toast';

interface DeviationDetailsProps {
  date: string;
  deviations: PackingDeviation[];
  onBack: () => void;
}

const DeviationDetails = ({ date, deviations, onBack }: DeviationDetailsProps) => {
  const { toast } = useToast();

  const positiveDeviations = deviations.filter(d => d.deviation > 0);
  const negativeDeviations = deviations.filter(d => d.deviation < 0);

  const handleExport = () => {
    // Create CSV content
    const headers = ['Kunde', 'Kundenummer', 'Produkt', 'Varenummer', 'Bestilt', 'Pakket', 'Avvik'];
    const csvContent = [
      headers.join(','),
      ...deviations.map(d => [
        d.customer_name,
        d.customer_number || '',
        d.product_name,
        d.product_number || '',
        d.ordered_quantity,
        d.packed_quantity,
        d.deviation
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avvik-${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Rapport eksportert",
      description: `Avviksrapport for ${format(new Date(date), 'dd.MM.yyyy', { locale: nb })} er lastet ned som CSV.`,
    });
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Avviksrapport - ${format(new Date(date), 'dd.MM.yyyy', { locale: nb })}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .positive { color: #16a34a; font-weight: bold; }
            .negative { color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Avviksrapport - ${format(new Date(date), 'dd. MMMM yyyy', { locale: nb })}</h1>
          <p>Generert: ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale: nb })}</p>
          <p>Totalt antall avvik: ${deviations.length}</p>
          <table>
            <thead>
              <tr>
                <th>Kunde</th>
                <th>Kundenummer</th>
                <th>Produkt</th>
                <th>Varenummer</th>
                <th>Bestilt</th>
                <th>Pakket</th>
                <th>Avvik</th>
              </tr>
            </thead>
            <tbody>
              ${deviations.map(d => `
                <tr>
                  <td>${d.customer_name}</td>
                  <td>${d.customer_number || '-'}</td>
                  <td>${d.product_name}</td>
                  <td>${d.product_number || '-'}</td>
                  <td>${d.ordered_quantity}</td>
                  <td>${d.packed_quantity}</td>
                  <td class="${d.deviation > 0 ? 'positive' : 'negative'}">
                    ${d.deviation > 0 ? '+' : ''}${d.deviation}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleEmail = () => {
    toast({
      title: "E-post funksjon",
      description: "E-post funksjonalitet vil bli implementert i neste versjon.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Tilbake</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Avviksrapport - {format(new Date(date), 'dd. MMMM yyyy', { locale: nb })}
            </h1>
            <p className="text-muted-foreground">
              {deviations.length} avvik funnet
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint} className="flex items-center space-x-2">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button variant="outline" onClick={handleEmail} className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Send e-post</span>
          </Button>
          <Button onClick={handleExport} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Eksporter CSV</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Totalt avvik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{deviations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overlevering</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{positiveDeviations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Underlevering</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{negativeDeviations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Deviations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
            Detaljerte avvik
          </CardTitle>
          <CardDescription>
            Alle avvik for {format(new Date(date), 'dd.MM.yyyy', { locale: nb })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kunde</TableHead>
                <TableHead>Produkt</TableHead>
                <TableHead className="text-right">Bestilt</TableHead>
                <TableHead className="text-right">Pakket</TableHead>
                <TableHead className="text-right">Avvik</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deviations.map((deviation) => (
                <TableRow key={deviation.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deviation.customer_name}</div>
                      {deviation.customer_number && (
                        <div className="text-sm text-muted-foreground">{deviation.customer_number}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deviation.product_name}</div>
                      {deviation.product_number && (
                        <div className="text-sm text-muted-foreground">{deviation.product_number}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {deviation.ordered_quantity} stk
                  </TableCell>
                  <TableCell className="text-right">
                    {deviation.packed_quantity} stk
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={deviation.deviation > 0 ? "default" : "destructive"}
                      className="font-medium"
                    >
                      {deviation.deviation > 0 ? '+' : ''}{deviation.deviation} stk
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {deviations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ingen avvik funnet for denne dagen</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviationDetails;
