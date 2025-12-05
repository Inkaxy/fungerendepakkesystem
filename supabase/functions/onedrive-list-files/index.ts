import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bakeryId, folderPath = '/Pakkesystem' } = await req.json();
    
    if (!bakeryId) {
      return new Response(
        JSON.stringify({ error: 'bakeryId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📂 Listing files from OneDrive for bakery: ${bakeryId}, folder: ${folderPath}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get decrypted OneDrive token
    const { data: tokenData, error: tokenError } = await supabase.rpc('get_decrypted_onedrive_token', {
      _bakery_id: bakeryId
    });

    if (tokenError || !tokenData || tokenData.length === 0) {
      console.error('Failed to get OneDrive token:', tokenError);
      return new Response(
        JSON.stringify({ error: 'OneDrive ikke tilkoblet eller token mangler' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let accessToken = tokenData[0].access_token;
    const isExpired = tokenData[0].is_expired;

    // Refresh token if expired
    if (isExpired) {
      console.log('🔄 Token expired, refreshing...');
      const refreshResponse = await fetch(`${supabaseUrl}/functions/v1/onedrive-refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bakeryId })
      });

      if (!refreshResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Kunne ikke oppdatere OneDrive-tilgang. Prøv å koble til på nytt.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get new token
      const { data: newTokenData } = await supabase.rpc('get_decrypted_onedrive_token', {
        _bakery_id: bakeryId
      });
      
      if (!newTokenData || newTokenData.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Kunne ikke hente ny token etter refresh' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      accessToken = newTokenData[0].access_token;
    }

    // Clean folder path (remove leading slash if present for Graph API)
    const cleanPath = folderPath.startsWith('/') ? folderPath.substring(1) : folderPath;
    
    // List files from OneDrive using Microsoft Graph API
    const graphUrl = cleanPath 
      ? `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(cleanPath)}:/children`
      : `https://graph.microsoft.com/v1.0/me/drive/root/children`;

    console.log(`📡 Calling Graph API: ${graphUrl}`);

    const graphResponse = await fetch(graphUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!graphResponse.ok) {
      const errorText = await graphResponse.text();
      console.error('Graph API error:', graphResponse.status, errorText);
      
      if (graphResponse.status === 404) {
        return new Response(
          JSON.stringify({ error: `Mappen "${folderPath}" ble ikke funnet i OneDrive` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Mark error in database
      await supabase.rpc('mark_onedrive_error', {
        _bakery_id: bakeryId,
        _error_message: `Graph API feil: ${graphResponse.status}`
      });
      
      return new Response(
        JSON.stringify({ error: 'Kunne ikke hente filer fra OneDrive' }),
        { status: graphResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const graphData = await graphResponse.json();
    
    // Filter and format files
    const files = (graphData.value || [])
      .filter((item: any) => {
        if (item.folder) return false; // Skip folders
        const name = item.name.toUpperCase();
        return name.endsWith('.PRD') || name.endsWith('.CUS') || name.endsWith('.OD0');
      })
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        lastModified: item.lastModifiedDateTime,
        downloadUrl: item['@microsoft.graph.downloadUrl'],
        fileType: item.name.split('.').pop()?.toUpperCase() || 'UNKNOWN'
      }))
      .sort((a: any, b: any) => {
        // Sort by file type: PRD first, then CUS, then OD0
        const order: Record<string, number> = { 'PRD': 1, 'CUS': 2, 'OD0': 3 };
        return (order[a.fileType] || 99) - (order[b.fileType] || 99);
      });

    console.log(`✅ Found ${files.length} importable files`);

    return new Response(
      JSON.stringify({ 
        files,
        folderPath,
        totalFiles: graphData.value?.length || 0,
        importableFiles: files.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in onedrive-list-files:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Intern feil' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
