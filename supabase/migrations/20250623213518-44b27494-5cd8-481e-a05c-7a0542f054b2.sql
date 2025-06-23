
-- Create the display_stations table
CREATE TABLE public.display_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bakery_id UUID NOT NULL REFERENCES public.bakeries(id) ON DELETE CASCADE,
  name CHARACTER VARYING NOT NULL,
  description TEXT,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.display_stations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for display_stations
CREATE POLICY "Users can view display stations for their bakery"
  ON public.display_stations
  FOR SELECT
  USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Bakery admins can insert display stations"
  ON public.display_stations
  FOR INSERT
  WITH CHECK (
    bakery_id = get_current_user_bakery_id() AND
    get_current_user_role() IN ('super_admin', 'bakery_admin')
  );

CREATE POLICY "Bakery admins can update display stations"
  ON public.display_stations
  FOR UPDATE
  USING (
    bakery_id = get_current_user_bakery_id() AND
    get_current_user_role() IN ('super_admin', 'bakery_admin')
  );

CREATE POLICY "Bakery admins can delete display stations"
  ON public.display_stations
  FOR DELETE
  USING (
    bakery_id = get_current_user_bakery_id() AND
    get_current_user_role() IN ('super_admin', 'bakery_admin')
  );

-- Create the trigger to automatically create a default shared display for new bakeries
CREATE TRIGGER create_default_shared_display_trigger
  AFTER INSERT ON public.bakeries
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_shared_display();
