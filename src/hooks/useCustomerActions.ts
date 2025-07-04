
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

  const handleToggleDisplay = (customer: Customer, hasDedicatedDisplay: boolean) => {
    updateCustomer.mutate({
      id: customer.id,
      has_dedicated_display: hasDedicatedDisplay,
    });
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
