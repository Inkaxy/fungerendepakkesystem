-- Fix RLS policy to only allow public access to unauthenticated users
DROP POLICY IF EXISTS "Public access to customers via display_url" ON customers;

-- Recreate policy for anonymous users only
CREATE POLICY "Public access to customers via display_url" 
ON customers 
FOR SELECT 
TO anon
USING (
  display_url IS NOT NULL 
  AND has_dedicated_display = true 
  AND status = 'active'
);

-- Insert test customers for the user's bakery (5cc73649-558e-471b-aa76-0af13e015083)
INSERT INTO customers (bakery_id, name, customer_number, contact_person, phone, email, status, has_dedicated_display, display_url)
VALUES 
  ('5cc73649-558e-471b-aa76-0af13e015083', 'Test Kunde A', 'K001', 'Ola Nordmann', '12345678', 'ola@test.no', 'active', false, NULL),
  ('5cc73649-558e-471b-aa76-0af13e015083', 'Test Kunde B', 'K002', 'Kari Nordmann', '87654321', 'kari@test.no', 'active', false, NULL),
  ('5cc73649-558e-471b-aa76-0af13e015083', 'Test Kunde C', 'K003', 'Per Hansen', '11223344', 'per@test.no', 'active', true, 'display-' || lower(substring(gen_random_uuid()::text from 1 for 8)));