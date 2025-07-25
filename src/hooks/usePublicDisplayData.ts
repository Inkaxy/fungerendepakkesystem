import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Public hook for fetching display data without authentication
export const usePublicDisplaySettings = (screenType: 'large' | 'small') => {
  return useQuery({
    queryKey: ['public-display-settings', screenType],
    queryFn: async () => {
      // Fetch display settings for shared display
      // This assumes there's a public display settings or we use defaults
      const { data, error } = await supabase
        .from('display_settings')
        .select('*')
        .eq('screen_type', 'shared')
        .single();

      if (error && error.code !== 'PGRST116') {
        // If no settings found, return defaults
        return {
          auto_refresh_interval: 30,
          background_color: '#ffffff',
          text_color: '#111827',
          header_font_size: 32,
          body_font_size: 16,
          customer_cards_columns: 3,
          customer_cards_gap: 24,
          show_stats_cards: true,
          force_single_screen: false,
          large_screen_optimization: false,
          // Add more defaults as needed
        };
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePublicCustomers = () => {
  return useQuery({
    queryKey: ['public-customers'],
    queryFn: async () => {
      // Fetch customers that have dedicated displays (public access)
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching public customers:', error);
        return [];
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicPackingData = (customerId?: string, activePackingDate?: string) => {
  return useQuery({
    queryKey: ['public-packing-data', customerId, activePackingDate],
    queryFn: async () => {
      if (!activePackingDate) return [];

      // This would need to be implemented based on your existing packing data logic
      // For now, return empty array as display screens should gracefully handle no data
      return [];
    },
    enabled: !!activePackingDate,
    staleTime: 30 * 1000, // 30 seconds for real-time-ish updates
  });
};

export const usePublicActivePackingDate = () => {
  return useQuery({
    queryKey: ['public-active-packing-date'],
    queryFn: async () => {
      // Fetch the most recent packing session date
      const { data, error } = await supabase
        .from('packing_sessions')
        .select('session_date')
        .order('session_date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching active packing date:', error);
        return null;
      }

      return data?.session_date || null;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};