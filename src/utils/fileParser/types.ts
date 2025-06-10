
export interface ParsedProduct {
  original_id: string;
  product_number?: string; // Add product_number field
  name: string;
  category?: string;
  is_active: boolean;
  bakery_id: string;
}

export interface ParsedCustomer {
  original_id: string;
  customer_number?: string; // Add customer_number field
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: 'active' | 'inactive' | 'blocked';
  bakery_id: string;
}

export interface ParsedOrder {
  order_number: string;
  delivery_date: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'packed' | 'delivered' | 'cancelled';
  customer_original_id: string;
  bakery_id: string;
  order_products: {
    product_original_id: string;
    quantity: number;
    packing_status: 'pending' | 'in_progress' | 'packed' | 'completed';
  }[];
}
