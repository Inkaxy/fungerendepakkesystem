-- Add shared_compact_table_mode setting for SharedDisplay compact layout
ALTER TABLE public.display_settings
ADD COLUMN IF NOT EXISTS shared_compact_table_mode boolean DEFAULT false;