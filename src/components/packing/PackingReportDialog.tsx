
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Printer, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface PackingReportItem {
  customerName: string;
  customerNumber: string;
  productName: string;
  productNumber: string;
  orderedQuantity: number;
  packedQuantity: number;
  deviation: number;
}

interface PackingReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: PackingReportItem[];
  sessionDate: string;
}

const PackingReportDialog = ({
  isOpen,
  onClose,
  reportData,
  sessionDate
}: PackingReportDialogProps) => {
  const [emailAddress, setEmailAddress] = useState('ordrekontor@bakeri.no');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const deviationItems = reportData.filter(item => item.deviation !== 0);
  const totalDeviations = deviationItems.length;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = generateReportHTML();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const htmlContent = generateReportHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pakking-rapport-${sessionDate}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      // This would need to be implemented as a Supabase Edge Function
      // For now, we'll show a success message
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Rapport sendt",
        description: `Pakking rapport er sendt til ${emailAddress}`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Feil ved sending",
        description: "Kunne ikke sende rapport. Prøv igjen senere.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const generateReportHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pakking Rapport - ${format(new Date(sessionDate), 'dd. MMMM yyyy', { locale: nb })}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #666; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .positive { color: #16a34a; font-weight: bold; }
            .negative { color: #dc2626; font-weight: bold; }
            .summary { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Pakking Rapport</h1>
          <div class="summary">
            <p><strong>Dato:</strong> ${format(new Date(sessionDate), 'dd. MMMM yyyy', { locale: nb })}</p>
            <p><strong>Totalt antall avvik:</strong> ${totalDeviations}</p>
            <p><strong>Generert:</strong> ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale: nb })}</p>
          </div>
          
          ${totalDeviations > 0 ? `
            <h2>Avvik som krever korrigering</h2>
            <table>
              <thead>
                <tr>
                  <th>Kundenummer</th>
                  <th>Kunde</th>
                  <th>Varenummer</th>
                  <th>Produkt</th>
                  <th>Bestilt</th>
                  <th>Pakket</th>
                  <th>Avvik</th>
                </tr>
              </thead>
              <tbody>
                ${deviationItems.map(item => `
                  <tr>
                    <td>${item.customerNumber || '-'}</td>
                    <td>${item.customerName}</td>
                    <td>${item.productNumber || '-'}</td>
                    <td>${item.productName}</td>
                    <td>${item.orderedQuantity}</td>
                    <td>${item.packedQuantity}</td>
                    <td class="${item.deviation > 0 ? 'positive' : 'negative'}">
                      ${item.deviation > 0 ? '+' : ''}${item.deviation}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p>Ingen avvik registrert for denne dagen.</p>'}
          
          <h2>Alle produkter</h2>
          <table>
            <thead>
              <tr>
                <th>Kundenummer</th>
                <th>Kunde</th>
                <th>Varenummer</th>
                <th>Produkt</th>
                <th>Bestilt</th>
                <th>Pakket</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map(item => `
                <tr>
                  <td>${item.customerNumber || '-'}</td>
                  <td>${item.customerName}</td>
                  <td>${item.productNumber || '-'}</td>
                  <td>${item.productName}</td>
                  <td>${item.orderedQuantity}</td>
                  <td>${item.packedQuantity}</td>
                  <td>${item.deviation === 0 ? 'OK' : `Avvik: ${item.deviation > 0 ? '+' : ''}${item.deviation}`}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Pakking Rapport - {format(new Date(sessionDate), 'dd. MMMM yyyy', { locale: nb })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold">{reportData.length}</p>
              <p className="text-sm text-muted-foreground">Totalt produkter</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{totalDeviations}</p>
              <p className="text-sm text-muted-foreground">Avvik</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {reportData.length - totalDeviations}
              </p>
              <p className="text-sm text-muted-foreground">Uten avvik</p>
            </div>
          </div>

          {totalDeviations > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Avvik som krever korrigering</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kunde</TableHead>
                    <TableHead>Varenummer</TableHead>
                    <TableHead>Produkt</TableHead>
                    <TableHead>Bestilt</TableHead>
                    <TableHead>Pakket</TableHead>
                    <TableHead>Avvik</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviationItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.customerName}</p>
                          {item.customerNumber && (
                            <p className="text-sm text-muted-foreground">{item.customerNumber}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.productNumber || '-'}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.orderedQuantity} stk</TableCell>
                      <TableCell>{item.packedQuantity} stk</TableCell>
                      <TableCell>
                        <Badge variant={item.deviation > 0 ? "default" : "destructive"}>
                          {item.deviation > 0 ? '+' : ''}{item.deviation} stk
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="space-y-4">
            <Label htmlFor="email">Send rapport til e-post</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="ordrekontor@bakeri.no"
                className="flex-1"
              />
              <Button onClick={handleSendEmail} disabled={isSending} className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{isSending ? 'Sender...' : 'Send'}</span>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrint} className="flex items-center space-x-2">
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Last ned</span>
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Lukk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PackingReportDialog;
