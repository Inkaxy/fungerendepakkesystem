
import { useToast } from '@/hooks/use-toast';
import { useCreateCustomer } from '@/hooks/useCustomers';
import { parseCustomerFile } from '@/utils/fileParser';
import { IdMapping, UploadResults, UploadStatus } from './types';
import { UserProfile } from '@/stores/authStore';

export const useCustomerUpload = (
  profile: UserProfile | null,
  setUploadStatus: React.Dispatch<React.SetStateAction<UploadStatus>>,
  setCustomerIdMapping: React.Dispatch<React.SetStateAction<IdMapping>>,
  setUploadResults: React.Dispatch<React.SetStateAction<UploadResults>>
) => {
  const { toast } = useToast();
  const createCustomer = useCreateCustomer();

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
      
      const newCustomerMapping: IdMapping = {};
      const createdCustomers = [];
      
      for (const customer of customers) {
        const { original_id, ...customerData } = customer;
        const createdCustomer = await createCustomer.mutateAsync(customerData);
        
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

  return { handleCustomerUpload };
};
