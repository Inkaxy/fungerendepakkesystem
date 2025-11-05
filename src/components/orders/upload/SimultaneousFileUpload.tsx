import React, { useState } from 'react';
import { Package, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileDropZone from './FileDropZone';
import UploadProgressIndicator from './UploadProgressIndicator';
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
            Velg alle tre filene nedenfor, deretter klikk "Last opp alle filer" for å starte importen.
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

      <div className="grid gap-4">
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

      <Button 
        onClick={handleBatchUpload}
        disabled={!allFilesSelected || !hasBakeryAccess || anyUploadInProgress}
        className="w-full"
        size="lg"
      >
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
