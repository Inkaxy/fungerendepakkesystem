
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';

const Customers = () => {
  const { data: customers, isLoading, error } = useCustomers();

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
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Registrerte kunder
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
            <div className="text-2xl font-bold">{activeCustomers.length}</div>
            <p className="text-xs text-muted-foreground">
              {totalCustomers > 0 ? Math.round((activeCustomers.length / totalCustomers) * 100) : 0}% av totale
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Med e-post
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers?.filter(c => c.email).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Har registrert e-post
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Med telefon
            </CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers?.filter(c => c.phone).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Har registrert telefon
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
          {!customers || customers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Ingen kunder</h3>
              <p className="mt-1 text-sm text-gray-500">
                Kom i gang ved å opprette din første kunde.
              </p>
              <div className="mt-6">
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ny Kunde
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{customer.name}</span>
                      {getStatusBadge(customer.status)}
                    </div>
                    {customer.contact_person && (
                      <p className="text-sm text-gray-600">Kontakt: {customer.contact_person}</p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {customer.phone && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {customer.phone}
                        </div>
                      )}
                      {customer.email && (
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {customer.email}
                        </div>
                      )}
                    </div>
                    {customer.address && (
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {customer.address}
                      </div>
                    )}
                    <div className="text-xs text-gray-400">
                      Opprettet: {new Date(customer.created_at).toLocaleDateString('nb-NO')}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {customer.email && (
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-1" />
                        Kontakt
                      </Button>
                    )}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
