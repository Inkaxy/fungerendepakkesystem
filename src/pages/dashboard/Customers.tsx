
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import CustomersHeader from '@/components/customers/CustomersHeader';
import CustomersTable from '@/components/customers/CustomersTable';
import EmptyCustomersState from '@/components/customers/EmptyCustomersState';
import QrCodeModal from '@/components/customers/QrCodeModal';
import DeleteAllCustomersDialog from '@/components/customers/DeleteAllCustomersDialog';
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
  const [qrCodeCustomerId, setQrCodeCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  // Filter customers based on search term
  const filteredCustomers = useMemo(() => {
    if (!customers || !searchTerm) return customers || [];
    
    const searchLower = searchTerm.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(searchLower) ||
      customer.address?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.toLowerCase().includes(searchLower) ||
      customer.customer_number?.toLowerCase().includes(searchLower)
    );
  }, [customers, searchTerm]);

  const handleSelectCustomer = (customerId: string, selected: boolean) => {
    setSelectedCustomers(prev => 
      selected 
        ? [...prev, customerId]
        : prev.filter(id => id !== customerId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedCustomers(selected ? filteredCustomers.map(c => c.id) : []);
  };

  const handleGenerateQrCodes = () => {
    // TODO: Implement QR code generation for all customers
    console.log('Generate QR codes for all customers');
  };

  const handleBulkActions = () => {
    // TODO: Implement bulk actions
    console.log('Bulk actions for selected customers:', selectedCustomers);
  };

  const handleDeleteAllCustomersConfirm = async () => {
    await handleDeleteAllCustomers();
    setShowDeleteAllDialog(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto" />
          <p className="text-gray-600">Laster kundedata...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-600 space-y-2">
          <h3 className="font-semibold text-lg">Noe gikk galt</h3>
          <p>Feil ved lasting av kunder: {error.message}</p>
        </div>
      </div>
    );
  }

  const customersData = customers || [];

  if (customersData.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <EmptyCustomersState onCreateCustomer={() => setIsCreateDialogOpen(true)} />
          </CardContent>
        </Card>
        
        <CreateCustomerDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <CustomersHeader
        customersCount={filteredCustomers.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateCustomer={() => setIsCreateDialogOpen(true)}
        onGenerateQrCodes={handleGenerateQrCodes}
        onBulkActions={handleBulkActions}
        onDeleteAllCustomers={() => setShowDeleteAllDialog(true)}
        selectedCount={selectedCustomers.length}
      />

      <Card>
        <CardContent className="p-0">
          <CustomersTable
            customers={filteredCustomers}
            selectedCustomers={selectedCustomers}
            onSelectCustomer={handleSelectCustomer}
            onSelectAll={handleSelectAll}
            deletingCustomerId={deletingCustomerId}
            onViewCustomer={setViewingCustomer}
            onEditCustomer={setEditingCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onToggleDisplay={handleToggleDisplay}
            onCopyUrl={copyDisplayUrl}
            onOpenUrl={openDisplayUrl}
            onShowQrCode={(customer) => setQrCodeCustomerId(customer.id)}
          />
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

      <QrCodeModal
        customerId={qrCodeCustomerId}
        isOpen={!!qrCodeCustomerId}
        onClose={() => setQrCodeCustomerId(null)}
        onToggleDisplay={handleToggleDisplay}
        onCopyUrl={copyDisplayUrl}
        onOpenUrl={openDisplayUrl}
      />

      <DeleteAllCustomersDialog
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
        customersCount={customersData.length}
        onConfirm={handleDeleteAllCustomersConfirm}
        isLoading={false}
      />
    </div>
  );
};

export default Customers;
