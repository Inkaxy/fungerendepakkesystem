-- =====================================================
-- FASE 1: OneDrive Auto-Import Database Schema
-- =====================================================

-- 1. ONEDRIVE_CONNECTIONS - Lagrer OAuth tokens per bakeri
CREATE TABLE public.onedrive_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bakery_id UUID NOT NULL UNIQUE REFERENCES bakeries(id) ON DELETE CASCADE,
  
  -- OAuth tokens (kryptert med pgcrypto)
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Tilkoblingsstatus
  is_connected BOOLEAN DEFAULT false,
  connected_at TIMESTAMPTZ,
  connected_by UUID REFERENCES profiles(id),
  microsoft_email TEXT,
  
  -- Error tracking
  last_error TEXT,
  consecutive_failures INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ONEDRIVE_IMPORT_CONFIG - Konfigurasjon for import
CREATE TABLE public.onedrive_import_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bakery_id UUID NOT NULL UNIQUE REFERENCES bakeries(id) ON DELETE CASCADE,
  
  -- OneDrive mappe
  folder_path TEXT NOT NULL DEFAULT '/Pakkesystem',
  file_pattern TEXT DEFAULT '*.PRD,*.CUS,*.OD0',
  
  -- Scheduling
  scheduled_time TIME DEFAULT '06:00:00',
  timezone TEXT DEFAULT 'Europe/Oslo',
  is_auto_enabled BOOLEAN DEFAULT false,
  
  -- Status
  last_import_at TIMESTAMPTZ,
  last_import_status TEXT CHECK (last_import_status IN ('success', 'error', 'partial')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. FILE_IMPORT_LOGS - Detaljert logg over alle imports
CREATE TABLE public.file_import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bakery_id UUID NOT NULL REFERENCES bakeries(id) ON DELETE CASCADE,
  
  -- Import detaljer
  source TEXT NOT NULL CHECK (source IN ('manual', 'onedrive', 'auto')),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  execution_time_ms INTEGER,
  
  -- Statistikk
  files_processed INTEGER DEFAULT 0,
  products_imported INTEGER DEFAULT 0,
  customers_imported INTEGER DEFAULT 0,
  orders_created INTEGER DEFAULT 0,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('success', 'error', 'running', 'partial')),
  error_message TEXT,
  file_results JSONB DEFAULT '[]'::jsonb,
  
  triggered_by UUID REFERENCES profiles(id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_onedrive_connections_bakery ON onedrive_connections(bakery_id);
CREATE INDEX idx_onedrive_import_config_bakery ON onedrive_import_config(bakery_id);
CREATE INDEX idx_file_import_logs_bakery_started ON file_import_logs(bakery_id, started_at DESC);
CREATE INDEX idx_file_import_logs_status ON file_import_logs(status);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.onedrive_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onedrive_import_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_import_logs ENABLE ROW LEVEL SECURITY;

-- onedrive_connections policies
CREATE POLICY "Super admins can manage all OneDrive connections"
  ON public.onedrive_connections FOR ALL
  USING (has_role(auth.uid(), 'super_admin'))
  WITH CHECK (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Bakery admins can view their OneDrive connection"
  ON public.onedrive_connections FOR SELECT
  USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Bakery admins can manage their OneDrive connection"
  ON public.onedrive_connections FOR ALL
  USING (
    bakery_id = get_current_user_bakery_id() 
    AND has_role(auth.uid(), 'bakery_admin')
  )
  WITH CHECK (
    bakery_id = get_current_user_bakery_id() 
    AND has_role(auth.uid(), 'bakery_admin')
  );

-- onedrive_import_config policies
CREATE POLICY "Super admins can manage all import configs"
  ON public.onedrive_import_config FOR ALL
  USING (has_role(auth.uid(), 'super_admin'))
  WITH CHECK (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view their bakery import config"
  ON public.onedrive_import_config FOR SELECT
  USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Bakery admins can manage their import config"
  ON public.onedrive_import_config FOR ALL
  USING (
    bakery_id = get_current_user_bakery_id() 
    AND has_role(auth.uid(), 'bakery_admin')
  )
  WITH CHECK (
    bakery_id = get_current_user_bakery_id() 
    AND has_role(auth.uid(), 'bakery_admin')
  );

-- file_import_logs policies
CREATE POLICY "Super admins can view all import logs"
  ON public.file_import_logs FOR SELECT
  USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view their bakery import logs"
  ON public.file_import_logs FOR SELECT
  USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can insert import logs for their bakery"
  ON public.file_import_logs FOR INSERT
  WITH CHECK (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can update their bakery import logs"
  ON public.file_import_logs FOR UPDATE
  USING (bakery_id = get_current_user_bakery_id());

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Funksjon for å oppdatere OneDrive tokens (bruker eksisterende encrypt_credential)
CREATE OR REPLACE FUNCTION public.update_onedrive_tokens(
  _bakery_id UUID,
  _access_token TEXT,
  _refresh_token TEXT,
  _expires_in INTEGER,
  _microsoft_email TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _encryption_key TEXT;
BEGIN
  -- Bruk bakery_id som del av encryption key for ekstra sikkerhet
  _encryption_key := _bakery_id::text || '-onedrive-tokens';
  
  INSERT INTO public.onedrive_connections (
    bakery_id,
    access_token_encrypted,
    refresh_token_encrypted,
    token_expires_at,
    is_connected,
    connected_at,
    connected_by,
    microsoft_email,
    consecutive_failures,
    last_error
  ) VALUES (
    _bakery_id,
    encrypt_credential(_access_token, _encryption_key),
    encrypt_credential(_refresh_token, _encryption_key),
    now() + (_expires_in || ' seconds')::interval,
    true,
    now(),
    auth.uid(),
    _microsoft_email,
    0,
    NULL
  )
  ON CONFLICT (bakery_id) DO UPDATE SET
    access_token_encrypted = encrypt_credential(_access_token, _encryption_key),
    refresh_token_encrypted = encrypt_credential(_refresh_token, _encryption_key),
    token_expires_at = now() + (_expires_in || ' seconds')::interval,
    is_connected = true,
    connected_at = CASE WHEN NOT onedrive_connections.is_connected THEN now() ELSE onedrive_connections.connected_at END,
    microsoft_email = COALESCE(_microsoft_email, onedrive_connections.microsoft_email),
    consecutive_failures = 0,
    last_error = NULL,
    updated_at = now();
END;
$$;

-- Funksjon for å hente dekryptert access token
CREATE OR REPLACE FUNCTION public.get_decrypted_onedrive_token(_bakery_id UUID)
RETURNS TABLE (
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_expired BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _encryption_key TEXT;
BEGIN
  _encryption_key := _bakery_id::text || '-onedrive-tokens';
  
  RETURN QUERY
  SELECT 
    decrypt_credential(oc.access_token_encrypted, _encryption_key) as access_token,
    decrypt_credential(oc.refresh_token_encrypted, _encryption_key) as refresh_token,
    oc.token_expires_at,
    (oc.token_expires_at < now()) as is_expired
  FROM public.onedrive_connections oc
  WHERE oc.bakery_id = _bakery_id
    AND oc.is_connected = true;
END;
$$;

-- Funksjon for å markere OneDrive-feil
CREATE OR REPLACE FUNCTION public.mark_onedrive_error(
  _bakery_id UUID,
  _error_message TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.onedrive_connections
  SET 
    consecutive_failures = consecutive_failures + 1,
    last_error = _error_message,
    updated_at = now(),
    -- Disconnect etter 5 påfølgende feil
    is_connected = CASE WHEN consecutive_failures >= 4 THEN false ELSE is_connected END
  WHERE bakery_id = _bakery_id;
END;
$$;

-- Funksjon for å koble fra OneDrive
CREATE OR REPLACE FUNCTION public.disconnect_onedrive(_bakery_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.onedrive_connections
  SET 
    is_connected = false,
    access_token_encrypted = NULL,
    refresh_token_encrypted = NULL,
    token_expires_at = NULL,
    updated_at = now()
  WHERE bakery_id = _bakery_id;
END;
$$;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_onedrive_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_onedrive_connections_updated_at
  BEFORE UPDATE ON public.onedrive_connections
  FOR EACH ROW EXECUTE FUNCTION update_onedrive_updated_at();

CREATE TRIGGER update_onedrive_import_config_updated_at
  BEFORE UPDATE ON public.onedrive_import_config
  FOR EACH ROW EXECUTE FUNCTION update_onedrive_updated_at();