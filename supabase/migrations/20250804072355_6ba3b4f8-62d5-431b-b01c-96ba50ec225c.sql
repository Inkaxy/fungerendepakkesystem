-- Temporarily modify the packing_sessions INSERT policy to be more permissive for debugging
-- We'll check if the user is authenticated and has a profile, regardless of RLS context

DROP POLICY IF EXISTS "Users can insert packing_sessions to their bakery" ON packing_sessions;

CREATE POLICY "Users can insert packing_sessions to their bakery" ON packing_sessions
FOR INSERT 
WITH CHECK (
  -- Check if user is authenticated and has an active profile in the specified bakery
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND profiles.bakery_id = packing_sessions.bakery_id
  )
);