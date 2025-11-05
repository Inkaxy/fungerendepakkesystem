-- Aktiver pgcrypto extension for kryptering
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Opprett tabell for bakery credentials
CREATE TABLE IF NOT EXISTS public.bakery_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bakery_id UUID NOT NULL REFERENCES public.bakeries(id) ON DELETE CASCADE,
  
  -- Microsoft Graph API credentials (kryptert)
  microsoft_client_id_encrypted TEXT,
  microsoft_client_secret_encrypted TEXT,
  microsoft_tenant_id_encrypted TEXT,
  
  -- Resend Email credentials (kryptert)
  resend_api_key_encrypted TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  last_tested_at TIMESTAMPTZ,
  test_status TEXT CHECK (test_status IN ('success', 'failed', 'pending')),
  test_error TEXT,
  
  UNIQUE(bakery_id)
);

-- Enable RLS
ALTER TABLE public.bakery_credentials ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Kun super admin kan administrere credentials
CREATE POLICY "Super admins can view all credentials"
  ON public.bakery_credentials FOR SELECT
  USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can insert credentials"
  ON public.bakery_credentials FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update credentials"
  ON public.bakery_credentials FOR UPDATE
  USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete credentials"
  ON public.bakery_credentials FOR DELETE
  USING (has_role(auth.uid(), 'super_admin'));

-- Funksjon for å kryptere data med AES-256
CREATE OR REPLACE FUNCTION public.encrypt_credential(plain_text TEXT, key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Bruk pgcrypto extension for AES kryptering
  RETURN encode(
    encrypt(
      plain_text::bytea,
      digest(key, 'sha256'),
      'aes'
    ),
    'base64'
  );
END;
$$;

-- Funksjon for å dekryptere data
CREATE OR REPLACE FUNCTION public.decrypt_credential(encrypted_text TEXT, key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN convert_from(
    decrypt(
      decode(encrypted_text, 'base64'),
      digest(key, 'sha256'),
      'aes'
    ),
    'utf8'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Trigger for å oppdatere updated_at
CREATE OR REPLACE FUNCTION public.update_bakery_credentials_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_bakery_credentials_updated_at_trigger
BEFORE UPDATE ON public.bakery_credentials
FOR EACH ROW
EXECUTE FUNCTION public.update_bakery_credentials_updated_at();