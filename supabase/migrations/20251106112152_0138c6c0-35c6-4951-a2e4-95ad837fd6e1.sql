-- Create function to automatically close other active packing sessions
CREATE OR REPLACE FUNCTION auto_close_other_packing_sessions()
RETURNS TRIGGER AS $$
BEGIN
  -- If new/updated session is set to 'in_progress'
  IF NEW.status = 'in_progress' THEN
    -- Close all other active sessions for the same bakery
    UPDATE packing_sessions
    SET status = 'completed',
        updated_at = now()
    WHERE bakery_id = NEW.bakery_id
      AND id != NEW.id
      AND status = 'in_progress';
    
    RAISE NOTICE 'Closed other active sessions for bakery %', NEW.bakery_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-close other sessions
DROP TRIGGER IF EXISTS trigger_auto_close_packing_sessions ON packing_sessions;
CREATE TRIGGER trigger_auto_close_packing_sessions
  BEFORE INSERT OR UPDATE OF status ON packing_sessions
  FOR EACH ROW
  EXECUTE FUNCTION auto_close_other_packing_sessions();

-- Cleanup: Close old in_progress sessions (older than 7 days)
UPDATE packing_sessions
SET status = 'completed', 
    updated_at = now()
WHERE status = 'in_progress'
  AND session_date < CURRENT_DATE - INTERVAL '7 days';