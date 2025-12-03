import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bakeryId } = await req.json();
    
    if (!bakeryId) {
      throw new Error("bakeryId er påkrevd");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current tokens
    const { data: tokenData, error: tokenError } = await supabase
      .rpc("get_decrypted_onedrive_token", { _bakery_id: bakeryId });

    if (tokenError || !tokenData || tokenData.length === 0) {
      throw new Error("Ingen OneDrive-tilkobling funnet");
    }

    const { refresh_token, is_expired } = tokenData[0];

    if (!refresh_token) {
      throw new Error("Ingen refresh token tilgjengelig");
    }

    // Check if refresh is needed
    if (!is_expired) {
      console.log(`[onedrive-refresh] Token for bakery ${bakeryId} is still valid`);
      return new Response(
        JSON.stringify({ refreshed: false, message: "Token er fortsatt gyldig" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[onedrive-refresh] Refreshing token for bakery ${bakeryId}`);

    // Get Microsoft credentials
    const clientId = Deno.env.get("MICROSOFT_CLIENT_ID");
    const clientSecret = Deno.env.get("MICROSOFT_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      throw new Error("Microsoft-legitimasjon mangler");
    }

    // Refresh token
    const tokenResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`[onedrive-refresh] Token refresh failed: ${errorText}`);
      
      // Mark error in database
      await supabase.rpc("mark_onedrive_error", {
        _bakery_id: bakeryId,
        _error_message: "Token refresh feilet",
      });
      
      throw new Error("Kunne ikke fornye token");
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token: new_refresh_token, expires_in } = tokens;

    // Update tokens in database
    const { error: updateError } = await supabase.rpc("update_onedrive_tokens", {
      _bakery_id: bakeryId,
      _access_token: access_token,
      _refresh_token: new_refresh_token || refresh_token, // Use new refresh token if provided
      _expires_in: expires_in,
    });

    if (updateError) {
      throw new Error(`Kunne ikke lagre nye tokens: ${updateError.message}`);
    }

    console.log(`[onedrive-refresh] Successfully refreshed token for bakery ${bakeryId}`);

    return new Response(
      JSON.stringify({ refreshed: true, expiresIn: expires_in }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[onedrive-refresh] Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
