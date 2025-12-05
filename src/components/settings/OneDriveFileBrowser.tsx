import React, { useState } from 'react';
import { FileText, RefreshCw, Download, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOneDriveFiles, useOneDriveImport, OneDriveFile } from '@/hooks/useOneDriveFiles';
import { useOneDriveImportConfig } from '@/hooks/useOneDriveConnection';

const FILE_TYPE_COLORS: Record<string, string> = {
  'PRD': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'CUS': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'OD0': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

const FILE_TYPE_LABELS: Record<string, string> = {
  'PRD': 'Produkter',
  'CUS': 'Kunder',
  'OD0': 'Ordrer',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const OneDriveFileBrowser: React.FC = () => {
  const { data: config } = useOneDriveImportConfig();
  const folderPath = config?.folder_path || '/Pakkesystem';
  
  const { data, isLoading, error, refetch, isRefetching } = useOneDriveFiles(folderPath);
  const importMutation = useOneDriveImport();
  
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const files = data?.files || [];

  const toggleFile = (fileId: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(f => f.id)));
    }
  };

  const handleImport = async () => {
    const filesToImport = files.filter(f => selectedFiles.has(f.id));
    await importMutation.mutateAsync(filesToImport);
    setSelectedFiles(new Set());
  };

  const selectedFilesList = files.filter(f => selectedFiles.has(f.id));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Filer i OneDrive
            </CardTitle>
            <CardDescription>
              {folderPath} • {data?.importableFiles || 0} importerbare filer
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Oppdater
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{(error as Error).message}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Ingen importerbare filer funnet i mappen</p>
            <p className="text-xs mt-1">Støttede filtyper: .PRD, .CUS, .OD0</p>
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="flex items-center justify-between pb-2 border-b">
              <button
                onClick={selectAll}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {selectedFiles.size === files.length ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                Velg alle ({files.length})
              </button>
              <span className="text-xs text-muted-foreground">
                {selectedFiles.size} valgt
              </span>
            </div>

            {/* File List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedFiles.has(file.id) 
                      ? 'bg-primary/5 border-primary/30' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleFile(file.id)}
                >
                  <Checkbox
                    checked={selectedFiles.has(file.id)}
                    onCheckedChange={() => toggleFile(file.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {new Date(file.lastModified).toLocaleString('nb-NO')}
                    </p>
                  </div>
                  <Badge className={FILE_TYPE_COLORS[file.fileType] || 'bg-muted'}>
                    {FILE_TYPE_LABELS[file.fileType] || file.fileType}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Import Button */}
            <div className="pt-4 border-t space-y-3">
              {selectedFiles.size > 0 && (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Valgte filer vil importeres i rekkefølge:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    {selectedFilesList.filter(f => f.fileType === 'PRD').length > 0 && (
                      <li>Produkter (.PRD) - {selectedFilesList.filter(f => f.fileType === 'PRD').length} fil(er)</li>
                    )}
                    {selectedFilesList.filter(f => f.fileType === 'CUS').length > 0 && (
                      <li>Kunder (.CUS) - {selectedFilesList.filter(f => f.fileType === 'CUS').length} fil(er)</li>
                    )}
                    {selectedFilesList.filter(f => f.fileType === 'OD0').length > 0 && (
                      <li>Ordrer (.OD0) - {selectedFilesList.filter(f => f.fileType === 'OD0').length} fil(er)</li>
                    )}
                  </ol>
                </div>
              )}
              
              <Button 
                onClick={handleImport}
                disabled={selectedFiles.size === 0 || importMutation.isPending}
                className="w-full"
              >
                {importMutation.isPending ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {importMutation.isPending 
                  ? 'Importerer...' 
                  : `Importer ${selectedFiles.size} fil${selectedFiles.size !== 1 ? 'er' : ''}`
                }
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OneDriveFileBrowser;
