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
import AccessWarning from './upload/AccessWarning';
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

  const { toast } = useToast();
  const createProduct = useCreateProduct();
  const { data: existingProducts } = useProducts();
  const createCustomer = useCreateCustomer();
  const { data: existingCustomers } = useCustomers();
  const createOrder = useCreateOrder();

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
    [profile, toast, createProduct, existingProducts]
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
    [profile, toast, createCustomer, existingCustomers]
  );

  // Order handler no longer needs mappings in closure - they are passed directly
  const handleOrderUpload = useMemo(
    () => createOrderUploadHandler(
      profile,
      toast,
      createOrder,
      setUploadStatus,
      setUploadResults
    ),
    [profile, toast, createOrder]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Last opp data
          </DialogTitle>
        </DialogHeader>

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
