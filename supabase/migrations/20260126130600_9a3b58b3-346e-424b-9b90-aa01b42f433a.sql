-- Add setting for showing completion icon on shared display
ALTER TABLE public.display_settings 
ADD COLUMN IF NOT EXISTS shared_show_completion_icon boolean DEFAULT true;