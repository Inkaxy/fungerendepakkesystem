-- Opprett public view for shared display kunder
-- Denne view-en eksponerer kunder UTEN dedicated display fra bakerier
-- som har minst én kunde med dedicated display (for å tillate public access)

CREATE VIEW public_shared_display_customers AS
SELECT 
  c.id,
  c.bakery_id,
  c.name,
  c.customer_number,
  c.status,
  c.has_dedicated_display,
  c.display_url
FROM customers c
WHERE 
  c.has_dedicated_display = false 
  AND c.status = 'active'
  AND c.bakery_id IN (
    SELECT DISTINCT bakery_id 
    FROM customers 
    WHERE display_url IS NOT NULL 
    AND has_dedicated_display = true 
    AND status = 'active'
  );

-- Gi offentlig tilgang til denne view-en
GRANT SELECT ON public_shared_display_customers TO anon;
GRANT SELECT ON public_shared_display_customers TO authenticated;