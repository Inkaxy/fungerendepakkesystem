
import { useToast } from '@/hooks/use-toast';
import { useCreateCustomer, useCustomers } from '@/hooks/useCustomers';
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
  const { data: existingCustomers } = useCustomers();

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
      console.log('Customer file content preview:', text.slice(0, 200));
      
      const customers = parseCustomerFile(text, profile.bakery_id);
      
      console.log('Parsed customers from file:', customers);
      console.log('Existing customers in database:', existingCustomers);
      
      const newCustomerMapping: IdMapping = {};
      const createdCustomers = [];
      let newCustomersCount = 0;
      let existingCustomersCount = 0;
      let customersWithNumbers = 0;
      let customersWithoutNumbers = 0;
      
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
        
        // Track customers with/without numbers
        if (customer_number) {
          customersWithNumbers++;
        } else {
          customersWithoutNumbers++;
        }
        
        // Check if customer already exists by customer_number
        const existingCustomer = customer_number ? existingCustomerMap.get(customer_number) : null;
        
        if (existingCustomer) {
          // Customer already exists, use existing ID
          // FIXED: Use customer_number (processed) as the mapping key instead of original_id
          newCustomerMapping[customer_number || original_id] = existingCustomer.id;
          // Also map the original_id for backward compatibility
          if (original_id !== customer_number) {
            newCustomerMapping[original_id] = existingCustomer.id;
          }
          createdCustomers.push(existingCustomer);
          existingCustomersCount++;
          console.log(`Customer ${customer_number} already exists, using existing ID: ${existingCustomer.id}`);
          console.log(`Mapping created: ${customer_number} -> ${existingCustomer.id}`);
          if (original_id !== customer_number) {
            console.log(`Mapping created: ${original_id} -> ${existingCustomer.id}`);
          }
        } else {
          // Customer doesn't exist, create new one
          console.log('Creating new customer with data:', { customer_number, ...customerData });
          const createdCustomer = await createCustomer.mutateAsync({ 
            customer_number, 
            ...customerData 
          });
          
          // FIXED: Use customer_number (processed) as the primary mapping key
          newCustomerMapping[customer_number || original_id] = createdCustomer.id;
          // Also map the original_id for backward compatibility
          if (original_id !== customer_number) {
            newCustomerMapping[original_id] = createdCustomer.id;
          }
          createdCustomers.push(createdCustomer);
          newCustomersCount++;
          
          console.log(`Created new customer ${customer_number} with ID: ${createdCustomer.id}`);
          console.log(`Mapping created: ${customer_number} -> ${createdCustomer.id}`);
          if (original_id !== customer_number) {
            console.log(`Mapping created: ${original_id} -> ${createdCustomer.id}`);
          }
        }
      }
      
      console.log('Final customer mapping:', newCustomerMapping);
      setCustomerIdMapping(newCustomerMapping);
      setUploadResults(prev => ({ ...prev, customers: createdCustomers }));
      setUploadStatus(prev => ({ ...prev, customers: 'success' }));
      
      // Show detailed message about new vs existing customers and number statistics
      const totalCustomers = newCustomersCount + existingCustomersCount;
      let description = `${totalCustomers} kunder behandlet`;
      
      if (newCustomersCount > 0 && existingCustomersCount > 0) {
        description += ` (${newCustomersCount} nye, ${existingCustomersCount} eksisterende)`;
      } else if (newCustomersCount > 0) {
        description += ` (${newCustomersCount} nye kunder opprettet)`;
      } else if (existingCustomersCount > 0) {
        description += ` (alle ${existingCustomersCount} kunder eksisterte allerede)`;
      }
      
      if (customersWithNumbers > 0) {
        description += `. ${customersWithNumbers} kunder har kundenummer`;
      }
      
      if (customersWithoutNumbers > 0) {
        description += `, ${customersWithoutNumbers} mangler kundenummer`;
      }
      
      toast({
        title: "Kunder lastet opp",
        description,
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
