import React, { useState } from 'react';
import { Package, Users, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import FileDropZone from './FileDropZone';
import UploadProgressIndicator from './UploadProgressIndicator';
import MultiFileDropZone from './MultiFileDropZone';
import SelectedFilesList from './SelectedFilesList';
import { UploadStatus, UploadResults } from './types';

interface SimultaneousFileUploadProps {
  uploadStatus: UploadStatus;
  uploadResults: UploadResults;
  onProductUpload: (file: File) => Promise<void>;
  onCustomerUpload: (file: File) => Promise<void>;
  onOrderUpload: (file: File) => Promise<void>;
  hasBakeryAccess: boolean;
}

const SimultaneousFileUpload = ({
  uploadStatus,
  uploadResults,
  onProductUpload,
  onCustomerUpload,
  onOrderUpload,
  hasBakeryAccess
}: SimultaneousFileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<{
    products: File | null;
    customers: File | null;
    orders: File | null;
  }>({
    products: null,
    customers: null,
    orders: null
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (type: 'products' | 'customers' | 'orders', file: File) => {
    setSelectedFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleFileRemove = (type: 'products' | 'customers' | 'orders') => {
    setSelectedFiles(prev => ({ ...prev, [type]: null }));
  };

  const handleMultipleFiles = (files: File[]) => {
    // Valider antall filer
    if (files.length !== 3) {
      toast.error('Vennligst last opp nøyaktig 3 filer (.PRD, .CUS, .OD0)');
      return;
    }
    
    // Identifiser hver fil basert på endelse
    const productFile = files.find(f => f.name.toLowerCase().endsWith('.prd'));
    const customerFile = files.find(f => f.name.toLowerCase().endsWith('.cus'));
    const orderFile = files.find(f => f.name.toLowerCase().endsWith('.od0'));
    
    // Valider at alle filtyper er til stede
    if (!productFile || !customerFile || !orderFile) {
      toast.error('Mangler en eller flere påkrevde filtyper (.PRD, .CUS, .OD0)');
      return;
    }
    
    // Sett alle filene på en gang
    setSelectedFiles({
      products: productFile,
      customers: customerFile,
      orders: orderFile
    });
    
    toast.success('Alle 3 filer valgt! Klar for opplasting.');
  };

  const handleBatchUpload = async () => {
    if (!selectedFiles.products || !selectedFiles.customers || !selectedFiles.orders) {
      return;
    }

    setIsUploading(true);
    
    try {
      // Steg 1: Last opp produkter
      await onProductUpload(selectedFiles.products);
      
      // Steg 2: Last opp kunder
      await onCustomerUpload(selectedFiles.customers);
      
      // Steg 3: Last opp ordrer
      await onOrderUpload(selectedFiles.orders);
      
      // ✅ Tilbakestill state etter vellykket opplasting for å forhindre re-upload
      setSelectedFiles({
        products: null,
        customers: null,
        orders: null
      });
      
    } catch (error) {
      console.error('Batch upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const allFilesSelected = selectedFiles.products && selectedFiles.customers && selectedFiles.orders;
  const anyUploadInProgress = uploadStatus.products === 'uploading' || 
                               uploadStatus.customers === 'uploading' || 
                               uploadStatus.orders === 'uploading';

  return (
    <div className="space-y-6">
      {!hasBakeryAccess && (
        <Alert variant="destructive">
          <AlertDescription>
            Du må være tilknyttet et bakeri for å laste opp filer.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Last opp datafiler</h3>
          <p className="text-sm text-muted-foreground">
            Dra alle tre filene samtidig eller velg filer individuelt.
          </p>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg space-y-1 text-sm">
          <p className="font-medium">📋 Viktig rekkefølge:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Produkter lastes opp først (.PRD)</li>
            <li>Deretter kunder (.CUS)</li>
            <li>Til slutt ordrer (.OD0)</li>
          </ol>
        </div>
      </div>

      {/* Felles drop zone for alle 3 filer */}
      <MultiFileDropZone
        onFilesSelected={handleMultipleFiles}
        disabled={!hasBakeryAccess || isUploading}
      />

      {/* Kompakt liste over valgte filer */}
      <SelectedFilesList
        files={selectedFiles}
        onRemove={handleFileRemove}
        uploadStatus={uploadStatus}
      />

      {/* Alternativ: Individuelle drop zones */}
      {!allFilesSelected && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Eller velg filer individuelt:
          </p>
          <div className="grid gap-3">
            <FileDropZone
              fileType="products"
              label="Produktfil"
              icon={<Package className="w-5 h-5 text-primary" />}
              acceptedExtensions=".prd"
              selectedFile={selectedFiles.products}
              onFileSelect={(file) => handleFileSelect('products', file)}
              onFileRemove={() => handleFileRemove('products')}
              status={uploadStatus.products}
              disabled={!hasBakeryAccess || isUploading}
            />

            <FileDropZone
              fileType="customers"
              label="Kundefil"
              icon={<Users className="w-5 h-5 text-primary" />}
              acceptedExtensions=".cus"
              selectedFile={selectedFiles.customers}
              onFileSelect={(file) => handleFileSelect('customers', file)}
              onFileRemove={() => handleFileRemove('customers')}
              status={uploadStatus.customers}
              disabled={!hasBakeryAccess || isUploading}
            />

            <FileDropZone
              fileType="orders"
              label="Ordrefil"
              icon={<FileText className="w-5 h-5 text-primary" />}
              acceptedExtensions=".od0"
              selectedFile={selectedFiles.orders}
              onFileSelect={(file) => handleFileSelect('orders', file)}
              onFileRemove={() => handleFileRemove('orders')}
              status={uploadStatus.orders}
              disabled={!hasBakeryAccess || isUploading}
            />
          </div>
        </div>
      )}

      <Button 
        onClick={handleBatchUpload}
        disabled={!allFilesSelected || !hasBakeryAccess || anyUploadInProgress}
        className="w-full"
        size="lg"
      >
        <Upload className="w-4 h-4 mr-2" />
        Last opp alle filer
      </Button>

      {anyUploadInProgress && (
        <UploadProgressIndicator 
          uploadStatus={uploadStatus}
          uploadResults={uploadResults}
        />
      )}
    </div>
  );
};

export default SimultaneousFileUpload;
