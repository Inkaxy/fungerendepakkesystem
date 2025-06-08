
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types/database';
import { User, Phone, Mail, MapPin, Calendar, Hash, Edit } from 'lucide-react';

interface CustomerDetailsCardProps {
  customer: Customer;
  onEdit: () => void;
}

const CustomerDetailsCard = ({ customer, onEdit }: CustomerDetailsCardProps) => {
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{customer.name}</CardTitle>
            <CardDescription>
              Kundeinformasjon og kontaktdetaljer
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(customer.status)}
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-1" />
              Rediger
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grunnleggende informasjon */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Grunnleggende informasjon
            </h4>
            
            {customer.customer_number && (
              <div className="flex items-center space-x-3">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Kundenummer</p>
                  <p className="font-medium">{customer.customer_number}</p>
                </div>
              </div>
            )}

            {customer.contact_person && (
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Kontaktperson</p>
                  <p className="font-medium">{customer.contact_person}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Opprettet</p>
                <p className="font-medium">
                  {new Date(customer.created_at).toLocaleDateString('nb-NO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Kontaktinformasjon */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Kontaktinformasjon
            </h4>
            
            {customer.phone ? (
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="text-muted-foreground italic">Ikke registrert</p>
                </div>
              </div>
            )}

            {customer.email ? (
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">E-post</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">E-post</p>
                  <p className="text-muted-foreground italic">Ikke registrert</p>
                </div>
              </div>
            )}

            {customer.address ? (
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">{customer.address}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="text-muted-foreground italic">Ikke registrert</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetailsCard;
