import { parseCustomerFile } from '@/utils/fileParser';
import { IdMapping, UploadResults, UploadStatus } from './types';
import { UserProfile } from '@/stores/authStore';

export const createCustomerUploadHandler = (
  profile: UserProfile | null,
  toast: any,
  createCustomer: any,
  existingCustomers: any[] | undefined,
  setUploadStatus: React.Dispatch<React.SetStateAction<UploadStatus>>,
  setCustomerIdMapping: React.Dispatch<React.SetStateAction<IdMapping>>,
  setUploadResults: React.Dispatch<React.SetStateAction<UploadResults>>
) => {
  return async (file: File): Promise<IdMapping> => {
    if (!profile?.bakery_id) {
      toast({
        title: "Feil",
        description: "Du må tilhøre et bakeri for å laste opp kunder",
        variant: "destructive",
      });
      return {};
    }

    try {
      setUploadStatus(prev => ({ ...prev, customers: 'uploading' }));
      
      const text = await file.text();
      console.log('Customer file content preview:', text.slice(0, 200));
      
      const customers = parseCustomerFile(text, profile.bakery_id);
      
      console.log('Parsed customers from file:', customers);
      
      const newCustomerMapping: IdMapping = {};
      const createdCustomers = [];
      let newCustomersCount = 0;
      let existingCustomersCount = 0;
      
      // Create a map of existing customers by customer_number for quick lookup
      const existingCustomerMap = new Map();
      if (existingCustomers) {
        existingCustomers.forEach(customer => {
          if (customer.customer_number) {
            existingCustomerMap.set(customer.customer_number, customer);
          }
        });
      }
      
      for (const customer of customers) {
        const { original_id, customer_number, ...customerData } = customer;
        
        // Check if customer already exists by customer_number
        const existingCustomer = customer_number ? existingCustomerMap.get(customer_number) : null;
        
        if (existingCustomer) {
          // Use customer_number as the mapping key for order lookup
          newCustomerMapping[customer_number] = existingCustomer.id;
          createdCustomers.push(existingCustomer);
          existingCustomersCount++;
        } else {
          const createdCustomer = await createCustomer.mutateAsync({ 
            customer_number, 
            ...customerData 
          });
          
          // Use customer_number as the mapping key for order lookup
          newCustomerMapping[customer_number] = createdCustomer.id;
          createdCustomers.push(createdCustomer);
          newCustomersCount++;
        }
      }
      
      console.log('Final customer mapping:', newCustomerMapping);
      
      setCustomerIdMapping(newCustomerMapping);
      setUploadResults(prev => ({ ...prev, customers: createdCustomers }));
      setUploadStatus(prev => ({ ...prev, customers: 'success' }));
      
      const totalCustomers = newCustomersCount + existingCustomersCount;
      let description = `${totalCustomers} kunder behandlet`;
      
      if (newCustomersCount > 0 && existingCustomersCount > 0) {
        description += ` (${newCustomersCount} nye, ${existingCustomersCount} eksisterende)`;
      } else if (newCustomersCount > 0) {
        description += ` (${newCustomersCount} nye kunder opprettet)`;
      } else if (existingCustomersCount > 0) {
        description += ` (alle ${existingCustomersCount} kunder eksisterte allerede)`;
      }
      
      toast({
        title: "Kunder lastet opp",
        description,
      });
      
      return newCustomerMapping;
    } catch (error) {
      console.error('Customer upload error:', error);
      setUploadStatus(prev => ({ ...prev, customers: 'error' }));
      toast({
        title: "Feil ved opplasting",
        description: `Kunne ikke laste opp kunder: ${error.message}`,
        variant: "destructive",
      });
      return {};
    }
  };
};
