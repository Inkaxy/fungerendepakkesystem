import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    const errorDescription = url.searchParams.get('error_description')

    console.log('OAuth callback received:', { hasCode: !!code, hasState: !!state, error })

    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription)
      return redirectWithError(`OAuth feil: ${errorDescription || error}`)
    }

    if (!code || !state) {
      console.error('Missing code or state')
      return redirectWithError('Manglende autorisasjonskode eller state')
    }

    // Parse state to get bakery_id and user_id
    let stateData: { bakery_id: string; user_id: string }
    try {
      stateData = JSON.parse(atob(state))
    } catch (e) {
      console.error('Invalid state:', e)
      return redirectWithError('Ugyldig state parameter')
    }

    const { bakery_id, user_id } = stateData
    console.log('State parsed:', { bakery_id, user_id })

    // Get Microsoft credentials from environment
    const clientId = Deno.env.get('MICROSOFT_CLIENT_ID')
    const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!clientId || !clientSecret) {
      console.error('Missing Microsoft credentials')
      return redirectWithError('Microsoft OAuth er ikke konfigurert')
    }

    // Exchange code for tokens
    const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    const redirectUri = `${supabaseUrl}/functions/v1/onedrive-oauth-callback`

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        scope: 'Files.Read User.Read offline_access',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return redirectWithError('Kunne ikke hente tilgangstoken')
    }

    const tokens = await tokenResponse.json()
    console.log('Tokens received:', { 
      hasAccessToken: !!tokens.access_token, 
      hasRefreshToken: !!tokens.refresh_token,
      expiresIn: tokens.expires_in 
    })

    // Get user info from Microsoft Graph
    const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    let userEmail = null
    if (userInfoResponse.ok) {
      const userInfo = await userInfoResponse.json()
      userEmail = userInfo.mail || userInfo.userPrincipalName
      console.log('User email:', userEmail)
    }

    // Calculate token expiry
    const tokenExpiresAt = new Date(Date.now() + (tokens.expires_in * 1000)).toISOString()

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: { persistSession: false }
    })

    // Upsert connection to database
    const { error: dbError } = await supabase
      .from('bakery_onedrive_connections')
      .upsert({
        bakery_id,
        access_token_encrypted: tokens.access_token,
        refresh_token_encrypted: tokens.refresh_token,
        token_expires_at: tokenExpiresAt,
        is_connected: true,
        connected_at: new Date().toISOString(),
        connected_by: user_id,
        user_email: userEmail,
        connection_error: null,
      }, {
        onConflict: 'bakery_id'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return redirectWithError('Kunne ikke lagre tilkobling')
    }

    console.log('Connection saved successfully')

    // Redirect back to settings page with success
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: `${getAppUrl()}/dashboard/settings?onedrive=success`,
      },
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return redirectWithError('En uventet feil oppstod')
  }
})

function redirectWithError(message: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      Location: `${getAppUrl()}/dashboard/settings?onedrive=error&message=${encodeURIComponent(message)}`,
    },
  })
}

function getAppUrl(): string {
  // Return the frontend app URL
  return Deno.env.get('APP_URL') || 'https://sxggxcaanwsrufxfjbqb.lovable.app'
}
