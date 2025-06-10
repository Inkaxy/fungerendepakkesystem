
import { ParsedCustomer } from './types';
import { removeLeadingZeros } from './idUtils';

export const parseCustomerFile = (fileContent: string, bakeryId: string): ParsedCustomer[] => {
  const lines = fileContent.split('\n').filter(line => line.trim());
  const customers: ParsedCustomer[] = [];
  
  console.log(`Starting customer parsing. Total lines: ${lines.length}`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      let originalCustomerId: string;
      let processedCustomerId: string;
      let customerName: string;
      let address: string = '';
      let phone: string = '';
      
      if (line.includes('kundenummer:') || line.includes('Kundenanv:')) {
        const result = parseLabeledFormat(line);
        if (!result) {
          console.warn(`Line ${i + 1}: Cannot parse labeled format - ${line}`);
          continue;
        }
        ({ originalCustomerId, processedCustomerId, customerName, address, phone } = result);
      } else {
        const result = parseStandardFormat(line);
        if (!result) {
          console.warn(`Line ${i + 1}: Insufficient data - ${line}`);
          continue;
        }
        ({ originalCustomerId, processedCustomerId, customerName, address } = result);
      }
      
      if (!customerName) {
        console.warn(`Line ${i + 1}: No customer name found - ${line}`);
        continue;
      }
      
      console.log(`Line ${i + 1}: Customer parsed - Original: "${originalCustomerId}", Processed: "${processedCustomerId}", Name: "${customerName}"`);
      
      customers.push({
        original_id: originalCustomerId, // Keep original for internal mapping
        customer_number: processedCustomerId, // Use processed number for display
        name: customerName,
        address: address || undefined,
        phone: phone || undefined,
        status: 'active',
        bakery_id: bakeryId
      });
      
    } catch (error) {
      console.error(`Line ${i + 1}: Parse error - ${error.message}`, error);
    }
  }
  
  console.log(`Customer parsing completed. Successfully parsed ${customers.length} customers from ${lines.length} lines`);
  console.log('Sample parsed customers:', customers.slice(0, 3));
  return customers;
};

const parseLabeledFormat = (line: string) => {
  const customerIdMatch = line.match(/kundenummer:\s*(\d+)/i);
  const nameMatch = line.match(/Kundenanv:\s*([^A-Z]+?)(?:\s+[A-Z][a-z]+:|$)/);
  const addressMatch = line.match(/Adresse:\s*([^T]+?)(?:\s+Tlf:|$)/);
  const phoneMatch = line.match(/Tlf:\s*(\d+)/);
  
  if (!customerIdMatch || !nameMatch) {
    return null;
  }
  
  const originalCustomerId = customerIdMatch[1];
  const processedCustomerId = removeLeadingZeros(originalCustomerId);
  
  console.log(`Labeled format - Original: "${originalCustomerId}", Processed: "${processedCustomerId}"`);
  
  return {
    originalCustomerId,
    processedCustomerId,
    customerName: nameMatch[1].trim(),
    address: addressMatch ? addressMatch[1].trim() : '',
    phone: phoneMatch ? phoneMatch[1] : ''
  };
};

const parseStandardFormat = (line: string) => {
  const parts = line.split(/\s{4,}/);
  
  if (parts.length < 2) {
    return null;
  }
  
  const originalCustomerId = parts[0];
  const processedCustomerId = removeLeadingZeros(originalCustomerId);
  
  console.log(`Standard format - Original: "${originalCustomerId}", Processed: "${processedCustomerId}"`);
  
  return {
    originalCustomerId,
    processedCustomerId,
    customerName: parts[1],
    address: parts[2] || ''
  };
};
