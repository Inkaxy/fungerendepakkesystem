
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Package, Clock, CheckCircle, Truck, Calendar as CalendarIcon, Search, ArrowLeft, Users } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { nb } from 'date-fns/locale';

interface Product {
  id: number;
  name: string;
  category: string;
  totalOrders: number;
  packed: number;
  percentage: number;
  status: 'Ferdig' | 'Pågår' | 'Venter';
  customers: number;
}

interface Order {
  id: string;
  customerName: string;
  orderNumber: string;
  quantity: number;
  status: 'Venter' | 'Pakket' | 'Avvik';
}

interface PackingDay {
  date: Date;
  totalOrders: number;
  uniqueCustomers: number;
  productTypes: number;
  topProducts: Array<{
    name: string;
    quantity: number;
  }>;
  status: 'Klar for pakking' | 'Pågår' | 'Fullført';
}

const Orders = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 5, 3)); // 3. juni 2025
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [view, setView] = useState<'calendar' | 'products' | 'packing'>('calendar');

  // Mock data basert på bildene
  const packingDays: PackingDay[] = [
    {
      date: new Date(2025, 5, 3),
      totalOrders: 35,
      uniqueCustomers: 35,
      productTypes: 30,
      topProducts: [
        { name: 'Kneipp', quantity: 165 },
        { name: 'Hortensbrød', quantity: 359 },
        { name: 'Kystenbrød', quantity: 316 },
        { name: 'Loff', quantity: 134 },
        { name: 'Horten', quantity: 246 }
      ],
      status: 'Klar for pakking'
    },
    {
      date: new Date(2025, 5, 7),
      totalOrders: 28,
      uniqueCustomers: 26,
      productTypes: 25,
      topProducts: [
        { name: 'Rundstykker', quantity: 120 },
        { name: 'Bagetter', quantity: 85 }
      ],
      status: 'Fullført'
    }
  ];

  const products: Product[] = [
    { id: 1, name: 'Kneipp', category: 'Ingen kategori', totalOrders: 165, packed: 165, percentage: 100, status: 'Ferdig', customers: 24 },
    { id: 10, name: 'Rundstekt Helkorn', category: 'Ingen kategori', totalOrders: 89, packed: 89, percentage: 100, status: 'Ferdig', customers: 7 },
    { id: 11, name: 'Hvassbrød', category: 'Ingen kategori', totalOrders: 110, packed: 110, percentage: 100, status: 'Ferdig', customers: 17 },
    { id: 19, name: 'Færderbrød', category: 'Ingen kategori', totalOrders: 93, packed: 83, percentage: 89.2, status: 'Pågår', customers: 21 },
    { id: 21, name: 'Hortensbrød', category: 'Ingen kategori', totalOrders: 359, packed: 359, percentage: 100, status: 'Ferdig', customers: 24 },
    { id: 23, name: 'Kystenbrød', category: 'Ingen kategori', totalOrders: 316, packed: 316, percentage: 100, status: 'Ferdig', customers: 27 },
    { id: 29, name: 'Fiberbrød Med Frø', category: 'Ingen kategori', totalOrders: 23, packed: 0, percentage: 0, status: 'Venter', customers: 9 },
    { id: 30, name: 'Loff', category: 'Ingen kategori', totalOrders: 134, packed: 134, percentage: 100, status: 'Ferdig', customers: 24 },
    { id: 31, name: 'Formloff', category: 'Ingen kategori', totalOrders: 18, packed: 18, percentage: 100, status: 'Ferdig', customers: 7 },
    { id: 34, name: 'Spiralloff', category: 'Ingen kategori', totalOrders: 8, packed: 0, percentage: 0, status: 'Venter', customers: 4 },
    { id: 36, name: 'Miniloff med Frø', category: 'Ingen kategori', totalOrders: 41, packed: 0, percentage: 0, status: 'Venter', customers: 7 }
  ];

  const orders: Order[] = [
    { id: '10058', customerName: 'Meny Nettørey', orderNumber: '#10058', quantity: 2, status: 'Venter' },
    { id: '10673', customerName: 'Kiwi Gauterud', orderNumber: '#10673', quantity: 5, status: 'Venter' },
    { id: '10001', customerName: 'Meny Heimdal', orderNumber: '#10001', quantity: 3, status: 'Avvik' },
    { id: '10736', customerName: 'Meny Tolvsrud', orderNumber: '#10736', quantity: 2, status: 'Venter' },
    { id: '10801', customerName: 'Meny Holmestrand', orderNumber: '#10801', quantity: 1, status: 'Venter' },
    { id: '10812', customerName: 'Spar Tjøme', orderNumber: '#10812', quantity: 1, status: 'Venter' },
    { id: '10862', customerName: 'Kiwi Hjemseng', orderNumber: '#10862', quantity: 5, status: 'Venter' },
    { id: '20002', customerName: 'Skallestad', orderNumber: '#20002', quantity: 3, status: 'Venter' },
    { id: '5019', customerName: 'Wilhelmsen Chemicals AS', orderNumber: '#5019', quantity: 1, status: 'Venter' }
  ];

  const getSelectedDayData = () => {
    if (!selectedDate) return null;
    return packingDays.find(day => isSameDay(day.date, selectedDate));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Ferdig':
        return 'default';
      case 'Pågår':
        return 'secondary';
      case 'Venter':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getOrderStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Pakket':
        return 'default';
      case 'Venter':
        return 'secondary';
      case 'Avvik':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDayData = getSelectedDayData();

  if (view === 'packing' && selectedProduct) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setView('products')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Tilbake</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Pakking - {selectedProduct.name}</h1>
              <p className="text-muted-foreground">
                {format(selectedDate || new Date(), 'dd.MM.yyyy', { locale: nb })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">03.06.2025</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Fiberbrød Med Frø</div>
              <div className="text-2xl font-bold">0/23</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Spiralloff</div>
              <div className="text-2xl font-bold">0/8</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Miniloff med Frø</div>
              <div className="text-2xl font-bold">0/41</div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>{selectedProduct.name}</span>
                <Badge variant="secondary">#{selectedProduct.id}</Badge>
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{selectedProduct.customers} kunder</span>
                </span>
                <span>{selectedProduct.packed}/{selectedProduct.totalOrders}</span>
                <span>{Math.round(selectedProduct.percentage)}% ferdig</span>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Merk alle som pakket ({orders.filter(o => o.status === 'Venter').length})
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Ordrenummer</TableHead>
                  <TableHead>Antall</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Handling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {order.status === 'Venter' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Pakket
                          </Button>
                        )}
                        {order.status === 'Avvik' && (
                          <Button size="sm" variant="destructive">
                            Avvik
                          </Button>
                        )}
                        {order.status !== 'Venter' && order.status !== 'Avvik' && (
                          <Button size="sm" variant="outline">
                            Avvik
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'products') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setView('calendar')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Tilbake</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                <CalendarIcon className="h-6 w-6" />
                <span>tirsdag 3. juni</span>
              </h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                <span>9/30 Ordrer ferdig</span>
                <span>1296/2090 Produkter pakket</span>
                <span className="text-right">62%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={62} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Ordrer ferdig</span>
            <span>Produkter pakket</span>
          </div>
        </div>

        {/* Products Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <CardTitle>Produkter å pakke</CardTitle>
                <Badge variant="secondary">30 produkter</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">0 av maks 3 valgt</span>
                <Button disabled className="bg-gray-400">
                  <Package className="mr-2 h-4 w-4" />
                  Start pakking (0)
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Søk etter varenummer eller navn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <span className="text-sm text-muted-foreground">
                Viser 30 av 30 resultater
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Varenummer</TableHead>
                  <TableHead>Varenavn</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Totalt antall</TableHead>
                  <TableHead>Pakket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Velg</TableHead>
                  <TableHead>Kunder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow 
                    key={product.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSelectedProduct(product);
                      setView('packing');
                    }}
                  >
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.category}</TableCell>
                    <TableCell>{product.totalOrders}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-green-600">{product.packed}</span>
                        <Progress value={product.percentage} className="w-16 h-2" />
                        <span className="text-xs text-muted-foreground">{Math.round(product.percentage)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(product.status)}>
                        {product.status === 'Ferdig' && <CheckCircle className="mr-1 h-3 w-3" />}
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">Velg</span>
                    </TableCell>
                    <TableCell>{product.customers}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
            <CalendarIcon className="h-8 w-8" />
            <span>Pakkekalender</span>
          </h1>
          <p className="text-muted-foreground">
            Velg en dato med komplette filer for å starte pakking
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Kalender</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Antall pakkedager funnet: 1
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0"
                locale={nb}
                modifiers={{
                  packingDay: packingDays.map(day => day.date),
                  completed: packingDays.filter(day => day.status === 'Fullført').map(day => day.date)
                }}
                modifiersStyles={{
                  packingDay: { 
                    backgroundColor: 'hsl(var(--primary))', 
                    color: 'white',
                    fontWeight: 'bold'
                  },
                  completed: { 
                    backgroundColor: 'hsl(var(--muted))', 
                    color: 'hsl(var(--muted-foreground))'
                  }
                }}
              />
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Pakkedager funnet: 1</p>
                <p>Valgt dato: {selectedDate ? format(selectedDate, 'yyyy-MM-dd', { locale: nb }) : 'Ingen'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Day Details */}
        <div>
          {selectedDayData ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {format(selectedDate!, 'd. MMMM yyyy', { locale: nb })}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Status</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {selectedDayData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Totalt ordrer</span>
                    <div className="text-2xl font-bold">{selectedDayData.totalOrders}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Unike kunder</span>
                    <div className="text-2xl font-bold">{selectedDayData.uniqueCustomers}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Produkttyper</span>
                    <div className="text-2xl font-bold">{selectedDayData.productTypes}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Mest bestilte produkter</h4>
                  <div className="space-y-2">
                    {selectedDayData.topProducts.map((product, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{product.name}</span>
                        <span className="font-medium">{product.quantity} stk</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => setView('products')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Start pakking
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Velg en dato i kalenderen for å se pakkedetaljer</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
