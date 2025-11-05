import React from 'react';
import { Package, Users, FileText, CheckCircle2, XCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadStatus } from './types';

interface SelectedFilesListProps {
  files: {
    products: File | null;
    customers: File | null;
    orders: File | null;
  };
  onRemove: (type: 'products' | 'customers' | 'orders') => void;
  uploadStatus: UploadStatus;
}

const SelectedFilesList = ({ files, onRemove, uploadStatus }: SelectedFilesListProps) => {
  const fileList = [
    { type: 'products' as const, label: 'Produktfil', file: files.products, icon: Package, status: uploadStatus.products },
    { type: 'customers' as const, label: 'Kundefil', file: files.customers, icon: Users, status: uploadStatus.customers },
    { type: 'orders' as const, label: 'Ordrefil', file: files.orders, icon: FileText, status: uploadStatus.orders }
  ];

  const allSelected = files.products && files.customers && files.orders;

  if (!allSelected) return null;

  return (
    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
      <p className="text-sm font-medium mb-3">Valgte filer:</p>
      {fileList.map(({ type, label, file, icon: Icon, status }) => {
        if (!file) return null;
        
        return (
          <div key={type} className="flex items-center justify-between p-2 bg-background rounded">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{label}:</span>
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              {status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
              {status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
              
              {status === 'idle' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(type)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SelectedFilesList;
