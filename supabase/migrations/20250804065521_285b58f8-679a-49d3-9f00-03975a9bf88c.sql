-- Fix the get_current_user_bakery_id function to work with updated RLS policies
CREATE OR REPLACE FUNCTION public.get_current_user_bakery_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT bakery_id FROM public.profiles WHERE id = auth.uid() AND is_active = true;
$$;

-- Also fix get_current_user_role function to ensure it works properly
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid() AND is_active = true;
$$;