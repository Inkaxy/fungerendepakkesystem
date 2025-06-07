
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
import { useAuthStore } from '@/stores/authStore';

interface DataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadStatus {
  products: 'idle' | 'uploading' | 'success' | 'error';
  customers: 'idle' | 'uploading' | 'success' | 'error';
  orders: 'idle' | 'uploading' | 'success' | 'error';
}

interface IdMapping {
  [originalId: string]: string; // originalId -> databaseUUID
}

const DataUploadModal = ({ isOpen, onClose }: DataUploadModalProps) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    products: 'idle',
    customers: 'idle',
    orders: 'idle'
  });
  
  // Store ID mappings
  const [productIdMapping, setProductIdMapping] = useState<IdMapping>({});
  const [customerIdMapping, setCustomerIdMapping] = useState<IdMapping>({});
  
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
  const { profile } = useAuthStore();

  console.log('DataUploadModal - Current profile:', profile);
  console.log('DataUploadModal - Bakery ID:', profile?.bakery_id);

  const handleProductUpload = async (file: File) => {
    console.log('Product upload started with bakery_id:', profile?.bakery_id);
    
    if (!profile?.bakery_id) {
      console.error('No bakery_id found in profile:', profile);
      toast({
        title: "Feil",
        description: `Du må tilhøre et bakeri for å laste opp produkter. Profil: ${profile?.name}, Bakeri ID: ${profile?.bakery_id}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadStatus(prev => ({ ...prev, products: 'uploading' }));
      
      const text = await file.text();
      const products = parseProductFile(text, profile.bakery_id);
      
      console.log('Parsed products:', products);
      
      // Store ID mappings as we create products
      const newProductMapping: IdMapping = {};
      const createdProducts = [];
      
      // Save products to database and build mapping
      for (const product of products) {
        console.log('Creating product:', product);
        const { original_id, ...productData } = product; // Extract original_id
        const createdProduct = await createProduct.mutateAsync(productData);
        
        // Store mapping: original numeric ID -> database UUID
        newProductMapping[original_id] = createdProduct.id;
        createdProducts.push(createdProduct);
        
        console.log(`Mapped product ID ${original_id} -> ${createdProduct.id}`);
      }
      
      setProductIdMapping(newProductMapping);
      setUploadResults(prev => ({ ...prev, products: createdProducts }));
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
    if (!profile?.bakery_id) {
      toast({
        title: "Feil",
        description: "Du må tilhøre et bakeri for å laste opp kunder",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadStatus(prev => ({ ...prev, customers: 'uploading' }));
      
      const text = await file.text();
      const customers = parseCustomerFile(text, profile.bakery_id);
      
      console.log('Parsed customers:', customers);
      
      // Store ID mappings as we create customers
      const newCustomerMapping: IdMapping = {};
      const createdCustomers = [];
      
      // Save customers to database and build mapping
      for (const customer of customers) {
        const { original_id, ...customerData } = customer; // Extract original_id
        const createdCustomer = await createCustomer.mutateAsync(customerData);
        
        // Store mapping: original numeric ID -> database UUID
        newCustomerMapping[original_id] = createdCustomer.id;
        createdCustomers.push(createdCustomer);
        
        console.log(`Mapped customer ID ${original_id} -> ${createdCustomer.id}`);
      }
      
      setCustomerIdMapping(newCustomerMapping);
      setUploadResults(prev => ({ ...prev, customers: createdCustomers }));
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
    if (!profile?.bakery_id) {
      toast({
        title: "Feil",
        description: "Du må tilhøre et bakeri for å laste opp ordrer",
        variant: "destructive",
      });
      return;
    }

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
      const orders = parseOrderFile(text, profile.bakery_id);
      
      console.log('Parsed orders:', orders);
      console.log('Product ID mapping:', productIdMapping);
      console.log('Customer ID mapping:', customerIdMapping);
      
      const createdOrders = [];
      
      // Convert orders using ID mappings
      for (const order of orders) {
        // Convert customer ID using mapping
        const customerUuid = customerIdMapping[order.customer_original_id];
        if (!customerUuid) {
          console.error(`No mapping found for customer ID: ${order.customer_original_id}`);
          toast({
            title: "Feil ved ordreopprettelse",
            description: `Kunde med ID ${order.customer_original_id} ikke funnet. Sørg for at kunder er lastet opp først.`,
            variant: "destructive",
          });
          continue;
        }
        
        // Convert product IDs using mapping
        const convertedOrderProducts = [];
        for (const orderProduct of order.order_products) {
          const productUuid = productIdMapping[orderProduct.product_original_id];
          if (!productUuid) {
            console.error(`No mapping found for product ID: ${orderProduct.product_original_id}`);
            toast({
              title: "Feil ved ordreopprettelse",
              description: `Produkt med ID ${orderProduct.product_original_id} ikke funnet. Sørg for at produkter er lastet opp først.`,
              variant: "destructive",
            });
            continue;
          }
          
          convertedOrderProducts.push({
            product_id: productUuid, // Use UUID instead of original ID
            quantity: orderProduct.quantity,
            packing_status: orderProduct.packing_status
          });
        }
        
        // Skip order if no valid products
        if (convertedOrderProducts.length === 0) {
          console.warn(`Skipping order ${order.order_number} - no valid products found`);
          continue;
        }
        
        // Create order with converted IDs
        const orderToCreate = {
          order_number: order.order_number,
          delivery_date: order.delivery_date,
          status: order.status,
          customer_id: customerUuid, // Use UUID instead of original ID
          bakery_id: order.bakery_id,
          order_products: convertedOrderProducts
        };
        
        console.log('Creating order:', orderToCreate);
        const createdOrder = await createOrder.mutateAsync(orderToCreate);
        createdOrders.push(createdOrder);
      }
      
      setUploadResults(prev => ({ ...prev, orders: createdOrders }));
      setUploadStatus(prev => ({ ...prev, orders: 'success' }));
      
      toast({
        title: "Ordrer lastet opp",
        description: `${createdOrders.length} ordrer ble importert`,
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

  // Check if user has bakery access
  const hasBakeryAccess = !!profile?.bakery_id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Last opp data
          </DialogTitle>
        </DialogHeader>

        {/* Debug information */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
          <div><strong>Debug info:</strong></div>
          <div>Bruker: {profile?.name || 'Ikke lastet'}</div>
          <div>Bakeri ID: {profile?.bakery_id || 'Ikke satt'}</div>
          <div>Bakeri navn: {profile?.bakery_name || 'Ikke satt'}</div>
          <div>Rolle: {profile?.role || 'Ikke satt'}</div>
          <div>Har bakeri-tilgang: {hasBakeryAccess ? 'Ja' : 'Nei'}</div>
          <div>Produkter mappet: {Object.keys(productIdMapping).length}</div>
          <div>Kunder mappet: {Object.keys(customerIdMapping).length}</div>
        </div>

        {!hasBakeryAccess && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Mangler bakeri-tilgang:</h4>
            <p className="text-sm text-red-700">
              Du må tilhøre et bakeri for å kunne laste opp data. Kontakt en administrator for å få tildelt bakeri-tilgang.
            </p>
            <p className="text-xs text-red-600 mt-2">
              Teknisk info: bakery_id er {profile?.bakery_id ? `"${profile.bakery_id}"` : 'null/undefined'}
            </p>
          </div>
        )}

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Viktig rekkefølge:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Last opp produkter (.PRD filer) først</li>
            <li>2. Last opp kunder (.CUS filer) deretter</li>
            <li>3. Last opp ordrer (.OD0 filer) til slutt</li>
          </ol>
          <p className="text-xs text-blue-600 mt-2">
            Systemet lager automatisk mapping mellom numeriske ID-er i filene og database UUID-er.
          </p>
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
              disabled={!hasBakeryAccess}
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
              disabled={!hasBakeryAccess || uploadStatus.products !== 'success'}
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
              disabled={!hasBakeryAccess || uploadStatus.products !== 'success' || uploadStatus.customers !== 'success'}
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
