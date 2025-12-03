import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description");

    // Get frontend URL for redirects
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://bakeri-pakke.lovable.app";

    // Handle OAuth errors
    if (error) {
      console.error(`[onedrive-callback] OAuth error: ${error} - ${errorDescription}`);
      return Response.redirect(
        `${frontendUrl}/dashboard/settings?onedrive_error=${encodeURIComponent(errorDescription || error)}`,
        302
      );
    }

    if (!code || !state) {
      console.error("[onedrive-callback] Missing code or state");
      return Response.redirect(
        `${frontendUrl}/dashboard/settings?onedrive_error=${encodeURIComponent("Manglende autorisasjonskode")}`,
        302
      );
    }

    // Decode state to get bakeryId
    let stateData;
    try {
      stateData = JSON.parse(atob(state));
    } catch {
      console.error("[onedrive-callback] Invalid state parameter");
      return Response.redirect(
        `${frontendUrl}/dashboard/settings?onedrive_error=${encodeURIComponent("Ugyldig state-parameter")}`,
        302
      );
    }

    const { bakeryId, timestamp } = stateData;

    // Validate state timestamp (max 10 minutes old)
    if (Date.now() - timestamp > 10 * 60 * 1000) {
      console.error("[onedrive-callback] State expired");
      return Response.redirect(
        `${frontendUrl}/dashboard/settings?onedrive_error=${encodeURIComponent("Autorisasjonen utløp, prøv igjen")}`,
        302
      );
    }

    // Get Microsoft credentials
    const clientId = Deno.env.get("MICROSOFT_CLIENT_ID");
    const clientSecret = Deno.env.get("MICROSOFT_CLIENT_SECRET");
    
    if (!clientId || !clientSecret) {
      console.error("[onedrive-callback] Missing Microsoft credentials");
      return Response.redirect(
        `${frontendUrl}/dashboard/settings?onedrive_error=${encodeURIComponent("Microsoft-legitimasjon mangler")}`,
        302
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const redirectUri = `${supabaseUrl}/functions/v1/onedrive-callback`;

    // Exchange code for tokens
    console.log(`[onedrive-callback] Exchanging code for tokens for bakery ${bakeryId}`);
    
    const tokenResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`[onedrive-callback] Token exchange failed: ${errorText}`);
      return Response.redirect(
        `${frontendUrl}/dashboard/settings?onedrive_error=${encodeURIComponent("Kunne ikke hente tilgangstoken")}`,
        302
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokens;

    console.log(`[onedrive-callback] Got tokens, expires_in: ${expires_in}s`);

    // Get user email from Microsoft Graph
    let microsoftEmail = null;
    try {
      const userResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        microsoftEmail = userData.mail || userData.userPrincipalName;
        console.log(`[onedrive-callback] Microsoft user: ${microsoftEmail}`);
      }
    } catch (e) {
      console.warn("[onedrive-callback] Could not fetch Microsoft user info:", e.message);
    }

    // Store tokens using service role (to bypass RLS)
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call helper function to store encrypted tokens
    const { error: updateError } = await supabase.rpc("update_onedrive_tokens", {
      _bakery_id: bakeryId,
      _access_token: access_token,
      _refresh_token: refresh_token,
      _expires_in: expires_in,
      _microsoft_email: microsoftEmail,
    });

    if (updateError) {
      console.error(`[onedrive-callback] Failed to store tokens: ${updateError.message}`);
      return Response.redirect(
        `${frontendUrl}/dashboard/settings?onedrive_error=${encodeURIComponent("Kunne ikke lagre tilkobling")}`,
        302
      );
    }

    console.log(`[onedrive-callback] Successfully connected OneDrive for bakery ${bakeryId}`);
    
    return Response.redirect(
      `${frontendUrl}/dashboard/settings?onedrive_success=true`,
      302
    );

  } catch (error) {
    console.error("[onedrive-callback] Unexpected error:", error.message);
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://bakeri-pakke.lovable.app";
    return Response.redirect(
      `${frontendUrl}/dashboard/settings?onedrive_error=${encodeURIComponent("Uventet feil oppstod")}`,
      302
    );
  }
});
