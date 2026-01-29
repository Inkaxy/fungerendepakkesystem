-- Remove "display-" prefix from existing display_url values
UPDATE public.customers
SET display_url = REPLACE(display_url, 'display-', '')
WHERE display_url LIKE 'display-%';