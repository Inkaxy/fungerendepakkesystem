-- Legg til auto_fit_screen kolonne for dynamisk skalering av SharedDisplay
ALTER TABLE display_settings 
ADD COLUMN IF NOT EXISTS auto_fit_screen boolean DEFAULT false;