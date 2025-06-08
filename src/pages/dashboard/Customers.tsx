
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useCustomerActions } from '@/hooks/useCustomerActions';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import CreateCustomerDialog from '@/components/customers/CreateCustomerDialog';
import EditCustomerDialog from '@/components/customers/EditCustomerDialog';
import CustomerDetailsCard from '@/components/customers/CustomerDetailsCard';
import DisplayManagementCard from '@/components/customers/DisplayManagementCard';
import CustomersHeader from '@/components/customers/CustomersHeader';
import CustomersStats from '@/components/customers/CustomersStats';
import CustomersTable from '@/components/customers/CustomersTable';
import EmptyCustomersState from '@/components/customers/EmptyCustomersState';
import { Customer } from '@/types/database';

const Customers = () => {
  const { data: customers, isLoading, error } = useCustomers();
  const {
    deletingCustomerId,
    handleDeleteCustomer,
    handleDeleteAllCustomers,
    handleToggleDisplay,
    copyDisplayUrl,
    openDisplayUrl,
  } = useCustomerActions();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Feil ved lasting av kunder: {error.message}</p>
      </div>
    );
  }

  const customersData = customers || [];

  return (
    <div className="space-y-6">
      <CustomersHeader
        customersCount={customersData.length}
        onCreateCustomer={() => setIsCreateDialogOpen(true)}
        onDeleteAllCustomers={handleDeleteAllCustomers}
      />

      <DisplayManagementCard />

      <CustomersStats customers={customersData} />

      <Card>
        <CardHeader>
          <CardTitle>Kunde Oversikt</CardTitle>
          <CardDescription>
            Moderne administrasjon av kunde-displays med avansert funksjonalitet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customersData.length === 0 ? (
            <EmptyCustomersState onCreateCustomer={() => setIsCreateDialogOpen(true)} />
          ) : (
            <CustomersTable
              customers={customersData}
              deletingCustomerId={deletingCustomerId}
              onViewCustomer={setViewingCustomer}
              onEditCustomer={setEditingCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onToggleDisplay={handleToggleDisplay}
              onCopyUrl={copyDisplayUrl}
              onOpenUrl={openDisplayUrl}
            />
          )}
        </CardContent>
      </Card>

      <CreateCustomerDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
      
      <EditCustomerDialog 
        customer={editingCustomer}
        open={!!editingCustomer}
        onOpenChange={(open) => !open && setEditingCustomer(null)}
      />

      <Dialog open={!!viewingCustomer} onOpenChange={(open) => !open && setViewingCustomer(null)}>
        <DialogContent className="max-w-2xl">
          {viewingCustomer && (
            <CustomerDetailsCard 
              customer={viewingCustomer}
              onEdit={() => {
                setEditingCustomer(viewingCustomer);
                setViewingCustomer(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
