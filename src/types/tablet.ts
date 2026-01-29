export interface Tablet {
  id: string;
  bakery_id: string;
  customer_id: string | null;
  name: string;
  device_id: string | null;
  ip_address: string | null;
  status: 'online' | 'offline' | 'error';
  last_seen_at: string | null;
  last_heartbeat_at: string | null;
  kiosk_mode: boolean;
  display_url: string | null;
  model: string | null;
  android_version: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer?: {
    id: string;
    name: string;
    customer_number: string | null;
  } | null;
}

export type TabletStatus = 'online' | 'offline' | 'error';

export interface CreateTabletInput {
  name: string;
  device_id?: string;
  ip_address?: string;
  customer_id?: string | null;
  kiosk_mode?: boolean;
  display_url?: string;
  model?: string;
  android_version?: string;
  notes?: string;
}

export interface UpdateTabletInput extends Partial<CreateTabletInput> {
  id: string;
  status?: TabletStatus;
}
