
// Utility functions for parsing .PRD, .CUS, and .OD0 files

export interface ParsedProduct {
  name: string;
  category?: string;
  is_active: boolean;
  bakery_id: string; // Will be set from user context
}

export interface ParsedCustomer {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: 'active' | 'inactive' | 'blocked';
  bakery_id: string; // Will be set from user context
}

export interface ParsedOrder {
  order_number: string;
  delivery_date: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'packed' | 'delivered' | 'cancelled';
  customer_id: string;
  bakery_id: string; // Will be set from user context
  order_products: {
    product_id: string;
    quantity: number;
    packing_status: 'pending' | 'in_progress' | 'packed' | 'completed';
  }[];
}

// Remove leading zeros from ID strings
const removeLeadingZeros = (id: string): string => {
  return id.replace(/^0+/, '') || '0';
};

// Parse .PRD files (Products)
export const parseProductFile = (fileContent: string): ParsedProduct[] => {
  const lines = fileContent.split('\n').filter(line => line.trim());
  const products: ParsedProduct[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      // Split on whitespace
      const parts = line.split(/\s+/);
      if (parts.length < 2) {
        console.warn(`Line ${i + 1}: Insufficient data - ${line}`);
        continue;
      }
      
      // First part is product ID (remove leading zeros)
      const productId = removeLeadingZeros(parts[0]);
      
      // Find where metadata starts (numbers with >3 digits)
      let nameEndIndex = parts.length;
      for (let j = 1; j < parts.length; j++) {
        if (/^\d{4,}/.test(parts[j])) {
          nameEndIndex = j;
          break;
        }
      }
      
      // Extract product name (everything between ID and metadata)
      const productName = parts.slice(1, nameEndIndex).join(' ');
      
      if (!productName) {
        console.warn(`Line ${i + 1}: No product name found - ${line}`);
        continue;
      }
      
      products.push({
        name: productName,
        category: 'Imported',
        is_active: true,
        bakery_id: '' // Will be set from user context
      });
      
    } catch (error) {
      console.error(`Line ${i + 1}: Parse error - ${error.message}`);
    }
  }
  
  console.log(`Parsed ${products.length} products from ${lines.length} lines`);
  return products;
};

// Parse .CUS files (Customers)
export const parseCustomerFile = (fileContent: string): ParsedCustomer[] => {
  const lines = fileContent.split('\n').filter(line => line.trim());
  const customers: ParsedCustomer[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      let customerId: string;
      let customerName: string;
      let address: string = '';
      let phone: string = '';
      
      // Check if it's labeled format
      if (line.includes('kundenummer:') || line.includes('Kundenanv:')) {
        // Labeled format parsing
        const customerIdMatch = line.match(/kundenummer:\s*(\d+)/i);
        const nameMatch = line.match(/Kundenanv:\s*([^A-Z]+?)(?:\s+[A-Z][a-z]+:|$)/);
        const addressMatch = line.match(/Adresse:\s*([^T]+?)(?:\s+Tlf:|$)/);
        const phoneMatch = line.match(/Tlf:\s*(\d+)/);
        
        if (!customerIdMatch || !nameMatch) {
          console.warn(`Line ${i + 1}: Cannot parse labeled format - ${line}`);
          continue;
        }
        
        customerId = removeLeadingZeros(customerIdMatch[1]);
        customerName = nameMatch[1].trim();
        address = addressMatch ? addressMatch[1].trim() : '';
        phone = phoneMatch ? phoneMatch[1] : '';
        
      } else {
        // Standard format (4+ spaces as separator)
        const parts = line.split(/\s{4,}/);
        
        if (parts.length < 2) {
          console.warn(`Line ${i + 1}: Insufficient data - ${line}`);
          continue;
        }
        
        customerId = removeLeadingZeros(parts[0]);
        customerName = parts[1];
        address = parts[2] || '';
      }
      
      if (!customerName) {
        console.warn(`Line ${i + 1}: No customer name found - ${line}`);
        continue;
      }
      
      customers.push({
        name: customerName,
        address: address || undefined,
        phone: phone || undefined,
        status: 'active',
        bakery_id: '' // Will be set from user context
      });
      
    } catch (error) {
      console.error(`Line ${i + 1}: Parse error - ${error.message}`);
    }
  }
  
  console.log(`Parsed ${customers.length} customers from ${lines.length} lines`);
  return customers;
};

// Parse .OD0 files (Orders)
export const parseOrderFile = (
  fileContent: string, 
  products: ParsedProduct[], 
  customers: ParsedCustomer[]
): ParsedOrder[] => {
  const lines = fileContent.split('\n').filter(line => line.trim());
  const orders: ParsedOrder[] = [];
  
  // Group orders by customer and date
  const orderGroups: Map<string, ParsedOrder> = new Map();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const parts = line.split(/\s+/);
      if (parts.length < 5) {
        console.warn(`Line ${i + 1}: Insufficient data - ${line}`);
        continue;
      }
      
      const productId = removeLeadingZeros(parts[0]);
      const compositeField = parts[1];
      const quantity = parseInt(removeLeadingZeros(parts[2]), 10);
      const dateStr = parts[4];
      
      // Extract customer ID from positions 5-9 (0-indexed: 4-8) of composite field
      if (compositeField.length < 9) {
        console.warn(`Line ${i + 1}: Composite field too short - ${compositeField}`);
        continue;
      }
      
      const customerId = removeLeadingZeros(compositeField.substring(4, 9));
      
      // Convert date from yyyymmdd to yyyy-mm-dd
      const formattedDate = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
      
      // Create unique key for order grouping
      const orderKey = `${customerId}-${formattedDate}`;
      
      // Find or create order
      let order = orderGroups.get(orderKey);
      if (!order) {
        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        order = {
          order_number: orderNumber,
          delivery_date: formattedDate,
          status: 'pending',
          customer_id: customerId,
          bakery_id: '', // Will be set from user context
          order_products: []
        };
        orderGroups.set(orderKey, order);
      }
      
      // Add product to order
      order.order_products.push({
        product_id: productId,
        quantity: quantity,
        packing_status: 'pending'
      });
      
    } catch (error) {
      console.error(`Line ${i + 1}: Parse error - ${error.message}`);
    }
  }
  
  // Convert map to array
  orders.push(...orderGroups.values());
  
  console.log(`Parsed ${orders.length} orders from ${lines.length} lines`);
  return orders;
};
