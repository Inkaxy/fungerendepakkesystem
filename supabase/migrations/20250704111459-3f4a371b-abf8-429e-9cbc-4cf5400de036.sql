-- Add new typography settings
ALTER TABLE display_settings 
ADD COLUMN font_family VARCHAR DEFAULT 'Inter',
ADD COLUMN line_height DECIMAL DEFAULT 1.5,
ADD COLUMN text_shadow_enabled BOOLEAN DEFAULT false,
ADD COLUMN text_shadow_color VARCHAR DEFAULT '#00000020',
ADD COLUMN text_shadow_blur INTEGER DEFAULT 2,
ADD COLUMN text_shadow_offset_x INTEGER DEFAULT 1,
ADD COLUMN text_shadow_offset_y INTEGER DEFAULT 1;

-- Add new layout and responsiveness settings
ALTER TABLE display_settings
ADD COLUMN auto_screen_detection BOOLEAN DEFAULT true,
ADD COLUMN fullscreen_mode BOOLEAN DEFAULT false,
ADD COLUMN minimum_card_width INTEGER DEFAULT 200,
ADD COLUMN display_padding INTEGER DEFAULT 16,
ADD COLUMN display_margin INTEGER DEFAULT 8,
ADD COLUMN responsive_breakpoint VARCHAR DEFAULT 'medium';

-- Add new interactivity settings
ALTER TABLE display_settings
ADD COLUMN touch_friendly_sizes BOOLEAN DEFAULT false,
ADD COLUMN touch_target_size INTEGER DEFAULT 44,
ADD COLUMN pause_mode_enabled BOOLEAN DEFAULT false,
ADD COLUMN show_manual_refresh_button BOOLEAN DEFAULT false,
ADD COLUMN manual_refresh_button_position VARCHAR DEFAULT 'top-right';

-- Create table for saved presets
CREATE TABLE display_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bakery_id UUID NOT NULL REFERENCES bakeries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  preset_type TEXT CHECK (preset_type IN ('small_screen', 'large_screen', 'complete')) DEFAULT 'complete',
  settings JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on display_presets
ALTER TABLE display_presets ENABLE ROW LEVEL SECURITY;

-- RLS policies for display_presets
CREATE POLICY "Users can view presets from their bakery" ON display_presets
  FOR SELECT USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can create presets for their bakery" ON display_presets
  FOR INSERT WITH CHECK (bakery_id = get_current_user_bakery_id() AND user_id = auth.uid());

CREATE POLICY "Users can update their own presets" ON display_presets
  FOR UPDATE USING (bakery_id = get_current_user_bakery_id() AND user_id = auth.uid());

CREATE POLICY "Users can delete their own presets" ON display_presets
  FOR DELETE USING (bakery_id = get_current_user_bakery_id() AND user_id = auth.uid());

-- Super admins can manage all presets
CREATE POLICY "Super admins can manage all presets" ON display_presets
  FOR ALL USING (get_current_user_role() = 'super_admin');

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_display_presets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_display_presets_updated_at
  BEFORE UPDATE ON display_presets
  FOR EACH ROW
  EXECUTE FUNCTION update_display_presets_updated_at();