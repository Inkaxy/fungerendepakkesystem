
export interface ParsedProduct {
  original_id: string;
  name: string;
  category?: string;
  is_active: boolean;
  bakery_id: string;
}

export interface ParsedCustomer {
  original_id: string;
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
