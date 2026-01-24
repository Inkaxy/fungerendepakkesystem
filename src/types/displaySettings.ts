// Display Settings Type Definition
// Types for display presets and templates

// Re-export DisplaySettings from the hook for backwards compatibility
export type { DisplaySettings } from '@/hooks/useDisplaySettings';

// Preset types
export type PresetType = 'complete' | 'colors' | 'layout' | 'typography';

export interface DisplayPreset {
  id: string;
  bakery_id: string;
  user_id: string;
  name: string;
  description?: string | null;
  preset_type: PresetType | null;
  settings: Record<string, unknown>;
  is_public: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreatePresetInput {
  name: string;
  description?: string;
  preset_type?: PresetType;
  settings: Record<string, unknown>;
  is_public?: boolean;
}
