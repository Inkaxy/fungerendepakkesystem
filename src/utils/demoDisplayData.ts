// Demo data for display preview when no real data exists

export interface DemoProduct {
  product_id: string;
  product_name: string;
  total_quantity: number;
  packed_quantity: number;
  product_unit: string;
  packing_status: 'pending' | 'in_progress' | 'packed' | 'completed';
}

export interface DemoCustomerPackingData {
  id: string;
  name: string;
  customer_number: string;
  products: DemoProduct[];
  overall_status: 'pending' | 'ongoing' | 'completed';
  progress_percentage: number;
  total_line_items: number;
  packed_line_items: number;
  total_line_items_all: number;
  packed_line_items_all: number;
}

export interface DemoCustomer {
  id: string;
  name: string;
  customer_number: string;
  bakery_id: string;
  status: string;
  has_dedicated_display: boolean;
  display_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  contact_person?: string | null;
}

// Demo customers for SharedDisplay
export const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    id: 'demo-customer-1',
    name: 'Cafe Solberg',
    customer_number: 'K-001',
    bakery_id: 'demo-bakery',
    status: 'active',
    has_dedicated_display: false,
    display_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-customer-2',
    name: 'Bakeren på Hjørnet',
    customer_number: 'K-002',
    bakery_id: 'demo-bakery',
    status: 'active',
    has_dedicated_display: false,
    display_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-customer-3',
    name: 'Konditori Fjorden',
    customer_number: 'K-003',
    bakery_id: 'demo-bakery',
    status: 'active',
    has_dedicated_display: false,
    display_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Demo customer for CustomerDisplay (dedicated display)
export const DEMO_DEDICATED_CUSTOMER: DemoCustomer = {
  id: 'demo-dedicated-customer',
  name: 'Butikken AS',
  customer_number: 'K-100',
  bakery_id: 'demo-bakery',
  status: 'active',
  has_dedicated_display: true,
  display_url: 'demo-customer',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Demo products for each customer (3 products each with different statuses)
export const DEMO_PACKING_DATA: DemoCustomerPackingData[] = [
  {
    id: 'demo-customer-1',
    name: 'Cafe Solberg',
    customer_number: 'K-001',
    products: [
      {
        product_id: 'demo-product-1',
        product_name: 'Grovbrød',
        total_quantity: 25,
        packed_quantity: 25,
        product_unit: 'stk',
        packing_status: 'packed',
      },
      {
        product_id: 'demo-product-2',
        product_name: 'Kanelboller',
        total_quantity: 48,
        packed_quantity: 24,
        product_unit: 'stk',
        packing_status: 'in_progress',
      },
      {
        product_id: 'demo-product-3',
        product_name: 'Rundstykker',
        total_quantity: 60,
        packed_quantity: 0,
        product_unit: 'stk',
        packing_status: 'pending',
      },
    ],
    overall_status: 'ongoing',
    progress_percentage: 65,
    total_line_items: 3,
    packed_line_items: 2,
    total_line_items_all: 3,
    packed_line_items_all: 2,
  },
  {
    id: 'demo-customer-2',
    name: 'Bakeren på Hjørnet',
    customer_number: 'K-002',
    products: [
      {
        product_id: 'demo-product-4',
        product_name: 'Loff',
        total_quantity: 30,
        packed_quantity: 30,
        product_unit: 'stk',
        packing_status: 'packed',
      },
      {
        product_id: 'demo-product-5',
        product_name: 'Wienerbrød',
        total_quantity: 24,
        packed_quantity: 24,
        product_unit: 'stk',
        packing_status: 'packed',
      },
      {
        product_id: 'demo-product-6',
        product_name: 'Skillingsboller',
        total_quantity: 36,
        packed_quantity: 36,
        product_unit: 'stk',
        packing_status: 'packed',
      },
    ],
    overall_status: 'completed',
    progress_percentage: 100,
    total_line_items: 3,
    packed_line_items: 3,
    total_line_items_all: 3,
    packed_line_items_all: 3,
  },
  {
    id: 'demo-customer-3',
    name: 'Konditori Fjorden',
    customer_number: 'K-003',
    products: [
      {
        product_id: 'demo-product-7',
        product_name: 'Croissant',
        total_quantity: 20,
        packed_quantity: 20,
        product_unit: 'stk',
        packing_status: 'packed',
      },
      {
        product_id: 'demo-product-8',
        product_name: 'Baguette',
        total_quantity: 15,
        packed_quantity: 0,
        product_unit: 'stk',
        packing_status: 'pending',
      },
      {
        product_id: 'demo-product-9',
        product_name: 'Focaccia',
        total_quantity: 12,
        packed_quantity: 0,
        product_unit: 'stk',
        packing_status: 'pending',
      },
    ],
    overall_status: 'ongoing',
    progress_percentage: 33,
    total_line_items: 3,
    packed_line_items: 1,
    total_line_items_all: 3,
    packed_line_items_all: 1,
  },
];

// Demo packing data for dedicated customer display
export const DEMO_DEDICATED_PACKING_DATA: DemoCustomerPackingData = {
  id: 'demo-dedicated-customer',
  name: 'Butikken AS',
  customer_number: 'K-100',
  products: [
    {
      product_id: 'demo-product-10',
      product_name: 'Havrebrød',
      total_quantity: 40,
      packed_quantity: 40,
      product_unit: 'stk',
      packing_status: 'packed',
    },
    {
      product_id: 'demo-product-11',
      product_name: 'Kardemommeboller',
      total_quantity: 60,
      packed_quantity: 30,
      product_unit: 'stk',
      packing_status: 'in_progress',
    },
    {
      product_id: 'demo-product-12',
      product_name: 'Sjokoladekake',
      total_quantity: 8,
      packed_quantity: 0,
      product_unit: 'stk',
      packing_status: 'pending',
    },
  ],
  overall_status: 'ongoing',
  progress_percentage: 50,
  total_line_items: 3,
  packed_line_items: 1,
  total_line_items_all: 3,
  packed_line_items_all: 1,
};

// Demo active products
export const DEMO_ACTIVE_PRODUCTS = [
  { product_id: 'demo-product-1', product_name: 'Grovbrød' },
  { product_id: 'demo-product-2', product_name: 'Kanelboller' },
  { product_id: 'demo-product-3', product_name: 'Rundstykker' },
  { product_id: 'demo-product-4', product_name: 'Loff' },
  { product_id: 'demo-product-5', product_name: 'Wienerbrød' },
  { product_id: 'demo-product-6', product_name: 'Skillingsboller' },
  { product_id: 'demo-product-7', product_name: 'Croissant' },
  { product_id: 'demo-product-8', product_name: 'Baguette' },
  { product_id: 'demo-product-9', product_name: 'Focaccia' },
  { product_id: 'demo-product-10', product_name: 'Havrebrød' },
  { product_id: 'demo-product-11', product_name: 'Kardemommeboller' },
  { product_id: 'demo-product-12', product_name: 'Sjokoladekake' },
];

// Demo packing date
export const DEMO_PACKING_DATE = new Date().toISOString().split('T')[0];
