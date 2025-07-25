import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.10";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TriggerSyncRequest {
  setting: {
    id: string;
    service_type: string;
    service_config: any;
    folder_path?: string;
    bakery_id: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { setting }: TriggerSyncRequest = await req.json();
    
    console.log('Triggering sync for setting:', setting.id, 'service:', setting.service_type);

    // Create a sync log entry
    const syncLog = {
      bakery_id: setting.bakery_id,
      sync_setting_id: setting.id,
      sync_started_at: new Date().toISOString(),
      status: 'in_progress',
      files_found: 0,
      files_processed: 0,
      files_failed: 0,
      file_details: []
    };

    const { data: logData, error: logError } = await supabase
      .from('file_sync_logs')
      .insert(syncLog)
      .select()
      .single();

    if (logError) {
      throw new Error(`Failed to create sync log: ${logError.message}`);
    }

    // Trigger sync based on service type
    let syncResult;
    
    try {
      switch (setting.service_type) {
        case 'onedrive':
          syncResult = await syncOneDriveFiles(setting.service_config, setting.folder_path);
          break;
        case 'google_drive':
          syncResult = await syncGoogleDriveFiles(setting.service_config, setting.folder_path);
          break;
        case 'ftp':
          syncResult = await syncFtpFiles(setting.service_config, setting.folder_path);
          break;
        case 'sftp':
          syncResult = await syncSftpFiles(setting.service_config, setting.folder_path);
          break;
        default:
          throw new Error(`Unsupported service type: ${setting.service_type}`);
      }

      // Update sync log with success
      await supabase
        .from('file_sync_logs')
        .update({
          sync_completed_at: new Date().toISOString(),
          status: 'completed',
          files_found: syncResult.filesFound,
          files_processed: syncResult.filesProcessed,
          files_failed: syncResult.filesFailed,
          file_details: syncResult.fileDetails
        })
        .eq('id', logData.id);

      // Update the sync setting with last sync info
      await supabase
        .from('file_sync_settings')
        .update({
          last_sync_at: new Date().toISOString(),
          last_sync_status: 'success',
          last_sync_error: null
        })
        .eq('id', setting.id);

    } catch (syncError: any) {
      console.error('Sync error:', syncError);
      
      // Update sync log with error
      await supabase
        .from('file_sync_logs')
        .update({
          sync_completed_at: new Date().toISOString(),
          status: 'failed',
          error_message: syncError.message
        })
        .eq('id', logData.id);

      // Update the sync setting with error info
      await supabase
        .from('file_sync_settings')
        .update({
          last_sync_at: new Date().toISOString(),
          last_sync_status: 'error',
          last_sync_error: syncError.message
        })
        .eq('id', setting.id);

      throw syncError;
    }

    return new Response(JSON.stringify({
      success: true,
      logId: logData.id,
      ...syncResult
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error triggering sync:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

async function syncOneDriveFiles(config: any, folderPath?: string) {
  // Simulate file sync for now
  console.log('Syncing OneDrive files from:', folderPath);
  
  return {
    filesFound: 3,
    filesProcessed: 3,
    filesFailed: 0,
    fileDetails: [
      { name: 'customers.csv', status: 'processed', size: 1024 },
      { name: 'orders.xlsx', status: 'processed', size: 2048 },
      { name: 'products.csv', status: 'processed', size: 512 }
    ]
  };
}

async function syncGoogleDriveFiles(config: any, folderPath?: string) {
  // Simulate file sync for now
  console.log('Syncing Google Drive files from:', folderPath);
  
  return {
    filesFound: 2,
    filesProcessed: 2,
    filesFailed: 0,
    fileDetails: [
      { name: 'data.csv', status: 'processed', size: 1536 },
      { name: 'report.xlsx', status: 'processed', size: 3072 }
    ]
  };
}

async function syncFtpFiles(config: any, folderPath?: string) {
  // Simulate file sync for now
  console.log('Syncing FTP files from:', folderPath);
  
  return {
    filesFound: 1,
    filesProcessed: 1,
    filesFailed: 0,
    fileDetails: [
      { name: 'export.csv', status: 'processed', size: 2048 }
    ]
  };
}

async function syncSftpFiles(config: any, folderPath?: string) {
  // Simulate file sync for now
  console.log('Syncing SFTP files from:', folderPath);
  
  return {
    filesFound: 4,
    filesProcessed: 3,
    filesFailed: 1,
    fileDetails: [
      { name: 'file1.csv', status: 'processed', size: 1024 },
      { name: 'file2.xlsx', status: 'processed', size: 2048 },
      { name: 'file3.csv', status: 'processed', size: 512 },
      { name: 'file4.txt', status: 'failed', error: 'Invalid format' }
    ]
  };
}

serve(handler);