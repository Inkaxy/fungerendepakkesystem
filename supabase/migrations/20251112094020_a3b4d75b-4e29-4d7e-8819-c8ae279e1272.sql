-- Enable REPLICA IDENTITY FULL for real-time websocket updates
-- This ensures websocket payloads contain complete row data for direct cache updates

ALTER TABLE active_packing_products REPLICA IDENTITY FULL;
ALTER TABLE order_products REPLICA IDENTITY FULL;
ALTER TABLE packing_sessions REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;

-- Verify tables are in realtime publication
-- Note: Tables should already be in supabase_realtime publication via RLS policies
-- This is just a safety check to ensure realtime is properly configured