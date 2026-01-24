import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import type { DisplayPreset, CreatePresetInput } from '@/types/displaySettings';
import type { DisplaySettings } from '@/hooks/useDisplaySettings';

export const useDisplayPresets = () => {
  const { profile } = useAuthStore();

  return useQuery({
    queryKey: ['display-presets', profile?.bakery_id],
    queryFn: async () => {
      if (!profile?.bakery_id) return [];

      const { data, error } = await supabase
        .from('display_presets')
        .select('*')
        .eq('bakery_id', profile.bakery_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(preset => ({
        ...preset,
        settings: typeof preset.settings === 'string' 
          ? JSON.parse(preset.settings) 
          : preset.settings
      })) as DisplayPreset[];
    },
    enabled: !!profile?.bakery_id,
  });
};

export const useCreatePreset = () => {
  const { profile, user } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreatePresetInput) => {
      if (!profile?.bakery_id || !user?.id) {
        throw new Error('Bruker eller bakery ikke funnet');
      }

      const { data, error } = await (supabase as any)
        .from('display_presets')
        .insert({
          bakery_id: profile.bakery_id,
          user_id: user.id,
          name: input.name,
          description: input.description || null,
          preset_type: input.preset_type || 'complete',
          settings: input.settings as any,
          is_public: input.is_public || false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['display-presets'] });
      toast({
        title: 'Mal lagret',
        description: 'Din mal er nå tilgjengelig i maler-menyen.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Kunne ikke lagre mal',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdatePreset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<CreatePresetInput> 
    }) => {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.preset_type !== undefined) updateData.preset_type = updates.preset_type;
      if (updates.settings !== undefined) updateData.settings = updates.settings;
      if (updates.is_public !== undefined) updateData.is_public = updates.is_public;

      const { data, error } = await (supabase as any)
        .from('display_presets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['display-presets'] });
      toast({
        title: 'Mal oppdatert',
        description: 'Endringene er lagret.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Kunne ikke oppdatere mal',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeletePreset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('display_presets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['display-presets'] });
      toast({
        title: 'Mal slettet',
        description: 'Malen er fjernet.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Kunne ikke slette mal',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// System presets (built-in themes)
export const systemPresets: Array<{
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<DisplaySettings>;
}> = [
  {
    id: 'system-light',
    name: 'Lys Standard',
    description: 'Rent og profesjonelt lyst tema',
    icon: '☀️',
    settings: {
      background_type: 'gradient',
      background_gradient_start: '#f8fafc',
      background_gradient_end: '#e2e8f0',
      background_gradient_direction: 'to-bottom',
      card_background_color: '#ffffff',
      card_border_color: '#e2e8f0',
      text_color: '#1e293b',
      header_text_color: '#0f172a',
      product_card_color: '#ffffff',
      product_text_color: '#334155',
      status_pending_color: '#f59e0b',
      status_in_progress_color: '#3b82f6',
      status_completed_color: '#10b981',
      progress_bar_color: '#3b82f6',
    },
  },
  {
    id: 'system-dark',
    name: 'Mørkt Tema',
    description: 'Elegant mørkt tema for lavt lys',
    icon: '🌙',
    settings: {
      background_type: 'gradient',
      background_gradient_start: '#0f172a',
      background_gradient_end: '#1e293b',
      background_gradient_direction: 'to-bottom',
      card_background_color: '#1e293b',
      card_border_color: '#334155',
      text_color: '#e2e8f0',
      header_text_color: '#f8fafc',
      product_card_color: '#334155',
      product_text_color: '#e2e8f0',
      status_pending_color: '#fbbf24',
      status_in_progress_color: '#60a5fa',
      status_completed_color: '#34d399',
      progress_bar_color: '#60a5fa',
    },
  },
  {
    id: 'system-bakery',
    name: 'Bakeri Klassisk',
    description: 'Varme toner inspirert av ferske bakervarer',
    icon: '🥐',
    settings: {
      background_type: 'gradient',
      background_gradient_start: '#fef3c7',
      background_gradient_end: '#fde68a',
      background_gradient_direction: 'to-bottom',
      card_background_color: '#fffbeb',
      card_border_color: '#fcd34d',
      text_color: '#78350f',
      header_text_color: '#451a03',
      product_card_color: '#fef3c7',
      product_text_color: '#78350f',
      status_pending_color: '#d97706',
      status_in_progress_color: '#b45309',
      status_completed_color: '#059669',
      progress_bar_color: '#d97706',
    },
  },
  {
    id: 'system-modern',
    name: 'Moderne Minimalist',
    description: 'Stram og moderne design',
    icon: '✨',
    settings: {
      background_type: 'solid',
      background_color: '#fafafa',
      card_background_color: '#ffffff',
      card_border_color: '#e5e5e5',
      card_border_width: 1,
      border_radius: 12,
      card_shadow_intensity: 2,
      text_color: '#171717',
      header_text_color: '#0a0a0a',
      product_card_color: '#fafafa',
      product_text_color: '#262626',
      status_pending_color: '#737373',
      status_in_progress_color: '#525252',
      status_completed_color: '#22c55e',
      progress_bar_color: '#171717',
    },
  },
  {
    id: 'system-high-contrast',
    name: 'Høy Kontrast',
    description: 'Maksimal lesbarhet og tilgjengelighet',
    icon: '👁️',
    settings: {
      background_type: 'solid',
      background_color: '#ffffff',
      card_background_color: '#ffffff',
      card_border_color: '#000000',
      card_border_width: 2,
      text_color: '#000000',
      header_text_color: '#000000',
      product_card_color: '#ffffff',
      product_text_color: '#000000',
      status_pending_color: '#b45309',
      status_in_progress_color: '#1d4ed8',
      status_completed_color: '#15803d',
      progress_bar_color: '#000000',
      high_contrast_mode: true,
    },
  },
];
