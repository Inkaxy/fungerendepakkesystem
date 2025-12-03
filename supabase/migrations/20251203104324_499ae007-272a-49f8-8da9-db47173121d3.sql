-- Fjern OneDrive-relaterte RLS policies
DROP POLICY IF EXISTS "Bakery admins can delete their OneDrive connection" ON bakery_onedrive_connections;
DROP POLICY IF EXISTS "Bakery admins can insert their OneDrive connection" ON bakery_onedrive_connections;
DROP POLICY IF EXISTS "Bakery admins can update their OneDrive connection" ON bakery_onedrive_connections;
DROP POLICY IF EXISTS "Bakery admins can view their OneDrive connection" ON bakery_onedrive_connections;
DROP POLICY IF EXISTS "Super admins can view all OneDrive connections" ON bakery_onedrive_connections;

DROP POLICY IF EXISTS "Users can create file sync logs for their bakery" ON file_sync_logs;
DROP POLICY IF EXISTS "Users can update their bakery's file sync logs" ON file_sync_logs;
DROP POLICY IF EXISTS "Users can view their bakery's file sync logs" ON file_sync_logs;

DROP POLICY IF EXISTS "Users can create file sync settings for their bakery" ON file_sync_settings;
DROP POLICY IF EXISTS "Users can delete their bakery's file sync settings" ON file_sync_settings;
DROP POLICY IF EXISTS "Users can update their bakery's file sync settings" ON file_sync_settings;
DROP POLICY IF EXISTS "Users can view their bakery's file sync settings" ON file_sync_settings;

-- Fjern triggers
DROP TRIGGER IF EXISTS update_bakery_onedrive_connections_updated_at ON bakery_onedrive_connections;
DROP TRIGGER IF EXISTS update_file_sync_settings_updated_at ON file_sync_settings;
DROP TRIGGER IF EXISTS refresh_cron_on_settings_change ON file_sync_settings;

-- Fjern tabeller (i riktig rekkefølge pga foreign keys)
DROP TABLE IF EXISTS file_sync_logs;
DROP TABLE IF EXISTS file_sync_settings;
DROP TABLE IF EXISTS bakery_onedrive_connections;

-- Fjern funksjoner
DROP FUNCTION IF EXISTS update_bakery_onedrive_connections_updated_at();
DROP FUNCTION IF EXISTS update_file_sync_settings_updated_at();
DROP FUNCTION IF EXISTS get_bakeries_to_sync_now();
DROP FUNCTION IF EXISTS update_sync_cron_jobs();
DROP FUNCTION IF EXISTS refresh_cron_on_settings_change();