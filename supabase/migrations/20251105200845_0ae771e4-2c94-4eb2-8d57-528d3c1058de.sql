-- Utvid file_sync_settings tabellen med nye kolonner
ALTER TABLE file_sync_settings 
ADD COLUMN IF NOT EXISTS delete_old_files_after_days INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS notification_email VARCHAR,
ADD COLUMN IF NOT EXISTS send_failure_notifications BOOLEAN DEFAULT false;

-- Aktiver pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Opprett funksjon for å oppdatere cron-jobber dynamisk basert på innstillinger
CREATE OR REPLACE FUNCTION update_sync_cron_jobs()
RETURNS void AS $$
DECLARE
  setting RECORD;
  job_command TEXT;
BEGIN
  -- Fjern alle eksisterende sync-jobber
  PERFORM cron.unschedule(jobname) 
  FROM cron.job 
  WHERE jobname LIKE 'onedrive-sync-%';
  
  -- Opprett nye jobber basert på aktive innstillinger
  FOR setting IN 
    SELECT id, schedule_cron, bakery_id
    FROM file_sync_settings
    WHERE is_active = true AND service_type = 'onedrive'
  LOOP
    job_command := format(
      'SELECT net.http_post(url := ''https://sxggxcaanwsrufxfjbqb.supabase.co/functions/v1/sync-onedrive-files'', headers := ''{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Z2d4Y2FhbndzcnVmeGZqYnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDYxOTEsImV4cCI6MjA2NDcyMjE5MX0.7iluHZfXaL80ypfz4e4cdszkqe5pWiI5nGNHMbUJxAc", "Content-Type": "application/json"}''::jsonb, body := ''{"setting_id": "%s"}''::jsonb);',
      setting.id
    );
    
    PERFORM cron.schedule(
      'onedrive-sync-' || setting.id::text,
      setting.schedule_cron,
      job_command
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Opprett trigger for å oppdatere cron når innstillinger endres
CREATE OR REPLACE FUNCTION refresh_cron_on_settings_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_sync_cron_jobs();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_settings_cron_update ON file_sync_settings;
CREATE TRIGGER sync_settings_cron_update
AFTER INSERT OR UPDATE OR DELETE ON file_sync_settings
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_cron_on_settings_change();