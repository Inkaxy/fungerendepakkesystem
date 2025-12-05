import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    console.log('[scheduled-import] Starting scheduled import check...');
    
    // Get current time in Europe/Oslo timezone
    const now = new Date();
    const osloTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Oslo' }));
    const currentHour = osloTime.getHours().toString().padStart(2, '0');
    const currentMinute = osloTime.getMinutes();
    
    // Create time window (±2 minutes to account for cron timing)
    const minMinute = Math.max(0, currentMinute - 2);
    const maxMinute = Math.min(59, currentMinute + 2);
    
    const minTime = `${currentHour}:${minMinute.toString().padStart(2, '0')}`;
    const maxTime = `${currentHour}:${maxMinute.toString().padStart(2, '0')}`;
    
    console.log(`[scheduled-import] Checking for imports between ${minTime} and ${maxTime} (Oslo time)`);
    
    // Get bakeries with auto-import enabled and matching scheduled time
    const { data: configs, error: configError } = await supabase
      .from('onedrive_import_config')
      .select(`
        bakery_id,
        folder_path,
        file_pattern,
        scheduled_time,
        last_import_at,
        timezone
      `)
      .eq('is_auto_enabled', true)
      .gte('scheduled_time', minTime)
      .lte('scheduled_time', maxTime);

    if (configError) {
      console.error('[scheduled-import] Error fetching configs:', configError);
      throw configError;
    }

    if (!configs || configs.length === 0) {
      console.log('[scheduled-import] No bakeries scheduled for import at this time');
      return new Response(JSON.stringify({ 
        message: 'No scheduled imports', 
        checkedTime: `${currentHour}:${currentMinute.toString().padStart(2, '0')}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[scheduled-import] Found ${configs.length} bakeries to process`);

    const results: Array<{ bakeryId: string; status: string; error?: string }> = [];
    const today = new Date().toISOString().split('T')[0];

    for (const config of configs) {
      const { bakery_id, folder_path, last_import_at } = config;
      
      // Skip if already imported today
      if (last_import_at) {
        const lastImportDate = new Date(last_import_at).toISOString().split('T')[0];
        if (lastImportDate === today) {
          console.log(`[scheduled-import] Skipping bakery ${bakery_id} - already imported today`);
          results.push({ bakeryId: bakery_id, status: 'skipped', error: 'Already imported today' });
          continue;
        }
      }

      // Check if OneDrive is connected
      const { data: connection, error: connError } = await supabase
        .from('onedrive_connections')
        .select('is_connected')
        .eq('bakery_id', bakery_id)
        .single();

      if (connError || !connection?.is_connected) {
        console.log(`[scheduled-import] Skipping bakery ${bakery_id} - OneDrive not connected`);
        results.push({ bakeryId: bakery_id, status: 'skipped', error: 'OneDrive not connected' });
        continue;
      }

      try {
        console.log(`[scheduled-import] Processing bakery ${bakery_id}...`);

        // Create import log entry
        const { data: logEntry, error: logError } = await supabase
          .from('file_import_logs')
          .insert({
            bakery_id,
            source: 'onedrive_scheduled',
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (logError) {
          console.error(`[scheduled-import] Error creating log for ${bakery_id}:`, logError);
          throw logError;
        }

        const logId = logEntry.id;

        // Step 1: List files from OneDrive
        console.log(`[scheduled-import] Listing files for bakery ${bakery_id}...`);
        const listResponse = await fetch(`${supabaseUrl}/functions/v1/onedrive-list-files`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
          },
          body: JSON.stringify({ bakeryId: bakery_id, folderPath: folder_path || '' }),
        });

        if (!listResponse.ok) {
          const errorText = await listResponse.text();
          throw new Error(`Failed to list files: ${errorText}`);
        }

        const listResult = await listResponse.json();
        const files = listResult.files || [];

        if (files.length === 0) {
          console.log(`[scheduled-import] No importable files found for bakery ${bakery_id}`);
          
          await supabase
            .from('file_import_logs')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
              files_processed: 0,
              error_message: 'No importable files found',
            })
            .eq('id', logId);

          results.push({ bakeryId: bakery_id, status: 'completed', error: 'No files found' });
          continue;
        }

        // Step 2: Import the files
        console.log(`[scheduled-import] Importing ${files.length} files for bakery ${bakery_id}...`);
        const importResponse = await fetch(`${supabaseUrl}/functions/v1/onedrive-import`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
          },
          body: JSON.stringify({ 
            bakeryId: bakery_id, 
            files: files.map((f: { id: string; name: string; downloadUrl: string; fileType: string }) => ({
              id: f.id,
              name: f.name,
              downloadUrl: f.downloadUrl,
              fileType: f.fileType,
            })),
          }),
        });

        if (!importResponse.ok) {
          const errorText = await importResponse.text();
          throw new Error(`Failed to import files: ${errorText}`);
        }

        const importResult = await importResponse.json();

        // Update log with results
        await supabase
          .from('file_import_logs')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            files_processed: files.length,
            products_imported: importResult.products || 0,
            customers_imported: importResult.customers || 0,
            orders_created: importResult.orders || 0,
            execution_time_ms: importResult.executionTimeMs,
            file_results: importResult.fileResults,
          })
          .eq('id', logId);

        // Update last import timestamp
        await supabase
          .from('onedrive_import_config')
          .update({
            last_import_at: new Date().toISOString(),
            last_import_status: 'success',
          })
          .eq('bakery_id', bakery_id);

        console.log(`[scheduled-import] Successfully imported for bakery ${bakery_id}`);
        results.push({ bakeryId: bakery_id, status: 'success' });

      } catch (error) {
        console.error(`[scheduled-import] Error processing bakery ${bakery_id}:`, error);
        
        // Update config with error status
        await supabase
          .from('onedrive_import_config')
          .update({
            last_import_status: 'failed',
          })
          .eq('bakery_id', bakery_id);

        results.push({ 
          bakeryId: bakery_id, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    console.log(`[scheduled-import] Completed. Results:`, results);

    return new Response(JSON.stringify({ 
      message: 'Scheduled import completed',
      processed: results.length,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[scheduled-import] Fatal error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
