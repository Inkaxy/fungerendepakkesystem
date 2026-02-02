-- Fix SharedDisplay data visibility
-- Problem: RLS policies for 'anon' role require has_dedicated_display = true,
-- which blocks SharedDisplay customers (who have has_dedicated_display = false)

-- 1. Fix customers policy
DROP POLICY IF EXISTS "Public access to customers via display_url" ON customers;
CREATE POLICY "Public access to customers for displays" ON customers
  FOR SELECT
  TO anon
  USING (
    status = 'active' AND
    bakery_id IN (
      SELECT DISTINCT bakery_id FROM customers 
      WHERE status::text = 'active' AND (
        display_url IS NOT NULL
        OR has_dedicated_display = false
      )
    )
  );

-- 2. Fix orders policy
DROP POLICY IF EXISTS "Public access to orders for displays" ON orders;
CREATE POLICY "Public access to orders for displays" ON orders
  FOR SELECT
  TO anon
  USING (
    bakery_id IN (
      SELECT DISTINCT bakery_id FROM customers 
      WHERE status::text = 'active' AND (
        display_url IS NOT NULL
        OR has_dedicated_display = false
      )
    )
  );

-- 3. Fix order_products policy
DROP POLICY IF EXISTS "Public access to order_products for displays" ON order_products;
CREATE POLICY "Public access to order_products for displays" ON order_products
  FOR SELECT
  TO anon
  USING (
    bakery_id IN (
      SELECT DISTINCT bakery_id FROM customers 
      WHERE status::text = 'active' AND (
        display_url IS NOT NULL
        OR has_dedicated_display = false
      )
    )
  );

-- 4. Fix products policy
DROP POLICY IF EXISTS "Public access to products for displays" ON products;
CREATE POLICY "Public access to products for displays" ON products
  FOR SELECT
  TO anon
  USING (
    bakery_id IN (
      SELECT DISTINCT bakery_id FROM customers 
      WHERE status::text = 'active' AND (
        display_url IS NOT NULL
        OR has_dedicated_display = false
      )
    )
  );

-- 5. Fix active_packing_products policy
DROP POLICY IF EXISTS "Public access to active packing products" ON active_packing_products;
CREATE POLICY "Public access to active packing products" ON active_packing_products
  FOR SELECT
  TO anon
  USING (
    bakery_id IN (
      SELECT DISTINCT bakery_id FROM customers 
      WHERE status::text = 'active' AND (
        display_url IS NOT NULL
        OR has_dedicated_display = false
      )
    )
  );

-- 6. Fix packing_sessions policy
DROP POLICY IF EXISTS "Public access to packing sessions for displays" ON packing_sessions;
CREATE POLICY "Public access to packing sessions for displays" ON packing_sessions
  FOR SELECT
  TO anon
  USING (
    bakery_id IN (
      SELECT DISTINCT bakery_id FROM customers 
      WHERE status::text = 'active' AND (
        display_url IS NOT NULL
        OR has_dedicated_display = false
      )
    )
  );

-- 7. Fix display_settings policy
DROP POLICY IF EXISTS "Public access to display settings" ON display_settings;
CREATE POLICY "Public access to display settings" ON display_settings
  FOR SELECT
  TO anon
  USING (
    bakery_id IN (
      SELECT DISTINCT bakery_id FROM customers 
      WHERE status::text = 'active' AND (
        display_url IS NOT NULL
        OR has_dedicated_display = false
      )
    )
  );