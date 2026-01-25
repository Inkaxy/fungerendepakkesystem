import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Upload, 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  Loader2, 
  Trash2, 
  ChevronDown,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  ShoppingCart
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, isToday, isFuture, isPast, differenceInDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useOrders, useOrdersByDateRange } from '@/hooks/useOrders';
import { usePackingSessions } from '@/hooks/usePackingSessions';
import { useDeleteOrdersForDate, useDeleteOldOrders } from '@/hooks/useDeleteOrders';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import DataUploadModal from '@/components/orders/DataUploadModal';
import DeleteOrdersDialog from '@/components/orders/DeleteOrdersDialog';
import PackingDateDetails from '@/components/orders/PackingDateDetails';
import ContinuePackingButton from '@/components/orders/ContinuePackingButton';
import { Order } from '@/types/database';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  variant: 'default' | 'secondary' | 'accent' | 'muted';
}

const StatCard = ({ title, value, subtitle, icon, trend, variant }: StatCardProps) => {
  const variantClasses = {
    default: {
      card: 'bg-primary/5 dark:bg-primary/10',
      bar: 'bg-primary',
      icon: 'bg-primary/10 text-primary',
    },
    secondary: {
      card: 'bg-secondary dark:bg-secondary/50',
      bar: 'bg-secondary-foreground/50',
      icon: 'bg-secondary-foreground/10 text-secondary-foreground',
    },
    accent: {
      card: 'bg-accent dark:bg-accent/50',
      bar: 'bg-accent-foreground/50',
      icon: 'bg-accent-foreground/10 text-accent-foreground',
    },
    muted: {
      card: 'bg-muted dark:bg-muted/50',
      bar: 'bg-muted-foreground/50',
      icon: 'bg-muted-foreground/10 text-muted-foreground',
    },
  };

  const classes = variantClasses[variant];

  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${classes.card}`}>
      <div className={`absolute top-0 left-0 right-0 h-1 ${classes.bar}`} />
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">{value}</span>
              {trend && (
                <span className={`flex items-center text-xs font-medium ${trend.isPositive ? 'text-primary' : 'text-destructive'}`}>
                  <TrendingUp className={`h-3 w-3 mr-0.5 ${!trend.isPositive && 'rotate-180'}`} />
                  {trend.value}%
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-xl ${classes.icon}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Orders = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showDataUpload, setShowDataUpload] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'date' | 'old'>('date');
  
  const currentMonth = format(selectedDate, 'yyyy-MM');
  const monthStart = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
  
  const { data: monthOrders, isLoading: ordersLoading } = useOrdersByDateRange(monthStart, monthEnd);
  const { data: selectedDateOrders, isLoading: dayOrdersLoading } = useOrders(format(selectedDate, 'yyyy-MM-dd'));
  const { data: packingSessions } = usePackingSessions();
  const deleteOrdersForDate = useDeleteOrdersForDate();
  const deleteOldOrders = useDeleteOldOrders();

  // Calculate progress stats
  const progressStats = useMemo(() => {
    if (!monthOrders) return { packed: 0, pending: 0, total: 0, percentage: 0 };
    const packed = monthOrders.filter(o => o.status === 'packed' || o.status === 'delivered').length;
    const pending = monthOrders.filter(o => o.status === 'pending').length;
    const total = monthOrders.length;
    const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;
    return { packed, pending, total, percentage };
  }, [monthOrders]);

  // Get upcoming delivery dates
  const upcomingDeliveries = useMemo(() => {
    if (!monthOrders) return [];
    const today = new Date();
    const upcoming = monthOrders
      .filter(o => {
        const deliveryDate = new Date(o.delivery_date);
        return isFuture(deliveryDate) || isToday(deliveryDate);
      })
      .reduce((acc, order) => {
        const dateStr = order.delivery_date;
        if (!acc[dateStr]) {
          acc[dateStr] = { date: dateStr, count: 0, customers: new Set() };
        }
        acc[dateStr].count++;
        acc[dateStr].customers.add(order.customer_id);
        return acc;
      }, {} as Record<string, { date: string; count: number; customers: Set<string> }>);
    
    return Object.values(upcoming)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [monthOrders]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Venter</Badge>;
      case 'confirmed':
        return <Badge variant="default">Bekreftet</Badge>;
      case 'in_progress':
        return <Badge variant="default"><Package className="w-3 h-3 mr-1" />Produksjon</Badge>;
      case 'packed':
        return <Badge variant="default" className="bg-primary/20 text-primary"><CheckCircle2 className="w-3 h-3 mr-1" />Pakket</Badge>;
      case 'delivered':
        return <Badge variant="default" className="bg-primary text-primary-foreground">Levert</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Kansellert</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  const handleOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleDeleteOrders = () => {
    if (deleteMode === 'date') {
      deleteOrdersForDate.mutate(format(selectedDate, 'yyyy-MM-dd'));
    } else {
      deleteOldOrders.mutate();
    }
  };

  // Create calendar modifiers for packing days
  const calendarModifiers = {
    packingDayReady: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const session = packingSessions?.find(s => s.session_date === dateStr);
      return session?.status === 'ready';
    },
    packingDayInProgress: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const session = packingSessions?.find(s => s.session_date === dateStr);
      return session?.status === 'in_progress';
    },
    packingDayCompleted: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const session = packingSessions?.find(s => s.session_date === dateStr);
      return session?.status === 'completed';
    },
    hasOrders: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return monthOrders?.some(order => order.delivery_date === dateStr) || false;
    },
    today: (date: Date) => {
      return isToday(date);
    }
  };

  if (ordersLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse" />
          <Loader2 className="h-8 w-8 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
        </div>
        <p className="text-muted-foreground animate-pulse">Laster ordrer...</p>
      </div>
    );
  }

  const totalOrders = monthOrders?.length || 0;
  const pendingOrders = monthOrders?.filter(o => o.status === 'pending').length || 0;
  const packedOrders = monthOrders?.filter(o => o.status === 'packed').length || 0;
  const uniqueCustomers = new Set(monthOrders?.map(o => o.customer_id)).size;

  return (
    <div className="space-y-8">
      {/* Header Section with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Ordre & Pakking</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {format(selectedDate, 'MMMM yyyy', { locale: nb })}
            </h1>
            <p className="text-muted-foreground max-w-md">
              Administrer ordrer, planlegg pakkedager og følg med på leveranser i sanntid
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setShowDataUpload(true)} 
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90"
            >
              <Upload className="mr-2 h-5 w-5" />
              Last opp data
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-all">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Slett ordre
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => {
                  setDeleteMode('date');
                  setShowDeleteDialog(true);
                }}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Slett ordre for valgt dato
                </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  setDeleteMode('old');
                  setShowDeleteDialog(true);
                }}
                className="text-destructive focus:text-destructive"
              >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Slett alle gamle ordre
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Fortsett pakking knapp - vises kun når det er aktiv pakking */}
      <ContinuePackingButton />

      {/* Progress Overview */}
      {totalOrders > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-background to-muted/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Månedlig fremgang</h3>
                  <p className="text-sm text-muted-foreground">
                    {progressStats.packed} av {progressStats.total} ordrer fullført
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">{progressStats.percentage}%</span>
                <span className="text-sm text-muted-foreground">fullført</span>
              </div>
            </div>
            <Progress value={progressStats.percentage} className="h-3" />
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ordrer denne måneden"
          value={totalOrders}
          subtitle={format(selectedDate, 'MMMM yyyy', { locale: nb })}
          icon={<Package className="h-6 w-6" />}
          variant="default"
        />
        <StatCard
          title="Venter på pakking"
          value={pendingOrders}
          subtitle="Ikke påbegynt ennå"
          icon={<Clock className="h-6 w-6" />}
          variant="accent"
        />
        <StatCard
          title="Ferdig pakket"
          value={packedOrders}
          subtitle="Klare for levering"
          icon={<CheckCircle2 className="h-6 w-6" />}
          variant="secondary"
        />
        <StatCard
          title="Unike kunder"
          value={uniqueCustomers}
          subtitle="Aktive denne måneden"
          icon={<Users className="h-6 w-6" />}
          variant="muted"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Card */}
        <Card className="xl:col-span-2 shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Pakkekalender</CardTitle>
                  <CardDescription>
                    Klikk på en dato for å se ordredetaljer
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={nb}
                  modifiers={calendarModifiers}
                  modifiersClassNames={{
                    packingDayReady: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                    packingDayInProgress: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
                    packingDayCompleted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                    hasOrders: 'ring-2 ring-primary/30',
                    today: 'ring-2 ring-primary font-bold'
                  }}
                  className="rounded-xl border shadow-sm"
                />
              </div>
              
              {/* Legend */}
              <div className="lg:w-48 space-y-3 p-4 bg-muted/30 rounded-xl">
                <h4 className="font-semibold text-sm">Fargekoder</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-md bg-primary/20 ring-1 ring-primary/30" />
                    <span>Klar for pakking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-md bg-accent ring-1 ring-accent" />
                    <span>Pakking pågår</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-md bg-primary ring-1 ring-primary" />
                    <span>Fullført</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-md ring-2 ring-primary bg-background" />
                    <span>I dag</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-md ring-2 ring-primary/30 bg-background" />
                    <span>Har ordrer</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packing Date Details */}
        <div className="space-y-6">
          <PackingDateDetails 
            selectedDate={selectedDate} 
            orders={selectedDateOrders || []} 
          />
          
          {/* Upcoming Deliveries Quick View */}
          {upcomingDeliveries.length > 0 && (
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Kommende leveranser</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcomingDeliveries.map((delivery) => {
                  const deliveryDate = new Date(delivery.date);
                  const daysUntil = differenceInDays(deliveryDate, new Date());
                  
                  return (
                    <button
                      key={delivery.date}
                      onClick={() => setSelectedDate(deliveryDate)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {isToday(deliveryDate) ? 'I dag' : format(deliveryDate, 'EEEE d. MMM', { locale: nb })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {delivery.count} ordre{delivery.count > 1 ? 'r' : ''} • {delivery.customers.size} kunde{delivery.customers.size > 1 ? 'r' : ''}
                        </p>
                      </div>
                      {daysUntil === 0 ? (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">I dag</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {daysUntil} {daysUntil === 1 ? 'dag' : 'dager'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* All Orders for Selected Date */}
      {selectedDateOrders && selectedDateOrders.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>
                    Ordrer for {format(selectedDate, 'dd. MMMM', { locale: nb })}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateOrders.length} ordre{selectedDateOrders.length > 1 ? 'r' : ''} denne dagen
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectedDateOrders.map((order: any) => (
                <div 
                  key={order.id} 
                  className="group relative p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => handleOrderDetails(order)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-semibold text-lg">{order.order_number}</span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {order.customer?.name || 'Ukjent kunde'}
                  </p>
                  {order.total_amount && order.total_amount > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {order.total_amount.toLocaleString('nb-NO')} kr
                    </p>
                  )}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showOrderDetails}
        onClose={() => {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }}
      />

      <DataUploadModal
        isOpen={showDataUpload}
        onClose={() => setShowDataUpload(false)}
      />

      <DeleteOrdersDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        mode={deleteMode}
        selectedDate={deleteMode === 'date' ? format(selectedDate, 'dd.MM.yyyy', { locale: nb }) : undefined}
        onConfirm={handleDeleteOrders}
        isLoading={deleteOrdersForDate.isPending || deleteOldOrders.isPending}
      />
    </div>
  );
};

export default Orders;
