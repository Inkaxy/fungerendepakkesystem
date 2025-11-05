import React from 'react';
import { CheckCircle2, Loader2, Circle, AlertCircle } from 'lucide-react';
import { UploadStatus } from './types';

interface UploadProgressIndicatorProps {
  uploadStatus: UploadStatus;
  uploadResults: {
    products: any[];
    customers: any[];
    orders: any[];
  };
}

const UploadProgressIndicator = ({ uploadStatus, uploadResults }: UploadProgressIndicatorProps) => {
  const getIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string, results: any[], label: string) => {
    switch (status) {
      case 'uploading':
        return <span className="text-blue-600">Prosesserer...</span>;
      case 'success':
        return (
          <span className="text-green-600">
            {results.length} {label} importert
          </span>
        );
      case 'error':
        return <span className="text-red-600">Feil ved import</span>;
      default:
        return <span className="text-muted-foreground">Venter...</span>;
    }
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-sm">Progresjon:</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          {getIcon(uploadStatus.products)}
          <div className="flex-1">
            <span className="font-medium text-sm">Produkter</span>
            <div className="text-sm">
              {getStatusText(uploadStatus.products, uploadResults.products, 'produkter')}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {getIcon(uploadStatus.customers)}
          <div className="flex-1">
            <span className="font-medium text-sm">Kunder</span>
            <div className="text-sm">
              {getStatusText(uploadStatus.customers, uploadResults.customers, 'kunder')}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {getIcon(uploadStatus.orders)}
          <div className="flex-1">
            <span className="font-medium text-sm">Ordrer</span>
            <div className="text-sm">
              {getStatusText(uploadStatus.orders, uploadResults.orders, 'ordrer')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProgressIndicator;
