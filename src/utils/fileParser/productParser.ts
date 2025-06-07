
import { ParsedProduct } from './types';
import { removeLeadingZeros } from './idUtils';

export const parseProductFile = (fileContent: string, bakeryId: string): ParsedProduct[] => {
  const lines = fileContent.split('\n').filter(line => line.trim());
  const products: ParsedProduct[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const parts = line.split(/\s+/);
      if (parts.length < 2) {
        console.warn(`Line ${i + 1}: Insufficient data - ${line}`);
        continue;
      }
      
      const originalId = parts[0];
      const productId = removeLeadingZeros(parts[0]);
      
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
      
      products.push({
        original_id: productId,
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
