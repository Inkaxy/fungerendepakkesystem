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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Get user from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Ingen autorisasjon");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Ikke autentisert");
    }

    // Get user's bakery_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("bakery_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.bakery_id) {
      throw new Error("Kunne ikke finne bakeri for bruker");
    }

    const bakeryId = profile.bakery_id;

    // Get Microsoft credentials from environment (shared for all bakeries)
    const clientId = Deno.env.get("MICROSOFT_CLIENT_ID");
    if (!clientId) {
      throw new Error("Microsoft Client ID er ikke konfigurert");
    }

    // Generate state parameter for CSRF protection (includes bakeryId)
    const state = btoa(JSON.stringify({
      bakeryId,
      timestamp: Date.now(),
      nonce: crypto.randomUUID(),
    }));

    // Build OAuth URL
    const redirectUri = `${supabaseUrl}/functions/v1/onedrive-callback`;
    const scope = "Files.Read Files.Read.All offline_access User.Read";
    
    const authUrl = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("response_mode", "query");

    console.log(`[onedrive-auth] Generated auth URL for bakery ${bakeryId}`);

    return new Response(
      JSON.stringify({ authUrl: authUrl.toString(), state }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[onedrive-auth] Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
