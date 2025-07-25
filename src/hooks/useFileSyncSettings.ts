import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TablesInsert } from "@/integrations/supabase/types";

export interface FileSyncSetting {
  id: string;
  bakery_id: string;
  service_type: 'onedrive' | 'google_drive' | 'ftp' | 'sftp';
  service_config: Record<string, any>;
  folder_path?: string;
  schedule_cron: string;
  delete_after_sync: boolean;
  is_active: boolean;
  last_sync_at?: string;
  last_sync_status?: 'success' | 'error' | 'in_progress';
  last_sync_error?: string;
  created_at: string;
  updated_at: string;
}

export interface FileSyncLog {
  id: string;
  bakery_id: string;
  sync_setting_id: string;
  sync_started_at: string;
  sync_completed_at?: string;
  status: 'success' | 'error' | 'in_progress';
  files_found: number;
  files_processed: number;
  files_failed: number;
  error_message?: string;
  file_details: any[];
  created_at: string;
}

export const useFileSyncSettings = () => {
  return useQuery({
    queryKey: ["file-sync-settings"],
    queryFn: async () => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session. Please log in to access file sync settings.');
      }

      const { data, error } = await supabase
        .from("file_sync_settings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching file sync settings:', error);
        throw error;
      }

      return data as FileSyncSetting[];
    },
  });
};

export const useFileSyncLogs = (settingId?: string) => {
  return useQuery({
    queryKey: ["file-sync-logs", settingId],
    queryFn: async () => {
      let query = supabase
        .from("file_sync_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (settingId) {
        query = query.eq("sync_setting_id", settingId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FileSyncLog[];
    },
  });
};

export const useCreateFileSyncSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (setting: Omit<TablesInsert<'file_sync_settings'>, 'bakery_id'>) => {
      const { data, error } = await supabase
        .from("file_sync_settings")
        .insert(setting as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-sync-settings"] });
      toast({
        title: "Suksess",
        description: "Filsynkroniseringsinnstilling opprettet",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Feil",
        description: error.message || "Kunne ikke opprette innstilling",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFileSyncSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FileSyncSetting> & { id: string }) => {
      const { data, error } = await supabase
        .from("file_sync_settings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-sync-settings"] });
      toast({
        title: "Suksess",
        description: "Innstilling oppdatert",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Feil",
        description: error.message || "Kunne ikke oppdatere innstilling",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteFileSyncSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("file_sync_settings")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-sync-settings"] });
      toast({
        title: "Suksess",
        description: "Innstilling slettet",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Feil",
        description: error.message || "Kunne ikke slette innstilling",
        variant: "destructive",
      });
    },
  });
};

export const useTestConnection = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (setting: FileSyncSetting) => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session. Please log in to test connection.');
      }

      const { data, error } = await supabase.functions.invoke('test-file-sync-connection', {
        body: { setting },
      });

      if (error) {
        console.error('Error testing connection:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Test vellykket",
        description: data.message || "Tilkobling fungerer",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Test mislyktes",
        description: error.message || "Kunne ikke koble til tjenesten",
        variant: "destructive",
      });
    },
  });
};

export const useTriggerSync = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settingId: string) => {
      const { data, error } = await supabase.functions.invoke('trigger-file-sync', {
        body: { settingId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-sync-settings"] });
      queryClient.invalidateQueries({ queryKey: ["file-sync-logs"] });
      toast({
        title: "Synkronisering startet",
        description: "Filsynkronisering er startet i bakgrunnen",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Feil",
        description: error.message || "Kunne ikke starte synkronisering",
        variant: "destructive",
      });
    },
  });
};