
import { ParsedOrder } from './types';

export const parseOrderFile = (fileContent: string, bakeryId: string): ParsedOrder[] => {
  const lines = fileContent.split('\n').filter(line => line.trim());
  const orders: ParsedOrder[] = [];
  
  const orderGroups: Map<string, ParsedOrder> = new Map();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const parts = line.trim().split(/\s+/);
      
      if (parts.length < 5) {
        throw new Error(`Invalid format - expected product, composite field, quantity, ignored field, and date. Got ${parts.length} parts`);
      }
      
      const productIdRaw = parts[0];
      const productId = parseInt(productIdRaw, 10).toString();
      
      const compositeField = parts[1];
      if (compositeField.length < 9) {
        throw new Error(`Composite field too short: ${compositeField} (expected at least 9 characters)`);
      }
      
      const customerIdRaw = compositeField.substring(4, 9);
      const customerId = parseInt(customerIdRaw, 10).toString();
      
      const quantityRaw = parts[2];
      const quantity = parseInt(quantityRaw, 10);
      
      console.log('Ignored field (position 4):', parts[3]);
      
      const dateStr = parts[4];
      if (dateStr.length !== 8) {
        throw new Error(`Invalid date format: ${dateStr} (expected 8 digits)`);
      }
      
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const orderDate = `${year}-${month}-${day}`;
      
      const orderKey = `${customerId}-${orderDate}`;
      
      let order = orderGroups.get(orderKey);
      if (!order) {
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        order = {
          order_number: orderNumber,
          delivery_date: orderDate,
          status: 'pending',
          customer_original_id: customerId,
          bakery_id: bakeryId,
          order_products: []
        };
        orderGroups.set(orderKey, order);
      }
      
      order.order_products.push({
        product_original_id: productId,
        quantity: quantity,
        packing_status: 'pending'
      });
      
    } catch (error) {
      console.error(`Line ${i + 1}: Parse error - ${error.message}`);
    }
  }
  
  orders.push(...orderGroups.values());
  
  console.log(`Parsed ${orders.length} orders from ${lines.length} lines`);
  return orders;
};
