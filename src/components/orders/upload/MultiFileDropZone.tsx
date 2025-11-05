import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Files } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MultiFileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const MultiFileDropZone = ({ onFilesSelected, disabled }: MultiFileDropZoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!disabled) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.prd', '.cus', '.od0']
    },
    multiple: true,
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
        ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 hover:bg-accent/50'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2">
          <Upload className="w-8 h-8 text-primary" />
          <Files className="w-8 h-8 text-primary" />
        </div>
        
        {isDragActive ? (
          <p className="text-lg font-medium text-primary">Slipp filene her...</p>
        ) : (
          <>
            <p className="text-lg font-medium">
              Dra alle 3 filer hit samtidig
            </p>
            <p className="text-sm text-muted-foreground">
              eller klikk for å velge
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">.PRD</Badge>
              <Badge variant="outline">.CUS</Badge>
              <Badge variant="outline">.OD0</Badge>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MultiFileDropZone;
