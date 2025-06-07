
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Users, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUploadSection from './FileUploadSection';
import { parseProductFile, parseCustomerFile, parseOrderFile } from '@/utils/fileParser';
import { useCreateCustomer } from '@/hooks/useCustomers';
import { useCreateProduct } from '@/hooks/useProducts';
import { useCreateOrder } from '@/hooks/useCreateOrder';

interface DataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadStatus {
  products: 'idle' | 'uploading' | 'success' | 'error';
  customers: 'idle' | 'uploading' | 'success' | 'error';
  orders: 'idle' | 'uploading' | 'success' | 'error';
}

const DataUploadModal = ({ isOpen, onClose }: DataUploadModalProps) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    products: 'idle',
    customers: 'idle',
    orders: 'idle'
  });
  const [uploadResults, setUploadResults] = useState<{
    products: any[];
    customers: any[];
    orders: any[];
  }>({
    products: [],
    customers: [],
    orders: []
  });

  const { toast } = useToast();
  const createCustomer = useCreateCustomer();
  const createProduct = useCreateProduct();
  const createOrder = useCreateOrder();

  const handleProductUpload = async (file: File) => {
    try {
      setUploadStatus(prev => ({ ...prev, products: 'uploading' }));
      
      const text = await file.text();
      const products = parseProductFile(text);
      
      console.log('Parsed products:', products);
      
      // Save products to database
      for (const product of products) {
        await createProduct.mutateAsync(product);
      }
      
      setUploadResults(prev => ({ ...prev, products }));
      setUploadStatus(prev => ({ ...prev, products: 'success' }));
      
      toast({
        title: "Produkter lastet opp",
        description: `${products.length} produkter ble importert`,
      });
    } catch (error) {
      console.error('Product upload error:', error);
      setUploadStatus(prev => ({ ...prev, products: 'error' }));
      toast({
        title: "Feil ved opplasting",
        description: `Kunne ikke laste opp produkter: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleCustomerUpload = async (file: File) => {
    try {
      setUploadStatus(prev => ({ ...prev, customers: 'uploading' }));
      
      const text = await file.text();
      const customers = parseCustomerFile(text);
      
      console.log('Parsed customers:', customers);
      
      // Save customers to database
      for (const customer of customers) {
        await createCustomer.mutateAsync(customer);
      }
      
      setUploadResults(prev => ({ ...prev, customers }));
      setUploadStatus(prev => ({ ...prev, customers: 'success' }));
      
      toast({
        title: "Kunder lastet opp",
        description: `${customers.length} kunder ble importert`,
      });
    } catch (error) {
      console.error('Customer upload error:', error);
      setUploadStatus(prev => ({ ...prev, customers: 'error' }));
      toast({
        title: "Feil ved opplasting",
        description: `Kunne ikke laste opp kunder: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleOrderUpload = async (file: File) => {
    if (uploadStatus.products !== 'success' || uploadStatus.customers !== 'success') {
      toast({
        title: "Mangler forutsetninger",
        description: "Du må laste opp produkter og kunder først",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadStatus(prev => ({ ...prev, orders: 'uploading' }));
      
      const text = await file.text();
      const orders = parseOrderFile(text, uploadResults.products, uploadResults.customers);
      
      console.log('Parsed orders:', orders);
      
      // Save orders to database
      for (const order of orders) {
        await createOrder.mutateAsync(order);
      }
      
      setUploadResults(prev => ({ ...prev, orders }));
      setUploadStatus(prev => ({ ...prev, orders: 'success' }));
      
      toast({
        title: "Ordrer lastet opp",
        description: `${orders.length} ordrer ble importert`,
      });
    } catch (error) {
      console.error('Order upload error:', error);
      setUploadStatus(prev => ({ ...prev, orders: 'error' }));
      toast({
        title: "Feil ved opplasting",
        description: `Kunne ikke laste opp ordrer: ${error.message}`,
        variant: "destructive",
      });
    }
  };

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Last opp data
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Viktig rekkefølge:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Last opp produkter (.PRD filer) først</li>
            <li>2. Last opp kunder (.CUS filer) deretter</li>
            <li>3. Last opp ordrer (.OD0 filer) til slutt</li>
          </ol>
        </div>

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
              onFileUpload={handleProductUpload}
              isUploading={uploadStatus.products === 'uploading'}
              status={uploadStatus.products}
              exampleFormat="00123 Rundstykker hvete 1234567890123 25.50"
              formatDescription="Format: ProductID Produktnavn [metadata]"
            />
          </TabsContent>

          <TabsContent value="customers" className="mt-4">
            <FileUploadSection
              title="Last opp kundefiler"
              description="Last opp .CUS filer med kundeinformasjon"
              acceptedTypes=".cus"
              onFileUpload={handleCustomerUpload}
              isUploading={uploadStatus.customers === 'uploading'}
              status={uploadStatus.customers}
              exampleFormat="00010001    Kunde Navn    Adresse"
              formatDescription="Format: KundeID    Navn    Adresse (4+ mellomrom som separator)"
              disabled={uploadStatus.products !== 'success'}
            />
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <FileUploadSection
              title="Last opp ordrefiler"
              description="Last opp .OD0 filer med ordreinformasjon"
              acceptedTypes=".od0"
              onFileUpload={handleOrderUpload}
              isUploading={uploadStatus.orders === 'uploading'}
              status={uploadStatus.orders}
              exampleFormat="12345 ABC1234567XYZ 003 IGNORE 20241201"
              formatDescription="Format: ProductID CompositeField Quantity IgnoredField Date"
              disabled={uploadStatus.products !== 'success' || uploadStatus.customers !== 'success'}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Lukk
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataUploadModal;
