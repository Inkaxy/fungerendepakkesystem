-- Legg til short_id kolonne for kortere delt display URLer
ALTER TABLE public.bakeries 
ADD COLUMN short_id VARCHAR(6) UNIQUE;

-- Generer short_id for eksisterende bakerier
UPDATE public.bakeries 
SET short_id = lower(substring(gen_random_uuid()::text from 1 for 6))
WHERE short_id IS NULL;

-- Sett NOT NULL constraint etter at eksisterende data er oppdatert
ALTER TABLE public.bakeries 
ALTER COLUMN short_id SET NOT NULL;

-- Sett default for nye bakerier
ALTER TABLE public.bakeries 
ALTER COLUMN short_id SET DEFAULT lower(substring(gen_random_uuid()::text from 1 for 6));

-- Opprett funksjon for å hente bakery_id fra short_id
CREATE OR REPLACE FUNCTION public.get_bakery_id_from_short_id(short_id_param text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id FROM public.bakeries WHERE short_id = short_id_param LIMIT 1;
$$;