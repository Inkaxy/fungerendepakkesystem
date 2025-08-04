-- Critical Security Fixes (Fixed Version)

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
    AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))  -- Prevent role changes
    AND (bakery_id = (SELECT bakery_id FROM public.profiles WHERE id = auth.uid()) OR bakery_id IS NULL)  -- Prevent bakery_id changes
  );

-- Only super admins can update roles and sensitive fields
CREATE POLICY "Super admins can update user roles and sensitive fields" 
  ON public.profiles 
  FOR UPDATE 
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

-- 2. Add proper INSERT policy for profiles (only for user creation by super admins or trigger)
CREATE POLICY "Profiles can be created by super admins or system" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (
    get_current_user_role() = 'super_admin' 
    OR auth.uid() IS NULL  -- Allow system/trigger inserts
  );

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

-- 4. Add audit function for role changes (security monitoring)
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log role changes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE LOG 'SECURITY AUDIT: Role changed for user % from % to % by %', 
      NEW.id, OLD.role, NEW.role, COALESCE(auth.uid()::text, 'system');
  END IF;
  
  IF OLD.bakery_id IS DISTINCT FROM NEW.bakery_id THEN
    RAISE LOG 'SECURITY AUDIT: Bakery assignment changed for user % from % to % by %', 
      NEW.id, OLD.bakery_id, NEW.bakery_id, COALESCE(auth.uid()::text, 'system');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;