
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Clock, User, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { Order } from '@/types/database';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, isOpen, onClose }: OrderDetailsModalProps) => {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Venter</Badge>;
      case 'confirmed':
        return <Badge variant="default">Bekreftet</Badge>;
      case 'in_progress':
        return <Badge variant="default"><Package className="w-3 h-3 mr-1" />Produksjon</Badge>;
      case 'packed':
        return <Badge className="bg-blue-500"><Package className="w-3 h-3 mr-1" />Pakket</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Levert</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Kansellert</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  const totalAmount = order.order_products?.reduce((sum, item) => {
    return sum + (item.quantity * (item.unit_price || 0));
  }, 0) || order.total_amount || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Ordredetaljer</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Header */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-lg">{order.order_number}</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Leveringsdato: {format(new Date(order.delivery_date), 'dd. MMMM yyyy', { locale: nb })}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-2" />
                  Status: {getStatusBadge(order.status)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {totalAmount.toLocaleString('nb-NO')} kr
              </div>
              <div className="text-sm text-gray-500">Total beløp</div>
            </div>
          </div>

          {/* Customer Information */}
          {order.customer && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Kundeinformasjon
              </h4>
              <div className="space-y-2">
                <div className="font-medium">{order.customer.name}</div>
                {order.customer.contact_person && (
                  <div className="text-sm text-gray-600">
                    Kontaktperson: {order.customer.contact_person}
                  </div>
                )}
                {order.customer.address && (
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    {order.customer.address}
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {order.customer.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {order.customer.phone}
                    </div>
                  )}
                  {order.customer.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {order.customer.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Order Products */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Produkter ({order.order_products?.length || 0})
            </h4>
            {order.order_products && order.order_products.length > 0 ? (
              <div className="space-y-3">
                {order.order_products.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="font-medium">
                        {item.product?.name || `Produkt ID: ${item.product_id}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        Antall: {item.quantity} {item.product?.unit || 'stk'}
                      </div>
                      {item.unit_price && (
                        <div className="text-sm text-gray-600">
                          Enhetspris: {item.unit_price.toLocaleString('nb-NO')} kr
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {((item.unit_price || 0) * item.quantity).toLocaleString('nb-NO')} kr
                      </div>
                      <Badge 
                        variant={item.packing_status === 'packed' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {item.packing_status === 'pending' && 'Venter'}
                        {item.packing_status === 'in_progress' && 'Pågår'}
                        {item.packing_status === 'packed' && 'Pakket'}
                        {item.packing_status === 'completed' && 'Ferdig'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Ingen produkter registrert
              </div>
            )}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Notater</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}

          {/* Order Metadata */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>Opprettet: {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm', { locale: nb })}</div>
            <div>Oppdatert: {format(new Date(order.updated_at), 'dd.MM.yyyy HH:mm', { locale: nb })}</div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Lukk
          </Button>
          <Button>
            Rediger ordre
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
