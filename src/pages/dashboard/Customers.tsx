
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Phone, Mail, MapPin } from 'lucide-react';

const Customers = () => {
  const mockCustomers = [
    {
      id: 'CUST-001',
      name: 'Kafe Sentralen',
      contact: 'Maria Hansen',
      phone: '+47 123 45 678',
      email: 'maria@kafesentralen.no',
      address: 'Storgata 15, 0155 Oslo',
      status: 'active',
      orders: 45,
      totalSpent: '125.500 kr',
      lastOrder: '2025-06-07'
    },
    {
      id: 'CUST-002',
      name: 'Restaurant Nord',
      contact: 'Erik Johansen',
      phone: '+47 987 65 432',
      email: 'erik@restaurantnord.no',
      address: 'Nordahl Bruns gate 20, 0165 Oslo',
      status: 'active',
      orders: 28,
      totalSpent: '89.200 kr',
      lastOrder: '2025-06-06'
    },
    {
      id: 'CUST-003',
      name: 'Bakeri Sør',
      contact: 'Linda Andersen',
      phone: '+47 456 78 901',
      email: 'linda@bakerisor.no',
      address: 'Tøyengata 5, 0186 Oslo',
      status: 'inactive',
      orders: 12,
      totalSpent: '34.800 kr',
      lastOrder: '2025-05-15'
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kunder</h1>
          <p className="text-muted-foreground">
            Administrer kunderegisteret og kontaktinformasjon
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Ny Kunde
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totale kunder
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +3 denne måneden
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktive kunder
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">
              84% av totale
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nye denne måneden
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 fra forrige måned
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gjennomsnitt ordre
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              per kunde
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Kunde Oversikt</CardTitle>
          <CardDescription>
            Alle registrerte kunder og deres informasjon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{customer.name}</span>
                    {getStatusBadge(customer.status)}
                  </div>
                  <p className="text-sm text-gray-600">Kontakt: {customer.contact}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {customer.email}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    {customer.address}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{customer.orders} ordrer</span>
                    <span className="font-medium">{customer.totalSpent}</span>
                    <span>Siste ordre: {customer.lastOrder}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-1" />
                    Kontakt
                  </Button>
                  <Button variant="outline" size="sm">
                    Rediger
                  </Button>
                  <Button size="sm">
                    Ny Ordre
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
