import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import UploadProgressIndicator from './UploadProgressIndicator';
import MultiFileDropZone from './MultiFileDropZone';
import SelectedFilesList from './SelectedFilesList';
import { UploadStatus, UploadResults, IdMapping } from './types';

interface SimultaneousFileUploadProps {
  uploadStatus: UploadStatus;
  uploadResults: UploadResults;
  onProductUpload: (file: File) => Promise<IdMapping>;
  onCustomerUpload: (file: File) => Promise<IdMapping>;
  onOrderUpload: (file: File, productMapping: IdMapping, customerMapping: IdMapping) => Promise<void>;
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

  const handleFileRemove = (type: 'products' | 'customers' | 'orders') => {
    setSelectedFiles(prev => ({ ...prev, [type]: null }));
  };

  const handleMultipleFiles = (files: File[]) => {
    if (files.length !== 3) {
      toast.error('Vennligst last opp nøyaktig 3 filer (.PRD, .CUS, .OD0)');
      return;
    }
    
    const productFile = files.find(f => f.name.toLowerCase().endsWith('.prd'));
    const customerFile = files.find(f => f.name.toLowerCase().endsWith('.cus'));
    const orderFile = files.find(f => f.name.toLowerCase().endsWith('.od0'));
    
    if (!productFile || !customerFile || !orderFile) {
      toast.error('Mangler en eller flere påkrevde filtyper (.PRD, .CUS, .OD0)');
      return;
    }
    
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
      // Step 1: Upload products and get mapping back
      const productMapping = await onProductUpload(selectedFiles.products);
      
      if (Object.keys(productMapping).length === 0) {
        throw new Error('Produktopplasting feilet');
      }
      
      // Step 2: Upload customers and get mapping back
      const customerMapping = await onCustomerUpload(selectedFiles.customers);
      
      if (Object.keys(customerMapping).length === 0) {
        throw new Error('Kundeopplasting feilet');
      }
      
      // Step 3: Upload orders WITH fresh mappings passed directly
      await onOrderUpload(selectedFiles.orders, productMapping, customerMapping);
      
      // Reset state after successful upload
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
            Dra alle tre filene (.PRD, .CUS, .OD0) hit samtidig.
          </p>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg space-y-1 text-sm">
          <p className="font-medium">📋 Automatisk rekkefølge:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Produkter (.PRD)</li>
            <li>Kunder (.CUS)</li>
            <li>Ordrer (.OD0)</li>
          </ol>
        </div>
      </div>

      {/* Single drop zone for all 3 files */}
      <MultiFileDropZone
        onFilesSelected={handleMultipleFiles}
        disabled={!hasBakeryAccess || isUploading}
      />

      {/* Compact list of selected files */}
      <SelectedFilesList
        files={selectedFiles}
        onRemove={handleFileRemove}
        uploadStatus={uploadStatus}
      />

      <Button 
        onClick={handleBatchUpload}
        disabled={!allFilesSelected || !hasBakeryAccess || anyUploadInProgress || isUploading}
        className="w-full"
        size="lg"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? 'Laster opp...' : 'Last opp alle filer'}
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
