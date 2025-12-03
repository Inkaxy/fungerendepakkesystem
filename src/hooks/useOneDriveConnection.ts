import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

export interface OneDriveConnection {
  id: string;
  bakery_id: string;
  is_connected: boolean;
  connected_at: string | null;
  microsoft_email: string | null;
  last_error: string | null;
  consecutive_failures: number;
}

export interface OneDriveImportConfig {
  id: string;
  bakery_id: string;
  folder_path: string;
  file_pattern: string;
  scheduled_time: string;
  timezone: string;
  is_auto_enabled: boolean;
  last_import_at: string | null;
  last_import_status: string | null;
}

export function useOneDriveConnection() {
  const { profile } = useAuthStore();
  const bakeryId = profile?.bakery_id;

  return useQuery({
    queryKey: ['onedrive-connection', bakeryId],
    queryFn: async () => {
      if (!bakeryId) return null;

      const { data, error } = await supabase
        .from('onedrive_connections')
        .select('*')
        .eq('bakery_id', bakeryId)
        .maybeSingle();

      if (error) throw error;
      return data as OneDriveConnection | null;
    },
    enabled: !!bakeryId,
  });
}

export function useOneDriveImportConfig() {
  const { profile } = useAuthStore();
  const bakeryId = profile?.bakery_id;

  return useQuery({
    queryKey: ['onedrive-import-config', bakeryId],
    queryFn: async () => {
      if (!bakeryId) return null;

      const { data, error } = await supabase
        .from('onedrive_import_config')
        .select('*')
        .eq('bakery_id', bakeryId)
        .maybeSingle();

      if (error) throw error;
      return data as OneDriveImportConfig | null;
    },
    enabled: !!bakeryId,
  });
}

export function useDisconnectOneDrive() {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const bakeryId = profile?.bakery_id;

  return useMutation({
    mutationFn: async () => {
      if (!bakeryId) throw new Error('Ingen bakeri-ID');

      const { error } = await supabase.rpc('disconnect_onedrive', {
        _bakery_id: bakeryId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onedrive-connection'] });
      toast({
        title: 'Frakoblet',
        description: 'OneDrive er nå frakoblet',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Feil',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateImportConfig() {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const bakeryId = profile?.bakery_id;

  return useMutation({
    mutationFn: async (config: Partial<OneDriveImportConfig>) => {
      if (!bakeryId) throw new Error('Ingen bakeri-ID');

      // Upsert config
      const { error } = await supabase
        .from('onedrive_import_config')
        .upsert({
          bakery_id: bakeryId,
          ...config,
        }, {
          onConflict: 'bakery_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onedrive-import-config'] });
      toast({
        title: 'Lagret',
        description: 'Innstillinger oppdatert',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Feil',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
