
import { ParsedOrder } from './types';
import { removeLeadingZeros } from './idUtils';

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
      
      // Parse første ord som varenummer
      const productIdRaw = parts[0];
      const productId = removeLeadingZeros(productIdRaw);
      
      // Parse andre ord (composite field) med ny logikk
      const compositeField = parts[1];
      if (compositeField.length < 9) {
        throw new Error(`Composite field too short: ${compositeField} (expected at least 9 characters)`);
      }
      
      // Fjern første 4 siffer (1000), da står vi igjen med resten
      const withoutPrefix = compositeField.substring(4);
      
      // De siste 5 sifrene er antallet
      if (withoutPrefix.length < 5) {
        throw new Error(`Composite field after removing prefix too short: ${withoutPrefix}`);
      }
      
      const quantityPart = withoutPrefix.slice(-5);
      const quantity = parseInt(removeLeadingZeros(quantityPart), 10);
      
      // Resten i midten er kundenummer
      const customerPart = withoutPrefix.slice(0, -5);
      const customerId = removeLeadingZeros(customerPart);
      
      console.log(`Parsing line ${i + 1}:`);
      console.log(`- Product ID raw: ${productIdRaw} -> processed: ${productId}`);
      console.log(`- Composite field: ${compositeField}`);
      console.log(`- Without prefix (1000): ${withoutPrefix}`);
      console.log(`- Customer part: ${customerPart} -> processed: ${customerId}`);
      console.log(`- Quantity part: ${quantityPart} -> processed: ${quantity}`);
      
      // Ignorer tredje felt (parts[3])
      console.log('Ignored field (position 4):', parts[3]);
      
      // Parse dato (fjerde felt)
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
