-- Create tablets table for device management
CREATE TABLE public.tablets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bakery_id UUID NOT NULL REFERENCES public.bakeries(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  
  -- Identification
  name VARCHAR NOT NULL,
  device_id VARCHAR,
  ip_address VARCHAR,
  
  -- Status
  status VARCHAR DEFAULT 'offline',
  last_seen_at TIMESTAMPTZ,
  last_heartbeat_at TIMESTAMPTZ,
  
  -- Configuration
  kiosk_mode BOOLEAN DEFAULT true,
  display_url VARCHAR,
  
  -- Metadata
  model VARCHAR,
  android_version VARCHAR,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tablets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view tablets from their bakery
CREATE POLICY "Users can view tablets from their bakery"
  ON public.tablets FOR SELECT
  USING (bakery_id = get_current_user_bakery_id());

-- Policy: Admins can insert tablets
CREATE POLICY "Admins can insert tablets"
  ON public.tablets FOR INSERT
  WITH CHECK (
    bakery_id = get_current_user_bakery_id() 
    AND get_current_user_role() IN ('super_admin', 'bakery_admin')
  );

-- Policy: Admins can update tablets
CREATE POLICY "Admins can update tablets"
  ON public.tablets FOR UPDATE
  USING (
    bakery_id = get_current_user_bakery_id() 
    AND get_current_user_role() IN ('super_admin', 'bakery_admin')
  );

-- Policy: Admins can delete tablets
CREATE POLICY "Admins can delete tablets"
  ON public.tablets FOR DELETE
  USING (
    bakery_id = get_current_user_bakery_id() 
    AND get_current_user_role() IN ('super_admin', 'bakery_admin')
  );

-- Create index for faster lookups
CREATE INDEX idx_tablets_bakery_id ON public.tablets(bakery_id);
CREATE INDEX idx_tablets_customer_id ON public.tablets(customer_id);
CREATE INDEX idx_tablets_status ON public.tablets(status);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_tablets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_tablets_updated_at
  BEFORE UPDATE ON public.tablets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tablets_updated_at();