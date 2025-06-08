
export interface Customer {
  id: string;
  bakery_id: string;
  name: string;
  customer_number?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: 'active' | 'inactive' | 'blocked';
  display_url?: string;
  assigned_display_station_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  bakery_id: string;
  name: string;
  product_number?: string;
  category?: string;
  price?: number;
  unit?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  bakery_id: string;
  customer_id: string;
  order_number: string;
  delivery_date: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'packed' | 'delivered' | 'cancelled';
  total_amount?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  order_products?: OrderProduct[];
}

export interface OrderProduct {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price?: number;
  packing_status: 'pending' | 'in_progress' | 'packed' | 'completed';
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface PackingSession {
  id: string;
  bakery_id: string;
  session_date: string;
  total_orders: number;
  unique_customers: number;
  product_types: number;
  files_uploaded: number;
  status: 'ready' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface DisplayStation {
  id: string;
  bakery_id: string;
  name: string;
  description?: string;
  location?: string;
  is_active: boolean;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface DisplaySettings {
  id: string;
  display_station_id: string;
  customer_id?: string;
  font_size: number;
  background_color: string;
  text_color: string;
  accent_color: string;
  header_height: number;
  enable_animations: boolean;
  animation_speed: number;
  rotation_interval: number;
  show_customer_info: boolean;
  show_delivery_date: boolean;
  products_per_view: number;
  show_product_images: boolean;
  show_quantities: boolean;
  show_notes: boolean;
  created_at: string;
  updated_at: string;
}

export interface DisplayAssignment {
  id: string;
  customer_id: string;
  display_station_id: string;
  display_url: string;
  is_active: boolean;
  assigned_at: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  display_station?: DisplayStation;
}
