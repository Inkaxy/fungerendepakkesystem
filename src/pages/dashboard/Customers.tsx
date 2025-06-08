
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
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
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center text-2xl mx-auto">
            🏪
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto" />
          <p className="text-gray-600 font-medium">Laster kundedata...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
          ⚠️
        </div>
        <div className="text-red-600 space-y-2">
          <h3 className="font-semibold text-lg">Noe gikk galt</h3>
          <p>Feil ved lasting av kunder: {error.message}</p>
        </div>
      </div>
    );
  }

  const customersData = customers || [];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <CustomersHeader
        customersCount={customersData.length}
        onCreateCustomer={() => setIsCreateDialogOpen(true)}
        onDeleteAllCustomers={handleDeleteAllCustomers}
      />

      <DisplayManagementCard />

      <CustomersStats customers={customersData} />

      <Card className="border-2 border-gray-100 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-white text-lg">
              📋
            </div>
            <div>
              <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
                <span>Kunde Oversikt</span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Moderne administrasjon av kunde-displays med avansert funksjonalitet
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
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
        <DialogContent className="max-w-2xl border-2 border-blue-100">
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
