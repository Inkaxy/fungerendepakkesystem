
export interface Customer {
  id: string;
  bakery_id: string;
  name: string;
  customer_number?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: string;
  display_url?: string;
  has_dedicated_display?: boolean;
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
  basket_quantity?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  bakery_id: string;
  customer_id: string;
  order_number: string;
  delivery_date: string;
  status: string; // Changed from union type to string to match database
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
  bakery_id?: string; // Optional - auto-populated by database trigger
  quantity: number;
  unit_price?: number;
  packing_status: string; // Changed from union type to string to match database
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

export interface ActivePackingProduct {
  id: string;
  bakery_id: string;
  session_date: string;
  product_id: string;
  product_name: string;
  total_quantity: number;
  created_at: string;
  updated_at: string;
}
