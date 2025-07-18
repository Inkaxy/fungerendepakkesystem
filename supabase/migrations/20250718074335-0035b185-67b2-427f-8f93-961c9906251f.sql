-- Create file sync settings table
CREATE TABLE public.file_sync_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bakery_id UUID NOT NULL REFERENCES public.bakeries(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('onedrive', 'google_drive', 'ftp', 'sftp')),
  service_config JSONB NOT NULL DEFAULT '{}',
  folder_path TEXT,
  schedule_cron TEXT DEFAULT '0 8 * * *', -- Daily at 8 AM
  delete_after_sync BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_sync_status TEXT CHECK (last_sync_status IN ('success', 'error', 'in_progress')),
  last_sync_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(bakery_id, service_type)
);

-- Create file sync logs table
CREATE TABLE public.file_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bakery_id UUID NOT NULL REFERENCES public.bakeries(id) ON DELETE CASCADE,
  sync_setting_id UUID NOT NULL REFERENCES public.file_sync_settings(id) ON DELETE CASCADE,
  sync_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sync_completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'in_progress')) DEFAULT 'in_progress',
  files_found INTEGER DEFAULT 0,
  files_processed INTEGER DEFAULT 0,
  files_failed INTEGER DEFAULT 0,
  error_message TEXT,
  file_details JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on file sync settings
ALTER TABLE public.file_sync_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for file_sync_settings
CREATE POLICY "Users can view their bakery's file sync settings" 
ON public.file_sync_settings 
FOR SELECT 
USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can create file sync settings for their bakery" 
ON public.file_sync_settings 
FOR INSERT 
WITH CHECK (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can update their bakery's file sync settings" 
ON public.file_sync_settings 
FOR UPDATE 
USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can delete their bakery's file sync settings" 
ON public.file_sync_settings 
FOR DELETE 
USING (bakery_id = get_current_user_bakery_id());

-- Enable RLS on file sync logs
ALTER TABLE public.file_sync_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for file_sync_logs
CREATE POLICY "Users can view their bakery's file sync logs" 
ON public.file_sync_logs 
FOR SELECT 
USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can create file sync logs for their bakery" 
ON public.file_sync_logs 
FOR INSERT 
WITH CHECK (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can update their bakery's file sync logs" 
ON public.file_sync_logs 
FOR UPDATE 
USING (bakery_id = get_current_user_bakery_id());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_file_sync_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_file_sync_settings_updated_at
BEFORE UPDATE ON public.file_sync_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_file_sync_settings_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_file_sync_settings_bakery_id ON public.file_sync_settings(bakery_id);
CREATE INDEX idx_file_sync_settings_last_sync ON public.file_sync_settings(last_sync_at);
CREATE INDEX idx_file_sync_logs_bakery_id ON public.file_sync_logs(bakery_id);
CREATE INDEX idx_file_sync_logs_sync_setting_id ON public.file_sync_logs(sync_setting_id);
CREATE INDEX idx_file_sync_logs_created_at ON public.file_sync_logs(created_at DESC);