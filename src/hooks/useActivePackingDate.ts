
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const useActivePackingDate = () => {
  return useQuery({
    queryKey: ['active-packing-date'],
    queryFn: async () => {
      console.log('🔍 Fetching active packing date');
      
      // Get user's bakery_id first
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) {
        console.log('❌ No authenticated user found');
        return null;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('bakery_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.bakery_id) {
        console.log('❌ No bakery found for user');
        return null;
      }

      // Check if there are any active packing products for today or any recent date
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: activeProducts } = await supabase
        .from('active_packing_products')
        .select('session_date')
        .eq('bakery_id', profile.bakery_id)
        .order('session_date', { ascending: false })
        .limit(1);

      if (activeProducts && activeProducts.length > 0) {
        console.log('✅ Found active packing date:', activeProducts[0].session_date);
        return activeProducts[0].session_date;
      }

      // If no active products, check for recent packing sessions
      const { data: sessions } = await supabase
        .from('packing_sessions')
        .select('session_date')
        .eq('bakery_id', profile.bakery_id)
        .in('status', ['ready', 'in_progress'])
        .order('session_date', { ascending: false })
        .limit(1);

      if (sessions && sessions.length > 0) {
        console.log('✅ Found active session date:', sessions[0].session_date);
        return sessions[0].session_date;
      }

      // Default to today if nothing else is found
      console.log('📅 Using today as default:', today);
      return today;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};
