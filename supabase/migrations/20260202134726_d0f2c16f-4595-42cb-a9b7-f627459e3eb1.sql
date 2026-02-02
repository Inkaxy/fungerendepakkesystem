-- Fiks manglende GRANT-tillatelser på public display views
-- Disse ble fjernet ved re-opprettelse i migrasjon 20260126083142

-- Gi tilgang til views for offentlig display-tilgang
GRANT SELECT ON public_display_orders TO anon, authenticated;
GRANT SELECT ON public_display_order_products TO anon, authenticated;
GRANT SELECT ON public_display_products TO anon, authenticated;
GRANT SELECT ON public_shared_display_customers TO anon, authenticated;