
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, CloudDownload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { UploadStatus, IdMapping, UploadResults } from './upload/types';
import DebugInfo from './upload/DebugInfo';
import AccessWarning from './upload/AccessWarning';
import UploadInstructions from './upload/UploadInstructions';
import UploadTabs from './upload/UploadTabs';
import { useProductUpload } from './upload/useProductUpload';
import { useCustomerUpload } from './upload/useCustomerUpload';
import { useOrderUpload } from './upload/useOrderUpload';

interface DataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataUploadModal = ({ isOpen, onClose }: DataUploadModalProps) => {
  const navigate = useNavigate();
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

  const { handleProductUpload } = useProductUpload(
    profile, 
    setUploadStatus, 
    setProductIdMapping, 
    setUploadResults
  );

  const { handleCustomerUpload } = useCustomerUpload(
    profile, 
    setUploadStatus, 
    setCustomerIdMapping, 
    setUploadResults
  );

  const { handleOrderUpload } = useOrderUpload(
    profile,
    uploadStatus,
    productIdMapping,
    customerIdMapping,
    setUploadStatus,
    setUploadResults
  );

  const handleNavigateToFileSync = () => {
    onClose();
    navigate('/dashboard/file-sync');
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

        <DebugInfo 
          profile={profile}
          productIdMapping={productIdMapping}
          customerIdMapping={customerIdMapping}
        />

        <AccessWarning profile={profile} />

        <UploadInstructions />

        <UploadTabs
          uploadStatus={uploadStatus}
          onProductUpload={handleProductUpload}
          onCustomerUpload={handleCustomerUpload}
          onOrderUpload={handleOrderUpload}
          hasBakeryAccess={hasBakeryAccess}
        />

        <div className="flex justify-between items-center mt-6">
          <Button 
            variant="secondary" 
            onClick={handleNavigateToFileSync}
            className="flex items-center"
          >
            <CloudDownload className="w-4 h-4 mr-2" />
            Sett opp automatisk filhenting
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Lukk
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataUploadModal;
