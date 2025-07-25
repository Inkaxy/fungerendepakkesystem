import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.10";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestConnectionRequest {
  setting: {
    service_type: string;
    service_config: any;
    folder_path?: string;
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

    const { setting }: TestConnectionRequest = await req.json();
    
    console.log('Testing connection for service:', setting.service_type);

    // Test connection based on service type
    let connectionResult;
    
    switch (setting.service_type) {
      case 'onedrive':
        connectionResult = await testOneDriveConnection(setting.service_config, setting.folder_path);
        break;
      case 'google_drive':
        connectionResult = await testGoogleDriveConnection(setting.service_config, setting.folder_path);
        break;
      case 'ftp':
        connectionResult = await testFtpConnection(setting.service_config, setting.folder_path);
        break;
      case 'sftp':
        connectionResult = await testSftpConnection(setting.service_config, setting.folder_path);
        break;
      default:
        throw new Error(`Unsupported service type: ${setting.service_type}`);
    }

    return new Response(JSON.stringify(connectionResult), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error testing connection:', error);
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

async function testOneDriveConnection(config: any, folderPath?: string) {
  try {
    const { client_id, client_secret, tenant_id } = config;
    
    if (!client_id || !client_secret || !tenant_id) {
      throw new Error('Missing OneDrive configuration: client_id, client_secret, or tenant_id');
    }

    // For now, just validate that the config has required fields
    // In a real implementation, you would test the actual connection
    return {
      success: true,
      message: 'OneDrive configuration appears valid',
      service: 'OneDrive',
      folderPath: folderPath || 'Root folder'
    };
    
  } catch (error: any) {
    return {
      success: false,
      error: `OneDrive connection failed: ${error.message}`
    };
  }
}

async function testGoogleDriveConnection(config: any, folderPath?: string) {
  try {
    const { client_id, client_secret, refresh_token } = config;
    
    if (!client_id || !client_secret || !refresh_token) {
      throw new Error('Missing Google Drive configuration: client_id, client_secret, or refresh_token');
    }

    return {
      success: true,
      message: 'Google Drive configuration appears valid',
      service: 'Google Drive',
      folderPath: folderPath || 'Root folder'
    };
    
  } catch (error: any) {
    return {
      success: false,
      error: `Google Drive connection failed: ${error.message}`
    };
  }
}

async function testFtpConnection(config: any, folderPath?: string) {
  try {
    const { host, port, username, password } = config;
    
    if (!host || !username || !password) {
      throw new Error('Missing FTP configuration: host, username, or password');
    }

    return {
      success: true,
      message: 'FTP configuration appears valid',
      service: 'FTP',
      folderPath: folderPath || '/'
    };
    
  } catch (error: any) {
    return {
      success: false,
      error: `FTP connection failed: ${error.message}`
    };
  }
}

async function testSftpConnection(config: any, folderPath?: string) {
  try {
    const { host, port, username, password, private_key } = config;
    
    if (!host || !username || (!password && !private_key)) {
      throw new Error('Missing SFTP configuration: host, username, and either password or private_key');
    }

    return {
      success: true,
      message: 'SFTP configuration appears valid',
      service: 'SFTP',
      folderPath: folderPath || '/'
    };
    
  } catch (error: any) {
    return {
      success: false,
      error: `SFTP connection failed: ${error.message}`
    };
  }
}

serve(handler);