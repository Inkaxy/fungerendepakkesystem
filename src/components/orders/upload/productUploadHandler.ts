import { parseProductFile } from '@/utils/fileParser';
import { IdMapping, UploadResults, UploadStatus } from './types';
import { UserProfile } from '@/stores/authStore';

export const createProductUploadHandler = (
  profile: UserProfile | null,
  toast: any,
  createProduct: any,
  existingProducts: any[] | undefined,
  setUploadStatus: React.Dispatch<React.SetStateAction<UploadStatus>>,
  setProductIdMapping: React.Dispatch<React.SetStateAction<IdMapping>>,
  setUploadResults: React.Dispatch<React.SetStateAction<UploadResults>>
) => {
  return async (file: File): Promise<IdMapping> => {
    console.log('Product upload started with bakery_id:', profile?.bakery_id);
    
    if (!profile?.bakery_id) {
      console.error('No bakery_id found in profile:', profile);
      toast({
        title: "Feil",
        description: `Du må tilhøre et bakeri for å laste opp produkter.`,
        variant: "destructive",
      });
      return {};
    }

    try {
      setUploadStatus(prev => ({ ...prev, products: 'uploading' }));
      
      const text = await file.text();
      console.log('File content preview:', text.slice(0, 200));
      
      const products = parseProductFile(text, profile.bakery_id);
      
      console.log('Parsed products from file:', products);
      
      const newProductMapping: IdMapping = {};
      const createdProducts = [];
      let newProductsCount = 0;
      let existingProductsCount = 0;
      
      // Create a map of existing products by product_number for quick lookup
      const existingProductMap = new Map();
      if (existingProducts) {
        existingProducts.forEach(product => {
          if (product.product_number) {
            existingProductMap.set(product.product_number, product);
          }
        });
      }
      
      for (const product of products) {
        const { original_id, product_number, ...productData } = product;
        
        // Check if product already exists by product_number
        const existingProduct = product_number ? existingProductMap.get(product_number) : null;
        
        if (existingProduct) {
          newProductMapping[original_id] = existingProduct.id;
          createdProducts.push(existingProduct);
          existingProductsCount++;
        } else {
          const createdProduct = await createProduct.mutateAsync({ 
            product_number, 
            ...productData 
          });
          
          newProductMapping[original_id] = createdProduct.id;
          createdProducts.push(createdProduct);
          newProductsCount++;
        }
      }
      
      setProductIdMapping(newProductMapping);
      setUploadResults(prev => ({ ...prev, products: createdProducts }));
      setUploadStatus(prev => ({ ...prev, products: 'success' }));
      
      const totalProducts = newProductsCount + existingProductsCount;
      let description = `${totalProducts} produkter behandlet`;
      
      if (newProductsCount > 0 && existingProductsCount > 0) {
        description += ` (${newProductsCount} nye, ${existingProductsCount} eksisterende)`;
      } else if (newProductsCount > 0) {
        description += ` (${newProductsCount} nye produkter opprettet)`;
      } else if (existingProductsCount > 0) {
        description += ` (alle ${existingProductsCount} produkter eksisterte allerede)`;
      }
      
      toast({
        title: "Produkter lastet opp",
        description,
      });
      
      return newProductMapping;
    } catch (error) {
      console.error('Product upload error:', error);
      setUploadStatus(prev => ({ ...prev, products: 'error' }));
      toast({
        title: "Feil ved opplasting",
        description: `Kunne ikke laste opp produkter: ${error.message}`,
        variant: "destructive",
      });
      return {};
    }
  };
};
