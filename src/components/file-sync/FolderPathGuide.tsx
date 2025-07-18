import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FolderOpen, Info } from 'lucide-react';

interface FolderPathGuideProps {
  serviceType: string;
}

export const FolderPathGuide = ({ serviceType }: FolderPathGuideProps) => {
  const getExamples = () => {
    switch (serviceType) {
      case 'onedrive':
        return {
          title: 'OneDrive mappe-eksempler:',
          examples: [
            '/Documents/Bakery Files',
            '/Shared/Orders',
            '/MyFiles/CSV-exports'
          ],
          note: 'Bruk / som skilletegn, ikke \\'
        };
      case 'google_drive':
        return {
          title: 'Google Drive mappe-eksempler:',
          examples: [
            '/Bakery Data',
            '/Shared with me/Orders',
            '/My Drive/Export Files'
          ],
          note: 'Bruk mappens fulle sti fra rot-mappen'
        };
      case 'ftp':
      case 'sftp':
        return {
          title: 'FTP/SFTP mappe-eksempler:',
          examples: [
            '/home/user/uploads',
            '/var/ftp/files',
            '/public_html/data',
            'uploads/bakery'
          ],
          note: 'Bruk Unix-stil stier med / som skilletegn'
        };
      default:
        return null;
    }
  };

  const examples = getExamples();

  if (!examples) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Spesifiser hvilken mappe systemet skal hente filer fra. La stå tom for å hente fra rot-mappen.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <FolderOpen className="h-4 w-4" />
      <AlertDescription>
        <strong>{examples.title}</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          {examples.examples.map((example, index) => (
            <li key={index} className="font-mono text-sm">{example}</li>
          ))}
        </ul>
        <p className="mt-2 text-sm"><strong>Tips:</strong> {examples.note}</p>
      </AlertDescription>
    </Alert>
  );
};