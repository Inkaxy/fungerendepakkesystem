import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FileDropZoneProps {
  fileType: 'products' | 'customers' | 'orders';
  label: string;
  icon: React.ReactNode;
  acceptedExtensions: string;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  status: 'idle' | 'uploading' | 'success' | 'error';
  disabled?: boolean;
}

const FileDropZone = ({
  label,
  icon,
  acceptedExtensions,
  selectedFile,
  onFileSelect,
  onFileRemove,
  status,
  disabled = false
}: FileDropZoneProps) => {
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !disabled) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': [acceptedExtensions]
    },
    multiple: false,
    disabled: disabled || status === 'uploading'
  });

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return <span className="text-blue-600 text-sm">Laster opp...</span>;
      case 'success':
        return <span className="text-green-600 text-sm">Ferdig!</span>;
      case 'error':
        return <span className="text-red-600 text-sm">Feil ved opplasting</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-medium">{label}</span>
          <span className="text-sm text-muted-foreground">({acceptedExtensions.toUpperCase()})</span>
        </div>
        {getStatusIcon()}
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-muted/50' : 'hover:border-primary/50 hover:bg-accent/50'}
          ${status === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}
          ${status === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}
          ${status === 'uploading' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm truncate">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            {status === 'idle' && !disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove();
                }}
                className="ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="py-2">
            {isDragActive ? (
              <p className="text-sm text-primary font-medium">Slipp filen her...</p>
            ) : disabled ? (
              <p className="text-sm text-muted-foreground">Vent på andre filer...</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Dra og slipp eller klikk for å velge fil
              </p>
            )}
          </div>
        )}
      </div>

      {getStatusText()}
    </div>
  );
};

export default FileDropZone;
