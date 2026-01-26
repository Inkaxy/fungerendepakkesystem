-- Fiks views for SharedDisplay: Fjern has_dedicated_display = true filter
-- slik at ordre-data er tilgjengelig for alle kunder med aktive displays

-- 1. Oppdater public_display_orders view
DROP VIEW IF EXISTS public_display_orders;

CREATE VIEW public_display_orders AS
SELECT id, customer_id, delivery_date, bakery_id, status
FROM orders o
WHERE bakery_id IN (
  SELECT DISTINCT bakery_id FROM customers
  WHERE display_url IS NOT NULL 
    AND status = 'active'
)
AND status IN ('pending', 'in_progress', 'packed', 'completed');

-- 2. Oppdater public_display_order_products view
DROP VIEW IF EXISTS public_display_order_products;

CREATE VIEW public_display_order_products AS
SELECT op.id, op.order_id, op.product_id, op.quantity, op.packing_status
FROM order_products op
WHERE EXISTS (
  SELECT 1 FROM orders o 
  JOIN customers c ON o.customer_id = c.id
  WHERE o.id = op.order_id 
    AND c.status = 'active'
    AND c.bakery_id IN (
      SELECT DISTINCT bakery_id FROM customers
      WHERE display_url IS NOT NULL 
        AND status = 'active'
    )
);

-- 3. Oppdater public_display_products view for konsistens
DROP VIEW IF EXISTS public_display_products;

CREATE VIEW public_display_products AS
SELECT id, name, category, unit, bakery_id
FROM products p
WHERE bakery_id IN (
  SELECT DISTINCT bakery_id FROM customers
  WHERE display_url IS NOT NULL 
    AND status = 'active'
)
AND is_active = true;