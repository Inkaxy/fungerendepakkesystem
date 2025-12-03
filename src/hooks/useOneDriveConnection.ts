import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

interface OneDriveConnection {
  id: string;
  bakery_id: string;
  is_connected: boolean;
  connected_at: string | null;
  user_email: string | null;
  connection_error: string | null;
  token_expires_at: string | null;
}

export function useOneDriveConnection() {
  const { profile, user } = useAuthStore();
  const queryClient = useQueryClient();
  const bakeryId = profile?.bakery_id;

  // Fetch connection status
  const { data: connection, isLoading, error } = useQuery({
    queryKey: ['onedrive-connection', bakeryId],
    queryFn: async () => {
      if (!bakeryId) return null;

      const { data, error } = await supabase
        .from('bakery_onedrive_connections')
        .select('*')
        .eq('bakery_id', bakeryId)
        .maybeSingle();

      if (error) throw error;
      return data as OneDriveConnection | null;
    },
    enabled: !!bakeryId,
  });

  // Connect to OneDrive - redirects to Microsoft OAuth
  const connectOneDrive = () => {
    if (!bakeryId || !user?.id) {
      toast.error('Du må være logget inn for å koble til OneDrive');
      return;
    }

    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
    if (!clientId) {
      toast.error('Microsoft Client ID er ikke konfigurert. Kontakt administrator.');
      console.error('VITE_MICROSOFT_CLIENT_ID is not set in environment variables');
      return;
    }

    // Create state with bakery_id and user_id
    const state = btoa(JSON.stringify({ bakery_id: bakeryId, user_id: user.id }));
    
    const redirectUri = `https://sxggxcaanwsrufxfjbqb.supabase.co/functions/v1/onedrive-oauth-callback`;
    const scope = 'Files.Read User.Read offline_access';

    // Microsoft OAuth URL
    const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_mode', 'query');

    // Redirect to Microsoft login
    window.location.href = authUrl.toString();
  };

  // Disconnect from OneDrive
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!bakeryId) throw new Error('Ingen bakeri valgt');

      const { error } = await supabase
        .from('bakery_onedrive_connections')
        .update({
          is_connected: false,
          access_token_encrypted: null,
          refresh_token_encrypted: null,
          token_expires_at: null,
          connection_error: null,
        })
        .eq('bakery_id', bakeryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onedrive-connection', bakeryId] });
      toast.success('OneDrive er frakoblet');
    },
    onError: (error) => {
      console.error('Disconnect error:', error);
      toast.error('Kunne ikke koble fra OneDrive');
    },
  });

  return {
    connection,
    isConnected: connection?.is_connected ?? false,
    isLoading,
    error,
    connectOneDrive,
    disconnectOneDrive: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,
  };
}
