
-- Add missing cat animation columns to display_settings table
ALTER TABLE public.display_settings 
ADD COLUMN enable_cat_animations boolean DEFAULT false,
ADD COLUMN cat_animation_speed character varying DEFAULT 'normal',
ADD COLUMN show_bouncing_cats boolean DEFAULT true,
ADD COLUMN show_falling_cats boolean DEFAULT true,
ADD COLUMN show_running_cats boolean DEFAULT true;
