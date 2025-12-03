-- Opprett bakery_onedrive_connections tabell
CREATE TABLE public.bakery_onedrive_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bakery_id UUID NOT NULL REFERENCES bakeries(id) ON DELETE CASCADE,
  
  -- OAuth tokens (kryptert)
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Tilkoblingsinfo
  is_connected BOOLEAN DEFAULT false,
  connected_at TIMESTAMPTZ,
  connected_by UUID,
  user_email TEXT,
  
  -- Status
  last_token_refresh TIMESTAMPTZ,
  connection_error TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(bakery_id)
);

-- Enable RLS
ALTER TABLE public.bakery_onedrive_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies for bakery_admin og super_admin
CREATE POLICY "Bakery admins can view their OneDrive connection"
ON public.bakery_onedrive_connections FOR SELECT
USING (
  bakery_id = get_current_user_bakery_id()
  AND (has_role(auth.uid(), 'bakery_admin') OR has_role(auth.uid(), 'super_admin'))
);

CREATE POLICY "Super admins can view all OneDrive connections"
ON public.bakery_onedrive_connections FOR SELECT
USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Bakery admins can insert their OneDrive connection"
ON public.bakery_onedrive_connections FOR INSERT
WITH CHECK (
  bakery_id = get_current_user_bakery_id()
  AND (has_role(auth.uid(), 'bakery_admin') OR has_role(auth.uid(), 'super_admin'))
);

CREATE POLICY "Bakery admins can update their OneDrive connection"
ON public.bakery_onedrive_connections FOR UPDATE
USING (
  bakery_id = get_current_user_bakery_id()
  AND (has_role(auth.uid(), 'bakery_admin') OR has_role(auth.uid(), 'super_admin'))
);

CREATE POLICY "Bakery admins can delete their OneDrive connection"
ON public.bakery_onedrive_connections FOR DELETE
USING (
  bakery_id = get_current_user_bakery_id()
  AND (has_role(auth.uid(), 'bakery_admin') OR has_role(auth.uid(), 'super_admin'))
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_bakery_onedrive_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bakery_onedrive_connections_updated_at
BEFORE UPDATE ON public.bakery_onedrive_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_bakery_onedrive_connections_updated_at();

-- Funksjon for å hente bakerier som skal synke
CREATE OR REPLACE FUNCTION public.get_bakeries_to_sync_now()
RETURNS TABLE (
    bakery_id UUID,
    setting_id UUID,
    folder_path TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fss.bakery_id,
        fss.id as setting_id,
        fss.folder_path,
        boc.access_token_encrypted as access_token,
        boc.refresh_token_encrypted as refresh_token,
        boc.token_expires_at
    FROM file_sync_settings fss
    JOIN bakery_onedrive_connections boc ON boc.bakery_id = fss.bakery_id
    WHERE 
        fss.is_active = true
        AND fss.service_type = 'onedrive'
        AND boc.is_connected = true
        AND boc.access_token_encrypted IS NOT NULL;
END;
$$;