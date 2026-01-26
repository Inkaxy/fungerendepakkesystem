-- Add grid layout configuration columns to display_settings
ALTER TABLE public.display_settings
ADD COLUMN IF NOT EXISTS grid_layout_mode text DEFAULT 'auto',
ADD COLUMN IF NOT EXISTS grid_fixed_rows integer DEFAULT 3,
ADD COLUMN IF NOT EXISTS grid_fixed_columns integer DEFAULT 4;

-- Add comment for documentation
COMMENT ON COLUMN public.display_settings.grid_layout_mode IS 'Layout mode: auto (calculate optimal) or fixed (user-defined grid)';
COMMENT ON COLUMN public.display_settings.grid_fixed_rows IS 'Number of rows when using fixed grid mode (1-6)';
COMMENT ON COLUMN public.display_settings.grid_fixed_columns IS 'Number of columns when using fixed grid mode (1-6)';