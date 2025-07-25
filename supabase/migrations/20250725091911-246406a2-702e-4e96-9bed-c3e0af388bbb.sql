-- Fix function search path issues for security
-- Set proper search_path for all custom functions

-- Update get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$function$;

-- Update get_current_user_bakery_id function  
CREATE OR REPLACE FUNCTION public.get_current_user_bakery_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT bakery_id FROM public.profiles WHERE id = auth.uid();
$function$;

-- Update create_default_shared_display function
CREATE OR REPLACE FUNCTION public.create_default_shared_display()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Opprett standard felles display for nytt bakeri
  INSERT INTO public.display_stations (bakery_id, name, description, is_shared)
  VALUES (NEW.id, 'Felles Display', 'Standard felles display for alle nye kunder', true);
  
  RETURN NEW;
END;
$function$;

-- Update generate_display_url function
CREATE OR REPLACE FUNCTION public.generate_display_url()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  RETURN 'display-' || lower(substring(gen_random_uuid()::text from 1 for 8));
END;
$function$;

-- Update generate_customer_display_url function
CREATE OR REPLACE FUNCTION public.generate_customer_display_url()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.display_url IS NULL THEN
    NEW.display_url := 'display-' || lower(substring(gen_random_uuid()::text from 1 for 8));
  END IF;
  RETURN NEW;
END;
$function$;

-- Update update_display_presets_updated_at function
CREATE OR REPLACE FUNCTION public.update_display_presets_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update update_file_sync_settings_updated_at function
CREATE OR REPLACE FUNCTION public.update_file_sync_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update auto_generate_display_url function
CREATE OR REPLACE FUNCTION public.auto_generate_display_url()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  -- If has_dedicated_display is being set to true and display_url is null, generate one
  IF NEW.has_dedicated_display = true AND (OLD.display_url IS NULL OR OLD.display_url = '') THEN
    NEW.display_url := generate_display_url();
  END IF;
  
  -- If has_dedicated_display is being set to false, clear the display_url
  IF NEW.has_dedicated_display = false THEN
    NEW.display_url := NULL;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    name, 
    avatar_url,
    provider,
    email_confirmed
  )
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_app_meta_data->>'provider', 'email'),
    CASE WHEN new.email_confirmed_at IS NOT NULL THEN true ELSE false END
  );
  RETURN new;
END;
$function$;

-- Update extend_user_session function
CREATE OR REPLACE FUNCTION public.extend_user_session()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update last_login timestamp for session tracking
  UPDATE public.profiles 
  SET last_login = now()
  WHERE id = auth.uid();
END;
$$;

-- Update should_extend_session function
CREATE OR REPLACE FUNCTION public.should_extend_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_login_time timestamp with time zone;
  session_duration interval;
BEGIN
  -- Get user's last login time
  SELECT last_login INTO last_login_time
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- If no last login recorded, extend session
  IF last_login_time IS NULL THEN
    RETURN true;
  END IF;
  
  -- Calculate session duration
  session_duration := now() - last_login_time;
  
  -- Extend session if it's been active within the last 30 minutes
  RETURN session_duration < interval '30 minutes';
END;
$$;