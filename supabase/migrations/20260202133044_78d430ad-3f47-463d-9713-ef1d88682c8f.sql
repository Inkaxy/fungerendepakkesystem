-- Add public SELECT policy for packing_sessions to allow anonymous WebSocket subscriptions
CREATE POLICY "Public access to packing sessions for displays" 
ON packing_sessions 
FOR SELECT 
USING (
  bakery_id IN (
    SELECT DISTINCT bakery_id 
    FROM customers 
    WHERE display_url IS NOT NULL 
      AND has_dedicated_display = true 
      AND status = 'active'
  )
);