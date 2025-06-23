
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';

interface DashboardStats {
  activeOrders: number;
  totalCustomers: number;
  weeklyRevenue: number;
  pendingOrders: number;
  completedOrdersToday: number;
  recentActivity: Array<{
    id: string;
    type: 'order_packed' | 'order_created' | 'customer_added';
    message: string;
    timestamp: string;
  }>;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const now = new Date();
      const weekStart = format(startOfWeek(now), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(now), 'yyyy-MM-dd');
      const todayStart = startOfDay(now);
      const todayEnd = endOfDay(now);

      // Get user's bakery_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('bakery_id')
        .eq('id', user.id)
        .single();

      if (!profile?.bakery_id) throw new Error('No bakery found for user');

      // Fetch active orders (pending, in_progress, packed)
      const { data: activeOrders } = await supabase
        .from('orders')
        .select('id, total_amount')
        .eq('bakery_id', profile.bakery_id)
        .in('status', ['pending', 'in_progress', 'packed']);

      // Fetch total customers
      const { data: customers } = await supabase
        .from('customers')
        .select('id')
        .eq('bakery_id', profile.bakery_id)
        .eq('status', 'active');

      // Fetch weekly revenue
      const { data: weeklyOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('bakery_id', profile.bakery_id)
        .gte('delivery_date', weekStart)
        .lte('delivery_date', weekEnd)
        .in('status', ['packed', 'delivered']);

      // Fetch pending orders
      const { data: pendingOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('bakery_id', profile.bakery_id)
        .eq('status', 'pending');

      // Fetch completed orders today
      const { data: completedToday } = await supabase
        .from('orders')
        .select('id')
        .eq('bakery_id', profile.bakery_id)
        .eq('status', 'packed')
        .gte('updated_at', todayStart.toISOString())
        .lte('updated_at', todayEnd.toISOString());

      // Fetch recent activity (orders and customers created today)
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, order_number, status, created_at, updated_at, customer:customers(name)')
        .eq('bakery_id', profile.bakery_id)
        .gte('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentCustomers } = await supabase
        .from('customers')
        .select('id, name, created_at')
        .eq('bakery_id', profile.bakery_id)
        .gte('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false })
        .limit(3);

      // Build recent activity array
      const recentActivity: DashboardStats['recentActivity'] = [];

      // Add packed orders
      recentOrders?.forEach(order => {
        if (order.status === 'packed') {
          recentActivity.push({
            id: order.id,
            type: 'order_packed',
            message: `Ordre ${order.order_number} pakket`,
            timestamp: order.updated_at || order.created_at
          });
        } else {
          recentActivity.push({
            id: order.id,
            type: 'order_created',
            message: `Ny ordre ${order.order_number} opprettet`,
            timestamp: order.created_at
          });
        }
      });

      // Add new customers
      recentCustomers?.forEach(customer => {
        recentActivity.push({
          id: customer.id,
          type: 'customer_added',
          message: `Ny kunde ${customer.name} registrert`,
          timestamp: customer.created_at
        });
      });

      // Sort by timestamp and take top 6
      recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      recentActivity.splice(6);

      const weeklyRevenue = weeklyOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      return {
        activeOrders: activeOrders?.length || 0,
        totalCustomers: customers?.length || 0,
        weeklyRevenue,
        pendingOrders: pendingOrders?.length || 0,
        completedOrdersToday: completedToday?.length || 0,
        recentActivity
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
