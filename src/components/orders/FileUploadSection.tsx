
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface FileUploadSectionProps {
  title: string;
  description: string;
  acceptedTypes: string;
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  status: 'idle' | 'uploading' | 'success' | 'error';
  exampleFormat: string;
  formatDescription: string;
  disabled?: boolean;
}

const FileUploadSection = ({
  title,
  description,
  acceptedTypes,
  onFileUpload,
  isUploading,
  status,
  exampleFormat,
  formatDescription,
  disabled = false
}: FileUploadSectionProps) => {
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !disabled) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': [acceptedTypes]
    },
    multiple: false,
    disabled: disabled || isUploading
  });

  const getStatusIndicator = () => {
    switch (status) {
      case 'uploading':
        return (
          <div className="flex items-center text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Laster opp...
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Ferdig!
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            Feil ved opplasting
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Filformat:</h4>
        <p className="text-sm text-gray-600 mb-2">{formatDescription}</p>
        <code className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
          {exampleFormat}
        </code>
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:border-gray-400'}
          ${status === 'success' ? 'border-green-400 bg-green-50' : ''}
          ${status === 'error' ? 'border-red-400 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-3">
          <div className="flex justify-center">
            {isUploading ? (
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            ) : status === 'error' ? (
              <AlertCircle className="w-12 h-12 text-red-500" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}
          </div>
          
          <div>
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Slipp filen her...</p>
            ) : disabled ? (
              <p className="text-gray-500">Last opp forrige fil først</p>
            ) : (
              <>
                <p className="text-gray-700 font-medium">
                  Dra og slipp filen her, eller klikk for å velge
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Aksepterer {acceptedTypes.toUpperCase()} filer
                </p>
              </>
            )}
          </div>
          
          {getStatusIndicator()}
          
          {!disabled && !isUploading && (
            <Button variant="outline" className="mt-2">
              <FileText className="w-4 h-4 mr-2" />
              Velg fil
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadSection;
