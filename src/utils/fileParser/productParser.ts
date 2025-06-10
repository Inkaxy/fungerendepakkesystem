
import { ParsedProduct } from './types';

export const parseProductFile = (fileContent: string, bakeryId: string): ParsedProduct[] => {
  const lines = fileContent.split('\n').filter(line => line.trim());
  const products: ParsedProduct[] = [];
  
  console.log(`Starting product parsing. Total lines: ${lines.length}`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const parts = line.split(/\s+/);
      if (parts.length < 2) {
        console.warn(`Line ${i + 1}: Insufficient data - ${line}`);
        continue;
      }
      
      // For .PRD files, the first "word" is the product number (no leading zeros to remove)
      const productNumber = parts[0];
      const originalId = productNumber; // Keep original for mapping
      
      console.log(`Line ${i + 1}: Parsing product number "${productNumber}" from: ${line}`);
      
      // Find where the product name ends (before any long numeric codes)
      let nameEndIndex = parts.length;
      for (let j = 1; j < parts.length; j++) {
        if (/^\d{4,}/.test(parts[j])) {
          nameEndIndex = j;
          break;
        }
      }
      
      const productName = parts.slice(1, nameEndIndex).join(' ');
      
      if (!productName) {
        console.warn(`Line ${i + 1}: No product name found - ${line}`);
        continue;
      }
      
      console.log(`Line ${i + 1}: Product parsed - Number: "${productNumber}", Name: "${productName}"`);
      
      products.push({
        original_id: originalId, // Keep for internal mapping
        product_number: productNumber, // Use the clean number directly for .PRD files
        name: productName,
        category: 'Imported',
        is_active: true,
        bakery_id: bakeryId
      });
      
    } catch (error) {
      console.error(`Line ${i + 1}: Parse error - ${error.message}`, error);
    }
  }
  
  console.log(`Product parsing completed. Successfully parsed ${products.length} products from ${lines.length} lines`);
  console.log('Sample parsed products:', products.slice(0, 3));
  return products;
};
