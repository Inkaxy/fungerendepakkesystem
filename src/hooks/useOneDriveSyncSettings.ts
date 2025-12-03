import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

interface SyncSettings {
  id: string;
  bakery_id: string;
  folder_path: string | null;
  schedule_cron: string | null;
  is_active: boolean;
  last_sync_at: string | null;
  last_sync_status: string | null;
  last_sync_error: string | null;
}

interface SyncLog {
  id: string;
  status: string;
  sync_started_at: string;
  sync_completed_at: string | null;
  files_found: number | null;
  files_processed: number | null;
  files_failed: number | null;
  error_message: string | null;
  file_details: any[] | null;
}

interface UpdateSettingsParams {
  folder_path?: string;
  schedule_time?: string; // HH:mm format
  is_active?: boolean;
}

// Convert HH:mm to cron expression (daily at that time)
function timeToCron(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${minutes} ${hours} * * *`;
}

// Extract HH:mm from cron expression
function cronToTime(cron: string | null): string {
  if (!cron) return '06:00';
  const parts = cron.split(' ');
  if (parts.length < 2) return '06:00';
  return `${parts[1].padStart(2, '0')}:${parts[0].padStart(2, '0')}`;
}

export function useOneDriveSyncSettings() {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();
  const bakeryId = profile?.bakery_id;

  // Fetch sync settings
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['onedrive-sync-settings', bakeryId],
    queryFn: async () => {
      if (!bakeryId) return null;

      const { data, error } = await supabase
        .from('file_sync_settings')
        .select('*')
        .eq('bakery_id', bakeryId)
        .eq('service_type', 'onedrive')
        .maybeSingle();

      if (error) throw error;
      return data as SyncSettings | null;
    },
    enabled: !!bakeryId,
  });

  // Fetch sync logs
  const { data: syncLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['onedrive-sync-logs', bakeryId],
    queryFn: async () => {
      if (!bakeryId) return [];

      const { data, error } = await supabase
        .from('file_sync_logs')
        .select('*')
        .eq('bakery_id', bakeryId)
        .order('sync_started_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []) as SyncLog[];
    },
    enabled: !!bakeryId,
  });

  // Update or create settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (params: UpdateSettingsParams) => {
      if (!bakeryId) throw new Error('Ingen bakeri valgt');

      const updateData: any = {};
      
      if (params.folder_path !== undefined) {
        updateData.folder_path = params.folder_path;
      }
      if (params.schedule_time !== undefined) {
        updateData.schedule_cron = timeToCron(params.schedule_time);
      }
      if (params.is_active !== undefined) {
        updateData.is_active = params.is_active;
      }

      if (settings?.id) {
        // Update existing
        const { error } = await supabase
          .from('file_sync_settings')
          .update(updateData)
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('file_sync_settings')
          .insert({
            bakery_id: bakeryId,
            service_type: 'onedrive',
            ...updateData,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onedrive-sync-settings', bakeryId] });
      toast.success('Innstillinger lagret');
    },
    onError: (error) => {
      console.error('Update settings error:', error);
      toast.error('Kunne ikke lagre innstillinger');
    },
  });

  // Trigger manual sync
  const triggerSyncMutation = useMutation({
    mutationFn: async () => {
      if (!bakeryId) throw new Error('Ingen bakeri valgt');

      const { data, error } = await supabase.functions.invoke('sync-onedrive-files', {
        body: { bakery_id: bakeryId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['onedrive-sync-logs', bakeryId] });
      queryClient.invalidateQueries({ queryKey: ['onedrive-sync-settings', bakeryId] });
      
      const results = data?.results?.[0];
      if (results?.status === 'success') {
        toast.success(`Synkronisering fullført: ${results.files_processed} filer behandlet`);
      } else if (results?.status === 'error') {
        toast.error(`Synkronisering feilet: ${results.error}`);
      } else {
        toast.success('Synkronisering startet');
      }
    },
    onError: (error) => {
      console.error('Sync error:', error);
      toast.error('Kunne ikke starte synkronisering');
    },
  });

  return {
    settings,
    syncLogs: syncLogs || [],
    isLoading: isLoadingSettings || isLoadingLogs,
    scheduleTime: cronToTime(settings?.schedule_cron || null),
    folderPath: settings?.folder_path || '/Pakkesystem',
    isActive: settings?.is_active ?? false,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
    triggerSync: triggerSyncMutation.mutate,
    isSyncing: triggerSyncMutation.isPending,
  };
}
