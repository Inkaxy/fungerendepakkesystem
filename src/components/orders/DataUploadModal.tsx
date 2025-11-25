
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { useCreateProduct, useProducts } from '@/hooks/useProducts';
import { useCreateCustomer, useCustomers } from '@/hooks/useCustomers';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { UploadStatus, IdMapping, UploadResults } from './upload/types';
import DebugInfo from './upload/DebugInfo';
import AccessWarning from './upload/AccessWarning';
import UploadInstructions from './upload/UploadInstructions';
import SimultaneousFileUpload from './upload/SimultaneousFileUpload';
import { createProductUploadHandler } from './upload/productUploadHandler';
import { createCustomerUploadHandler } from './upload/customerUploadHandler';
import { createOrderUploadHandler } from './upload/orderUploadHandler';

interface DataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataUploadModal = ({ isOpen, onClose }: DataUploadModalProps) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    products: 'idle',
    customers: 'idle',
    orders: 'idle'
  });
  
  const [productIdMapping, setProductIdMapping] = useState<IdMapping>({});
  const [customerIdMapping, setCustomerIdMapping] = useState<IdMapping>({});
  
  const [uploadResults, setUploadResults] = useState<UploadResults>({
    products: [],
    customers: [],
    orders: []
  });

  const { profile } = useAuthStore();
  const hasBakeryAccess = !!profile?.bakery_id;

  // Call all hooks at the top level
  const { toast } = useToast();
  const createProduct = useCreateProduct();
  const { data: existingProducts } = useProducts();
  const createCustomer = useCreateCustomer();
  const { data: existingCustomers } = useCustomers();
  const createOrder = useCreateOrder();

  // Create stable handler functions using useMemo
  const handleProductUpload = useMemo(
    () => createProductUploadHandler(
      profile,
      toast,
      createProduct,
      existingProducts,
      setUploadStatus,
      setProductIdMapping,
      setUploadResults
    ),
    [profile, toast, createProduct, existingProducts, setUploadStatus, setProductIdMapping, setUploadResults]
  );

  const handleCustomerUpload = useMemo(
    () => createCustomerUploadHandler(
      profile,
      toast,
      createCustomer,
      existingCustomers,
      setUploadStatus,
      setCustomerIdMapping,
      setUploadResults
    ),
    [profile, toast, createCustomer, existingCustomers, setUploadStatus, setCustomerIdMapping, setUploadResults]
  );

  const handleOrderUpload = useMemo(
    () => createOrderUploadHandler(
      profile,
      toast,
      createOrder,
      uploadStatus,
      productIdMapping,
      customerIdMapping,
      setUploadStatus,
      setUploadResults
    ),
    [profile, toast, createOrder, uploadStatus, productIdMapping, customerIdMapping, setUploadStatus, setUploadResults]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Last opp data
          </DialogTitle>
        </DialogHeader>

        <DebugInfo 
          profile={profile}
          productIdMapping={productIdMapping}
          customerIdMapping={customerIdMapping}
        />

        <AccessWarning profile={profile} />

        <SimultaneousFileUpload
          uploadStatus={uploadStatus}
          uploadResults={uploadResults}
          onProductUpload={handleProductUpload}
          onCustomerUpload={handleCustomerUpload}
          onOrderUpload={handleOrderUpload}
          hasBakeryAccess={hasBakeryAccess}
        />

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
