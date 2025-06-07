
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building, Users, Edit, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface Bakery {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

interface BakeriesSectionProps {
  bakeries: Bakery[] | undefined;
  onDeleteBakery: (bakery: Bakery) => void;
}

const BakeriesSection = ({ bakeries, onDeleteBakery }: BakeriesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bakeri Administrasjon</CardTitle>
        <CardDescription>
          Administrer alle bakerier i systemet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bakeries?.map((bakery) => (
            <div key={bakery.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{bakery.name}</span>
                  <Badge variant="default">Aktiv</Badge>
                </div>
                {bakery.address && (
                  <p className="text-sm text-gray-600">Adresse: {bakery.address}</p>
                )}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  {bakery.email && <span>E-post: {bakery.email}</span>}
                  {bakery.phone && <span>Telefon: {bakery.phone}</span>}
                  <span>Opprettet: {format(new Date(bakery.created_at), 'dd.MM.yyyy', { locale: nb })}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-1" />
                  Brukere
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Rediger
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => onDeleteBakery(bakery)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Slett
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          {bakeries?.length === 0 && (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Ingen bakerier</h3>
              <p className="mt-1 text-sm text-gray-500">
                Opprett ditt første bakeri for å komme i gang.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BakeriesSection;
