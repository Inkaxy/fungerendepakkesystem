
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook som oppløser short_id til full bakery_id (UUID)
 * Støtter bakoverkompatibilitet: Hvis input allerede er en UUID, returneres den direkte
 */
export const useResolveBakeryId = (shortId?: string) => {
  return useQuery({
    queryKey: ['resolve-bakery-id', shortId],
    queryFn: async () => {
      if (!shortId) return null;
      
      // Hvis det allerede er en UUID (36 tegn med bindestreker), bruk direkte
      if (shortId.length === 36 && shortId.includes('-')) {
        console.log('🔗 shortId er allerede en UUID, bruker direkte:', shortId);
        return shortId;
      }
      
      // Ellers oppløs via database-funksjon
      console.log('🔍 Oppløser short_id til bakery_id:', shortId);
      
      const { data, error } = await supabase
        .rpc('get_bakery_id_from_short_id', { short_id_param: shortId });
      
      if (error) {
        console.error('❌ Feil ved oppløsning av short_id:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('⚠️ Ingen bakeri funnet for short_id:', shortId);
        return null;
      }
      
      console.log('✅ Oppløst bakery_id:', data);
      return data as string;
    },
    enabled: !!shortId,
    staleTime: 60 * 60 * 1000, // Cache i 1 time - short_id endres sjelden
    gcTime: 24 * 60 * 60 * 1000, // Behold i 24 timer
    retry: 2,
  });
};
