import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

export interface OneDriveFile {
  id: string;
  name: string;
  size: number;
  lastModified: string;
  downloadUrl: string;
  fileType: 'PRD' | 'CUS' | 'OD0' | string;
}

export interface ImportLog {
  id: string;
  bakery_id: string;
  source: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  execution_time_ms: number | null;
  files_processed: number;
  products_imported: number;
  customers_imported: number;
  orders_created: number;
  error_message: string | null;
  file_results: any[] | null;
  triggered_by: string | null;
}

export function useOneDriveFiles(folderPath: string) {
  const { profile } = useAuthStore();
  const bakeryId = profile?.bakery_id;

  return useQuery({
    queryKey: ['onedrive-files', bakeryId, folderPath],
    queryFn: async () => {
      if (!bakeryId) return { files: [], folderPath: '', totalFiles: 0, importableFiles: 0 };

      const { data, error } = await supabase.functions.invoke('onedrive-list-files', {
        body: { bakeryId, folderPath }
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      
      return data as {
        files: OneDriveFile[];
        folderPath: string;
        totalFiles: number;
        importableFiles: number;
      };
    },
    enabled: !!bakeryId && !!folderPath,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}

export function useOneDriveImport() {
  const { profile, user } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const bakeryId = profile?.bakery_id;

  return useMutation({
    mutationFn: async (files: OneDriveFile[]) => {
      if (!bakeryId) throw new Error('Ingen bakeri-ID');
      if (!files.length) throw new Error('Ingen filer valgt');

      const { data, error } = await supabase.functions.invoke('onedrive-import', {
        body: { 
          bakeryId, 
          files,
          triggeredBy: user?.id
        }
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['import-history'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast({
        title: 'Import fullført',
        description: `${data.productsImported} produkter, ${data.customersImported} kunder, ${data.ordersCreated} ordrer importert`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Import feilet',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useImportHistory(limit = 10) {
  const { profile } = useAuthStore();
  const bakeryId = profile?.bakery_id;

  return useQuery({
    queryKey: ['import-history', bakeryId, limit],
    queryFn: async () => {
      if (!bakeryId) return [];

      const { data, error } = await supabase
        .from('file_import_logs')
        .select('*')
        .eq('bakery_id', bakeryId)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as ImportLog[];
    },
    enabled: !!bakeryId,
    staleTime: 10 * 1000,
  });
}
