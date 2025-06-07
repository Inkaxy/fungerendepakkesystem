// Utility functions for parsing .PRD, .CUS, and .OD0 files

export interface ParsedProduct {
  original_id: string; // Keep original numeric ID for mapping
  name: string;
  category?: string;
  is_active: boolean;
  bakery_id: string;
}

export interface ParsedCustomer {
  original_id: string; // Keep original numeric ID for mapping
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
  customer_original_id: string; // Reference to original numeric ID
  bakery_id: string;
  order_products: {
    product_original_id: string; // Reference to original numeric ID
    quantity: number;
    packing_status: 'pending' | 'in_progress' | 'packed' | 'completed';
  }[];
}

// Remove leading zeros from ID strings
const removeLeadingZeros = (id: string): string => {
  return id.replace(/^0+/, '') || '0';
};

// Parse .PRD files (Products)
export const parseProductFile = (fileContent: string, bakeryId: string): ParsedProduct[] => {
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
      
      // First part is product ID (keep original and remove leading zeros)
      const originalId = parts[0];
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
        original_id: productId, // Store the cleaned numeric ID
        name: productName,
        category: 'Imported',
        is_active: true,
        bakery_id: bakeryId
      });
      
    } catch (error) {
      console.error(`Line ${i + 1}: Parse error - ${error.message}`);
    }
  }
  
  console.log(`Parsed ${products.length} products from ${lines.length} lines`);
  return products;
};

// Parse .CUS files (Customers)
export const parseCustomerFile = (fileContent: string, bakeryId: string): ParsedCustomer[] => {
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
        original_id: customerId, // Store the cleaned numeric ID
        name: customerName,
        address: address || undefined,
        phone: phone || undefined,
        status: 'active',
        bakery_id: bakeryId
      });
      
    } catch (error) {
      console.error(`Line ${i + 1}: Parse error - ${error.message}`);
    }
  }
  
  console.log(`Parsed ${customers.length} customers from ${lines.length} lines`);
  return customers;
};

// Parse .OD0 files (Orders) - using exact parsing as specified
export const parseOrderFile = (
  fileContent: string, 
  bakeryId: string
): ParsedOrder[] => {
  const lines = fileContent.split('\n').filter(line => line.trim());
  const orders: ParsedOrder[] = [];
  
  // Group orders by customer and date
  const orderGroups: Map<string, ParsedOrder> = new Map();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      // Step 1: Split line
      const parts = line.trim().split(/\s+/);
      
      // Step 2: Validate minimum 5 fields
      if (parts.length < 5) {
        throw new Error(`Invalid format - expected product, composite field, quantity, ignored field, and date. Got ${parts.length} parts`);
      }
      
      // Step 3: Product ID (position 1)
      const productIdRaw = parts[0];
      const productId = parseInt(productIdRaw, 10).toString(); // Remove leading zeros
      
      // Step 4: Customer ID from composite field (position 2)
      const compositeField = parts[1];
      if (compositeField.length < 9) {
        throw new Error(`Composite field too short: ${compositeField} (expected at least 9 characters)`);
      }
      
      // Extract customer ID from positions 5-9 (0-indexed: 4-8)
      const customerIdRaw = compositeField.substring(4, 9);
      const customerId = parseInt(customerIdRaw, 10).toString();
      
      // Step 5: Quantity (position 3)
      const quantityRaw = parts[2];
      const quantity = parseInt(quantityRaw, 10);
      
      // Step 6: Skip ignored field (position 4)
      console.log('Ignored field (position 4):', parts[3]);
      
      // Step 7: Date (position 5)
      const dateStr = parts[4];
      if (dateStr.length !== 8) {
        throw new Error(`Invalid date format: ${dateStr} (expected 8 digits)`);
      }
      
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const orderDate = `${year}-${month}-${day}`;
      
      // Create unique key for order grouping
      const orderKey = `${customerId}-${orderDate}`;
      
      // Find or create order
      let order = orderGroups.get(orderKey);
      if (!order) {
        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        order = {
          order_number: orderNumber,
          delivery_date: orderDate,
          status: 'pending',
          customer_original_id: customerId, // Store original numeric ID
          bakery_id: bakeryId,
          order_products: []
        };
        orderGroups.set(orderKey, order);
      }
      
      // Add product to order
      order.order_products.push({
        product_original_id: productId, // Store original numeric ID
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
