-- Critical Security Fixes

-- 1. Fix privilege escalation: Prevent users from updating their own roles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create secure profile update policy that excludes role changes
CREATE POLICY "Users can update their own profile (excluding role)" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND OLD.role = NEW.role  -- Prevent role changes
    AND OLD.bakery_id = NEW.bakery_id  -- Prevent bakery_id changes
  );

-- Only super admins can update roles and sensitive fields
CREATE POLICY "Super admins can update user roles and sensitive fields" 
  ON public.profiles 
  FOR UPDATE 
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

-- 2. Add proper INSERT policy for profiles (only for user creation by super admins)
CREATE POLICY "Super admins can create profiles" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (get_current_user_role() = 'super_admin');

-- 3. Fix overly permissive display policies with proper restrictions

-- Replace blanket public access with bakery-specific access for customers
DROP POLICY IF EXISTS "Public access to customers via display_url" ON public.customers;
CREATE POLICY "Public access to customers via display_url" 
  ON public.customers 
  FOR SELECT 
  USING (
    display_url IS NOT NULL 
    AND has_dedicated_display = true 
    AND status = 'active'
    AND bakery_id = get_bakery_id_from_display_url(display_url)
  );

-- Restrict display settings to only the relevant bakery's settings
DROP POLICY IF EXISTS "Public access to display settings" ON public.display_settings;
CREATE POLICY "Public access to display settings" 
  ON public.display_settings 
  FOR SELECT 
  USING (
    bakery_id IN (
      SELECT DISTINCT bakery_id 
      FROM public.customers 
      WHERE display_url IS NOT NULL 
      AND has_dedicated_display = true 
      AND status = 'active'
    )
  );

-- Restrict active packing products to only relevant bakery data
DROP POLICY IF EXISTS "Public access to active packing products" ON public.active_packing_products;
CREATE POLICY "Public access to active packing products" 
  ON public.active_packing_products 
  FOR SELECT 
  USING (
    bakery_id IN (
      SELECT DISTINCT bakery_id 
      FROM public.customers 
      WHERE display_url IS NOT NULL 
      AND has_dedicated_display = true 
      AND status = 'active'
    )
  );

-- Restrict orders access to only relevant bakery data
DROP POLICY IF EXISTS "Public access to orders for displays" ON public.orders;
CREATE POLICY "Public access to orders for displays" 
  ON public.orders 
  FOR SELECT 
  USING (
    bakery_id IN (
      SELECT DISTINCT bakery_id 
      FROM public.customers 
      WHERE display_url IS NOT NULL 
      AND has_dedicated_display = true 
      AND status = 'active'
    )
  );

-- Restrict order_products access to only relevant bakery data
DROP POLICY IF EXISTS "Public access to order_products for displays" ON public.order_products;
CREATE POLICY "Public access to order_products for displays" 
  ON public.order_products 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.id = order_products.order_id
      AND c.display_url IS NOT NULL 
      AND c.has_dedicated_display = true 
      AND c.status = 'active'
    )
  );

-- Restrict products access to only relevant bakery data
DROP POLICY IF EXISTS "Public access to products for displays" ON public.products;
CREATE POLICY "Public access to products for displays" 
  ON public.products 
  FOR SELECT 
  USING (
    bakery_id IN (
      SELECT DISTINCT bakery_id 
      FROM public.customers 
      WHERE display_url IS NOT NULL 
      AND has_dedicated_display = true 
      AND status = 'active'
    )
  );

-- 4. Add audit trigger for role changes (security monitoring)
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log role changes to a simple log (could be enhanced with proper audit table)
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE LOG 'SECURITY AUDIT: Role changed for user % from % to % by %', 
      NEW.id, OLD.role, NEW.role, auth.uid();
  END IF;
  
  IF OLD.bakery_id IS DISTINCT FROM NEW.bakery_id THEN
    RAISE LOG 'SECURITY AUDIT: Bakery assignment changed for user % from % to % by %', 
      NEW.id, OLD.bakery_id, NEW.bakery_id, auth.uid();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger for role change auditing
DROP TRIGGER IF EXISTS audit_profile_role_changes ON public.profiles;
CREATE TRIGGER audit_profile_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role OR OLD.bakery_id IS DISTINCT FROM NEW.bakery_id)
  EXECUTE FUNCTION public.audit_role_changes();

-- 5. Add constraint to prevent invalid role assignments
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS valid_bakery_role_assignment;

ALTER TABLE public.profiles 
ADD CONSTRAINT valid_bakery_role_assignment 
CHECK (
  (role = 'super_admin' AND bakery_id IS NULL) OR 
  (role IN ('bakery_admin', 'bakery_user') AND bakery_id IS NOT NULL)
);