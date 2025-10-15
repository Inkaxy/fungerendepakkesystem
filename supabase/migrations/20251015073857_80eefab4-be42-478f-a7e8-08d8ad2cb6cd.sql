-- Fix CLIENT_SIDE_AUTH: Migrate roles to separate table with security definer functions
-- This prevents privilege escalation attacks

-- 1. Create app_role enum (matching existing user_role but with new name)
CREATE TYPE app_role AS ENUM ('super_admin', 'bakery_admin', 'bakery_user');

-- 2. Create user_roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Migrate existing roles from profiles to user_roles
INSERT INTO user_roles (user_id, role, assigned_at)
SELECT 
  id, 
  role::text::app_role,
  created_at
FROM profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- 5. Create helper function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_primary_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'super_admin' THEN 1
      WHEN 'bakery_admin' THEN 2
      WHEN 'bakery_user' THEN 3
    END
  LIMIT 1;
$$;

-- 6. Update get_current_user_role to use new table
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role::text FROM user_roles 
  WHERE user_id = auth.uid() 
  ORDER BY 
    CASE role
      WHEN 'super_admin' THEN 1
      WHEN 'bakery_admin' THEN 2
      WHEN 'bakery_user' THEN 3
    END
  LIMIT 1;
$$;

-- 7. RLS policies for user_roles table
CREATE POLICY "Only super_admins can manage all roles"
ON user_roles FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view their own roles"
ON user_roles FOR SELECT
USING (user_id = auth.uid());

-- 8. Update audit_role_changes trigger to work with user_roles
CREATE OR REPLACE FUNCTION public.audit_user_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    RAISE LOG 'SECURITY AUDIT: Role % assigned to user % by %', 
      NEW.role, NEW.user_id, COALESCE(auth.uid()::text, 'system');
  ELSIF TG_OP = 'UPDATE' THEN
    RAISE LOG 'SECURITY AUDIT: Role changed for user % from % to % by %', 
      NEW.user_id, OLD.role, NEW.role, COALESCE(auth.uid()::text, 'system');
  ELSIF TG_OP = 'DELETE' THEN
    RAISE LOG 'SECURITY AUDIT: Role % removed from user % by %', 
      OLD.role, OLD.user_id, COALESCE(auth.uid()::text, 'system');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER audit_user_role_changes
  AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION audit_user_role_changes();

-- 9. Keep profiles.role column for backward compatibility but mark as deprecated
COMMENT ON COLUMN profiles.role IS 'DEPRECATED: Use user_roles table instead. This column is kept for backward compatibility only.';