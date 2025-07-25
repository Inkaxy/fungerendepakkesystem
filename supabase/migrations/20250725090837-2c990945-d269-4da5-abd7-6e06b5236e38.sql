-- Configure auth settings for longer session duration
-- Note: This sets JWT expiry to 24 hours (86400 seconds)
-- This is done via Supabase auth configuration and requires dashboard access

-- Set up a function to extend session automatically
CREATE OR REPLACE FUNCTION public.extend_user_session()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update last_login timestamp for session tracking
  UPDATE public.profiles 
  SET last_login = now()
  WHERE id = auth.uid();
END;
$$;

-- Create a function to check if user session should be extended based on activity
CREATE OR REPLACE FUNCTION public.should_extend_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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