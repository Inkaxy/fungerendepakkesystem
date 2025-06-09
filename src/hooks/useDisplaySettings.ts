
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DisplaySettings {
  id: string;
  bakery_id: string;
  background_type: 'solid' | 'gradient' | 'image';
  background_color: string;
  background_gradient_start: string;
  background_gradient_end: string;
  background_image_url?: string;
  header_font_size: number;
  body_font_size: number;
  text_color: string;
  header_text_color: string;
  card_background_color: string;
  card_border_color: string;
  card_shadow_intensity: number;
  border_radius: number;
  spacing: number;
  product_card_color: string;
  product_text_color: string;
  product_accent_color: string;
  product_card_size: number;
  status_pending_color: string;
  status_in_progress_color: string;
  status_completed_color: string;
  status_delivered_color: string;
  progress_bar_color: string;
  progress_background_color: string;
  progress_height: number;
  show_progress_percentage: boolean;
  show_customer_info: boolean;
  show_order_numbers: boolean;
  show_delivery_dates: boolean;
  show_product_images: boolean;
  auto_refresh_interval: number;
}

export const useDisplaySettings = () => {
  return useQuery({
    queryKey: ['display-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('display_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data as DisplaySettings;
    },
  });
};

export const useUpdateDisplaySettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: Partial<DisplaySettings>) => {
      const { data, error } = await supabase
        .from('display_settings')
        .update(settings)
        .eq('bakery_id', (await supabase.auth.getUser()).data.user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['display-settings'] });
      toast({
        title: "Innstillinger lagret",
        description: "Display-innstillingene er oppdatert",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: "Kunne ikke lagre innstillinger",
        variant: "destructive",
      });
    },
  });
};
