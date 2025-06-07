
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Users, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import FileUploadSection from '../FileUploadSection';
import { UploadStatus } from './types';

interface UploadTabsProps {
  uploadStatus: UploadStatus;
  onProductUpload: (file: File) => void;
  onCustomerUpload: (file: File) => void;
  onOrderUpload: (file: File) => void;
  hasBakeryAccess: boolean;
}

const UploadTabs = ({
  uploadStatus,
  onProductUpload,
  onCustomerUpload,
  onOrderUpload,
  hasBakeryAccess
}: UploadTabsProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="products" className="flex items-center space-x-2">
          <Package className="w-4 h-4" />
          <span>Produkter (.PRD)</span>
          {getStatusIcon(uploadStatus.products)}
        </TabsTrigger>
        <TabsTrigger value="customers" className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>Kunder (.CUS)</span>
          {getStatusIcon(uploadStatus.customers)}
        </TabsTrigger>
        <TabsTrigger value="orders" className="flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Ordrer (.OD0)</span>
          {getStatusIcon(uploadStatus.orders)}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="mt-4">
        <FileUploadSection
          title="Last opp produktfiler"
          description="Last opp .PRD filer med produktinformasjon"
          acceptedTypes=".prd"
          onFileUpload={onProductUpload}
          isUploading={uploadStatus.products === 'uploading'}
          status={uploadStatus.products}
          exampleFormat="00123 Rundstykker hvete 1234567890123 25.50"
          formatDescription="Format: ProductID Produktnavn [metadata]"
          disabled={!hasBakeryAccess}
        />
      </TabsContent>

      <TabsContent value="customers" className="mt-4">
        <FileUploadSection
          title="Last opp kundefiler"
          description="Last opp .CUS filer med kundeinformasjon"
          acceptedTypes=".cus"
          onFileUpload={onCustomerUpload}
          isUploading={uploadStatus.customers === 'uploading'}
          status={uploadStatus.customers}
          exampleFormat="00010001    Kunde Navn    Adresse"
          formatDescription="Format: KundeID    Navn    Adresse (4+ mellomrom som separator)"
          disabled={!hasBakeryAccess || uploadStatus.products !== 'success'}
        />
      </TabsContent>

      <TabsContent value="orders" className="mt-4">
        <FileUploadSection
          title="Last opp ordrefiler"
          description="Last opp .OD0 filer med ordreinformasjon"
          acceptedTypes=".od0"
          onFileUpload={onOrderUpload}
          isUploading={uploadStatus.orders === 'uploading'}
          status={uploadStatus.orders}
          exampleFormat="12345 ABC1234567XYZ 003 IGNORE 20241201"
          formatDescription="Format: ProductID CompositeField Quantity IgnoredField Date"
          disabled={!hasBakeryAccess || uploadStatus.products !== 'success' || uploadStatus.customers !== 'success'}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UploadTabs;
