import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Phone, Mail, MapPin, Loader2, Trash2, Eye, Monitor } from 'lucide-react';
import { useCustomers, useDeleteCustomer, useDeleteAllCustomers, useUpdateCustomer } from '@/hooks/useCustomers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateCustomerDialog from '@/components/customers/CreateCustomerDialog';
import EditCustomerDialog from '@/components/customers/EditCustomerDialog';
import CustomerDetailsCard from '@/components/customers/CustomerDetailsCard';
import DisplayModeSelector from '@/components/customers/DisplayModeSelector';
import DisplayManagementCard from '@/components/customers/DisplayManagementCard';
import { Customer } from '@/types/database';

const Customers = () => {
  const { data: customers, isLoading, error } = useCustomers();
  const deleteCustomer = useDeleteCustomer();
  const deleteAllCustomers = useDeleteAllCustomers();
  const updateCustomer = useUpdateCustomer();
  const { toast } = useToast();
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  const handleDeleteCustomer = async (id: string) => {
    setDeletingCustomerId(id);
    try {
      await deleteCustomer.mutateAsync(id);
    } finally {
      setDeletingCustomerId(null);
    }
  };

  const handleDeleteAllCustomers = async () => {
    await deleteAllCustomers.mutateAsync();
  };

  const handleToggleDisplay = async (customer: Customer, hasDedicatedDisplay: boolean) => {
    try {
      await updateCustomer.mutateAsync({
        id: customer.id,
        has_dedicated_display: hasDedicatedDisplay,
      });
      toast({
        title: hasDedicatedDisplay ? "Privat display aktivert" : "Felles display aktivert",
        description: hasDedicatedDisplay 
          ? `${customer.name} har nå sitt eget private display`
          : `${customer.name} vises nå på felles display`,
      });
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke oppdatere display-innstilling",
        variant: "destructive",
      });
    }
  };

  const copyDisplayUrl = (displayPath: string) => {
    const fullUrl = `${window.location.origin}${displayPath}`;
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: "URL kopiert",
      description: "Display-URL er kopiert til utklippstavlen",
    });
  };

  const openDisplayUrl = (displayPath: string) => {
    const fullUrl = `${window.location.origin}${displayPath}`;
    window.open(fullUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Aktiv</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inaktiv</Badge>;
      case 'blocked':
        return <Badge variant="destructive">Blokkert</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

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

  const activeCustomers = customers?.filter(c => c.status === 'active') || [];
  const totalCustomers = customers?.length || 0;
  const dedicatedDisplayCustomers = customers?.filter(c => c.has_dedicated_display) || [];
  const sharedDisplayCustomers = customers?.filter(c => !c.has_dedicated_display) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kundeadministrasjon</h1>
          <p className="text-muted-foreground">
            Moderne display-løsninger for optimal kundeopplevelse
          </p>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!customers || customers.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Slett alle
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dette vil slette alle kunder permanent. Denne handlingen kan ikke angres.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Avbryt</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAllCustomers}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Slett alle
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ny Kunde
          </Button>
        </div>
      </div>

      {/* Display Management Card */}
      <DisplayManagementCard />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              Totale kunder
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalCustomers}</div>
            <p className="text-xs text-blue-600">
              Registrerte kunder
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              Aktive kunder
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{activeCustomers.length}</div>
            <p className="text-xs text-green-600">
              {totalCustomers > 0 ? Math.round((activeCustomers.length / totalCustomers) * 100) : 0}% av totale
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">
              Felles display
            </CardTitle>
            <Monitor className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{sharedDisplayCustomers.length}</div>
            <p className="text-xs text-purple-600">
              Kunder på hovedvisning
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-900">
              Private displays
            </CardTitle>
            <Monitor className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">{dedicatedDisplayCustomers.length}</div>
            <p className="text-xs text-indigo-600">
              Eksklusive visninger
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kunde Oversikt</CardTitle>
          <CardDescription>
            Moderne administrasjon av kunde-displays med avansert funksjonalitet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!customers || customers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Ingen kunder</h3>
              <p className="mt-1 text-sm text-gray-500">
                Kom i gang ved å opprette din første kunde.
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ny Kunde
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kundenummer</TableHead>
                  <TableHead>Navn</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Display Konfigurasjon</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead className="text-right">Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.customer_number || '-'}
                    </TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>
                      <DisplayModeSelector
                        customer={customer}
                        onToggleDisplay={handleToggleDisplay}
                        onCopyUrl={copyDisplayUrl}
                        onOpenUrl={openDisplayUrl}
                      />
                    </TableCell>
                    <TableCell>
                      {customer.address ? (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-32">{customer.address}</span>
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setViewingCustomer(customer)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Vis
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingCustomer(customer)}
                        >
                          Rediger
                        </Button>
                        <Button size="sm">
                          Ny Ordre
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={deletingCustomerId === customer.id}
                            >
                              {deletingCustomerId === customer.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Slett kunde</AlertDialogTitle>
                              <AlertDialogDescription>
                                Er du sikker på at du vil slette kunden "{customer.name}"? 
                                Denne handlingen kan ikke angres.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Avbryt</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Slett
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
    </div>
  );
};

export default Customers;
