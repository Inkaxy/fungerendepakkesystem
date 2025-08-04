-- Update the packing_sessions RLS policy to be more robust and add better debugging
-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert packing_sessions to their bakery" ON packing_sessions;

-- Create a more robust INSERT policy with better error handling
CREATE POLICY "Users can insert packing_sessions to their bakery" ON packing_sessions
FOR INSERT 
WITH CHECK (
  -- Ensure user is authenticated
  auth.uid() IS NOT NULL
  AND
  -- Check if user has an active profile in the specified bakery
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND profiles.bakery_id = packing_sessions.bakery_id
  )
);

-- Also ensure UPDATE and SELECT policies exist for consistency
DROP POLICY IF EXISTS "Users can update packing_sessions in their bakery" ON packing_sessions;
CREATE POLICY "Users can update packing_sessions in their bakery" ON packing_sessions
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL
  AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND profiles.bakery_id = packing_sessions.bakery_id
  )
);

DROP POLICY IF EXISTS "Users can select packing_sessions from their bakery" ON packing_sessions;
CREATE POLICY "Users can select packing_sessions from their bakery" ON packing_sessions
FOR SELECT 
USING (
  auth.uid() IS NOT NULL
  AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND profiles.bakery_id = packing_sessions.bakery_id
  )
);