
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const useActivePackingDate = () => {
  return useQuery({
    queryKey: ['active-packing-date'],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      console.log('🔍 Finding active packing date, starting with today:', today);
      
      // First check if there are active products for today
      const { data: todayProducts, error: todayError } = await supabase
        .from('active_packing_products')
        .select('session_date')
        .eq('session_date', today)
        .limit(1);

      if (todayError) {
        console.error('❌ Error checking today\'s active products:', todayError);
        throw todayError;
      }

      if (todayProducts && todayProducts.length > 0) {
        console.log('✅ Found active products for today:', today);
        return today;
      }

      console.log('⚠️ No active products for today, looking for most recent active session...');

      // If no active products for today, find the most recent session with active products
      const { data: recentSession, error: sessionError } = await supabase
        .from('active_packing_products')
        .select('session_date')
        .order('session_date', { ascending: false })
        .limit(1);

      if (sessionError) {
        console.error('❌ Error finding recent active session:', sessionError);
        throw sessionError;
      }

      if (recentSession && recentSession.length > 0) {
        const activeDate = recentSession[0].session_date;
        console.log('✅ Found most recent active session date:', activeDate);
        return activeDate;
      }

      console.log('⚠️ No active packing sessions found, falling back to today');
      return today;
    },
    refetchInterval: 30000, // Check every 30 seconds
  });
};
