-- Fix Security Linter Issues

-- 1. Fix security definer view issue - Remove security barrier from public_customers view
ALTER VIEW public.public_customers SET (security_barrier = false);

-- 2. Fix function search path mutable issues - Set search_path for all functions
ALTER FUNCTION public.get_bakery_id_from_display_url(text) SET search_path = 'public';
ALTER FUNCTION public.get_current_user_role() SET search_path = 'public';
ALTER FUNCTION public.get_current_user_bakery_id() SET search_path = 'public';
ALTER FUNCTION public.create_default_shared_display() SET search_path = 'public';
ALTER FUNCTION public.generate_display_url() SET search_path = 'public';
ALTER FUNCTION public.generate_customer_display_url() SET search_path = 'public';
ALTER FUNCTION public.update_display_presets_updated_at() SET search_path = 'public';
ALTER FUNCTION public.update_file_sync_settings_updated_at() SET search_path = 'public';
ALTER FUNCTION public.auto_generate_display_url() SET search_path = 'public';
ALTER FUNCTION public.extend_user_session() SET search_path = 'public';
ALTER FUNCTION public.should_extend_session() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.audit_role_changes() SET search_path = 'public';

-- Add trigger for role change auditing
DROP TRIGGER IF EXISTS audit_profile_role_changes ON public.profiles;
CREATE TRIGGER audit_profile_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role OR OLD.bakery_id IS DISTINCT FROM NEW.bakery_id)
  EXECUTE FUNCTION public.audit_role_changes();