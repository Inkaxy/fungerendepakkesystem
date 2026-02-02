-- Drop the old check constraint and add a new one that includes 'customer'
ALTER TABLE public.display_settings DROP CONSTRAINT check_screen_type;

ALTER TABLE public.display_settings ADD CONSTRAINT check_screen_type 
CHECK (screen_type::text = ANY (ARRAY['small', 'large', 'shared', 'customer']::text[]));

-- Now create missing customer display_settings rows for all bakeries
INSERT INTO public.display_settings (bakery_id, screen_type)
SELECT b.id, 'customer'
FROM public.bakeries b
WHERE NOT EXISTS (
  SELECT 1 FROM public.display_settings ds 
  WHERE ds.bakery_id = b.id AND ds.screen_type = 'customer'
);