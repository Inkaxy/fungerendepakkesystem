-- Add force_polling column for Smart-TV support
ALTER TABLE display_settings
ADD COLUMN IF NOT EXISTS force_polling BOOLEAN DEFAULT FALSE;