-- Fiks public_shared_display_customers view
-- Fjern den feilaktige subquery-betingelsen som krevde at bakeriet
-- måtte ha kunder med dedicated display for at shared display skulle fungere

DROP VIEW IF EXISTS public_shared_display_customers;

CREATE VIEW public_shared_display_customers
WITH (security_invoker=on) AS
SELECT 
    id,
    bakery_id,
    name,
    customer_number,
    status,
    has_dedicated_display,
    display_url
FROM customers
WHERE 
    -- Kun kunder som IKKE har dedikert display (de bruker fellesvisningen)
    (has_dedicated_display = false OR has_dedicated_display IS NULL)
    AND status = 'active';