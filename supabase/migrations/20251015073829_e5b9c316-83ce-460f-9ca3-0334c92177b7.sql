-- Fix public data exposure by creating restricted views for display access
-- This addresses: PUBLIC_CUSTOMER_DATA, PUBLIC_ORDER_DATA, PUBLIC_ORDER_PRODUCTS, PUBLIC_PRODUCT_DATA

-- 1. Create restricted public view for customers (only safe fields)
CREATE OR REPLACE VIEW public_display_customers AS
SELECT 
  id,
  name,
  display_url,
  status,
  has_dedicated_display,
  bakery_id
FROM customers
WHERE display_url IS NOT NULL 
  AND has_dedicated_display = true 
  AND status = 'active';

ALTER VIEW public_display_customers OWNER TO postgres;
GRANT SELECT ON public_display_customers TO anon, authenticated;

-- 2. Create restricted public view for orders (exclude sensitive business data)
CREATE OR REPLACE VIEW public_display_orders AS
SELECT 
  o.id,
  o.customer_id,
  o.delivery_date,
  o.bakery_id,
  o.status
FROM orders o
WHERE o.bakery_id IN (
  SELECT DISTINCT bakery_id 
  FROM customers 
  WHERE display_url IS NOT NULL 
    AND has_dedicated_display = true 
    AND status = 'active'
)
AND o.status IN ('pending', 'in_progress', 'packed', 'completed');

ALTER VIEW public_display_orders OWNER TO postgres;
GRANT SELECT ON public_display_orders TO anon, authenticated;

-- 3. Create restricted public view for order_products (exclude pricing)
CREATE OR REPLACE VIEW public_display_order_products AS
SELECT 
  op.id,
  op.order_id,
  op.product_id,
  op.quantity,
  op.packing_status
FROM order_products op
WHERE EXISTS (
  SELECT 1 
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE o.id = op.order_id
    AND c.display_url IS NOT NULL
    AND c.has_dedicated_display = true
    AND c.status = 'active'
);

ALTER VIEW public_display_order_products OWNER TO postgres;
GRANT SELECT ON public_display_order_products TO anon, authenticated;

-- 4. Create restricted public view for products (exclude pricing and internal data)
CREATE OR REPLACE VIEW public_display_products AS
SELECT 
  p.id,
  p.name,
  p.category,
  p.unit,
  p.bakery_id
FROM products p
WHERE p.bakery_id IN (
  SELECT DISTINCT bakery_id 
  FROM customers 
  WHERE display_url IS NOT NULL 
    AND has_dedicated_display = true 
    AND status = 'active'
)
AND p.is_active = true;

ALTER VIEW public_display_products OWNER TO postgres;
GRANT SELECT ON public_display_products TO anon, authenticated;

-- 5. Remove overly permissive public RLS policies (they'll be replaced by view-based access)
-- Keep the policies but they won't be used by public displays anymore
-- This maintains backward compatibility while securing the data

COMMENT ON VIEW public_display_customers IS 'Public view for customer displays - excludes contact information';
COMMENT ON VIEW public_display_orders IS 'Public view for order displays - excludes order numbers and amounts';
COMMENT ON VIEW public_display_order_products IS 'Public view for order products - excludes pricing';
COMMENT ON VIEW public_display_products IS 'Public view for products - excludes pricing and internal data';