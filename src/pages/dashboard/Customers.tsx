import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, Monitor, UserPlus } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useCustomerActions } from '@/hooks/useCustomerActions';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CreateCustomerDialog from '@/components/customers/CreateCustomerDialog';
import EditCustomerDialog from '@/components/customers/EditCustomerDialog';
import CustomerDetailsCard from '@/components/customers/CustomerDetailsCard';
import CustomersHeader from '@/components/customers/CustomersHeader';
import CustomersTable from '@/components/customers/CustomersTable';
import EmptyCustomersState from '@/components/customers/EmptyCustomersState';
import QrCodeModal from '@/components/customers/QrCodeModal';
import DeleteAllCustomersDialog from '@/components/customers/DeleteAllCustomersDialog';
import { Customer } from '@/types/database';
import PageHeader from '@/components/shared/PageHeader';
import LoadingState from '@/components/shared/LoadingState';

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

  // Calculate stats
  const stats = useMemo(() => {
    const total = customers?.length || 0;
    const withDisplay = customers?.filter(c => c.has_dedicated_display).length || 0;
    const active = customers?.filter(c => c.status === 'active').length || 0;
    return { total, withDisplay, active };
  }, [customers]);

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
    console.log('Generate QR codes for all customers');
  };

  const handleBulkActions = () => {
    console.log('Bulk actions for selected customers:', selectedCustomers);
  };

  const handleDeleteAllCustomersConfirm = async () => {
    await handleDeleteAllCustomers();
    setShowDeleteAllDialog(false);
  };

  if (isLoading) {
    return <LoadingState message="Laster kundedata..." icon={Users} />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          icon={Users}
          title="Kunder"
          subtitle="Administrer dine kunder"
        />
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-8 text-center">
            <h3 className="font-semibold text-lg text-destructive mb-2">Noe gikk galt</h3>
            <p className="text-muted-foreground">Feil ved lasting av kunder: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const customersData = customers || [];

  if (customersData.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          icon={Users}
          title="Kunder"
          subtitle="Administrer dine kunder"
          actions={
            <Button onClick={() => setIsCreateDialogOpen(true)} className="hover-lift">
              <UserPlus className="h-4 w-4 mr-2" />
              Ny kunde
            </Button>
          }
        />
        <Card className="card-warm">
          <CardContent className="py-8">
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
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={Users}
        title="Kunder"
        subtitle="Administrer dine kunder og display-innstillinger"
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)} className="hover-lift">
            <UserPlus className="h-4 w-4 mr-2" />
            Ny kunde
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Totale kunder</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="stat-card-icon">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Med display</p>
              <p className="text-2xl font-bold text-foreground">{stats.withDisplay}</p>
            </div>
            <div className="stat-card-icon">
              <Monitor className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktive</p>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
            </div>
            <div className="stat-card-icon">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
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

      {/* Table */}
      <Card className="card-warm">
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

      {/* Dialogs */}
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
