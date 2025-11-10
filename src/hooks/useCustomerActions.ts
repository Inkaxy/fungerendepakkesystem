
import { useState } from 'react';
import { useDeleteCustomer, useDeleteAllCustomers, useUpdateCustomer } from '@/hooks/useCustomers';
import { useToast } from '@/hooks/use-toast';
import { Customer } from '@/types/database';
import { getDisplayPath, getDisplayUrl } from '@/utils/displayUtils';

export const useCustomerActions = () => {
  const deleteCustomer = useDeleteCustomer();
  const deleteAllCustomers = useDeleteAllCustomers();
  const updateCustomer = useUpdateCustomer();
  const { toast } = useToast();
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  const handleDeleteCustomer = async (id: string) => {
    setDeletingCustomerId(id);
    try {
      await deleteCustomer.mutateAsync(id);
      toast({
        title: "Suksess",
        description: "Kunde slettet",
      });
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke slette kunde",
        variant: "destructive",
      });
    } finally {
      setDeletingCustomerId(null);
    }
  };

  const handleDeleteAllCustomers = async () => {
    try {
      await deleteAllCustomers.mutateAsync();
      toast({
        title: "Suksess",
        description: "Alle kunder slettet",
      });
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke slette alle kunder",
        variant: "destructive",
      });
    }
  };

  const handleToggleDisplay = async (customer: Customer, hasDedicatedDisplay: boolean) => {
    try {
      // Prepare update data
      const updates: any = {
        has_dedicated_display: hasDedicatedDisplay,
      };
      
      if (hasDedicatedDisplay) {
        // Switching to dedicated display
        // Generate display_url if it doesn't exist
        if (!customer.display_url) {
          updates.display_url = `display-${crypto.randomUUID().substring(0, 8)}`;
        }
      } else {
        // Switching to shared display
        // Remove display_url (use undefined instead of null for type safety)
        updates.display_url = undefined;
      }
      
      await updateCustomer.mutateAsync({
        id: customer.id,
        ...updates,
      });
      
      // Toast håndteres av useUpdateCustomer med optimistic updates
    } catch (error) {
      console.error('Toggle display error:', error);
      // Feil-håndtering gjøres av useUpdateCustomer
    }
  };

  const copyDisplayUrl = (displayPath: string) => {
    const fullUrl = `${window.location.origin}${displayPath}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      toast({
        title: "URL kopiert",
        description: "Display-URL er kopiert til utklippstavlen",
      });
    }).catch(() => {
      toast({
        title: "Feil",
        description: "Kunne ikke kopiere URL",
        variant: "destructive",
      });
    });
  };

  const openDisplayUrl = (displayPath: string) => {
    const fullUrl = `${window.location.origin}${displayPath}`;
    window.open(fullUrl, '_blank');
  };

  return {
    deletingCustomerId,
    handleDeleteCustomer,
    handleDeleteAllCustomers,
    handleToggleDisplay,
    copyDisplayUrl,
    openDisplayUrl,
  };
};
