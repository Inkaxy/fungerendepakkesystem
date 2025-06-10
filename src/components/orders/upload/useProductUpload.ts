
import { useToast } from '@/hooks/use-toast';
import { useCreateProduct, useProducts } from '@/hooks/useProducts';
import { parseProductFile } from '@/utils/fileParser';
import { IdMapping, UploadResults, UploadStatus } from './types';
import { UserProfile } from '@/stores/authStore';

export const useProductUpload = (
  profile: UserProfile | null,
  setUploadStatus: React.Dispatch<React.SetStateAction<UploadStatus>>,
  setProductIdMapping: React.Dispatch<React.SetStateAction<IdMapping>>,
  setUploadResults: React.Dispatch<React.SetStateAction<UploadResults>>
) => {
  const { toast } = useToast();
  const createProduct = useCreateProduct();
  const { data: existingProducts } = useProducts();

  const handleProductUpload = async (file: File) => {
    console.log('Product upload started with bakery_id:', profile?.bakery_id);
    
    if (!profile?.bakery_id) {
      console.error('No bakery_id found in profile:', profile);
      toast({
        title: "Feil",
        description: `Du må tilhøre et bakeri for å laste opp produkter. Profil: ${profile?.name}, Bakeri ID: ${profile?.bakery_id}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadStatus(prev => ({ ...prev, products: 'uploading' }));
      
      const text = await file.text();
      console.log('File content preview:', text.slice(0, 200));
      
      const products = parseProductFile(text, profile.bakery_id);
      
      console.log('Parsed products from file:', products);
      console.log('Existing products in database:', existingProducts);
      
      const newProductMapping: IdMapping = {};
      const createdProducts = [];
      let newProductsCount = 0;
      let existingProductsCount = 0;
      let productsWithNumbers = 0;
      let productsWithoutNumbers = 0;
      
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
        
        // Track products with/without numbers
        if (product_number) {
          productsWithNumbers++;
        } else {
          productsWithoutNumbers++;
        }
        
        // Check if product already exists by product_number
        const existingProduct = product_number ? existingProductMap.get(product_number) : null;
        
        if (existingProduct) {
          // Product already exists, use existing ID
          newProductMapping[original_id] = existingProduct.id;
          createdProducts.push(existingProduct);
          existingProductsCount++;
          console.log(`Product ${product_number} already exists, using existing ID: ${existingProduct.id}`);
        } else {
          // Product doesn't exist, create new one
          console.log('Creating new product with data:', { product_number, ...productData });
          const createdProduct = await createProduct.mutateAsync({ 
            product_number, 
            ...productData 
          });
          
          newProductMapping[original_id] = createdProduct.id;
          createdProducts.push(createdProduct);
          newProductsCount++;
          
          console.log(`Created new product ${product_number} with ID: ${createdProduct.id}`);
        }
      }
      
      setProductIdMapping(newProductMapping);
      setUploadResults(prev => ({ ...prev, products: createdProducts }));
      setUploadStatus(prev => ({ ...prev, products: 'success' }));
      
      // Show detailed message about new vs existing products and number statistics
      const totalProducts = newProductsCount + existingProductsCount;
      let description = `${totalProducts} produkter behandlet`;
      
      if (newProductsCount > 0 && existingProductsCount > 0) {
        description += ` (${newProductsCount} nye, ${existingProductsCount} eksisterende)`;
      } else if (newProductsCount > 0) {
        description += ` (${newProductsCount} nye produkter opprettet)`;
      } else if (existingProductsCount > 0) {
        description += ` (alle ${existingProductsCount} produkter eksisterte allerede)`;
      }
      
      if (productsWithNumbers > 0) {
        description += `. ${productsWithNumbers} produkter har varenummer`;
      }
      
      if (productsWithoutNumbers > 0) {
        description += `, ${productsWithoutNumbers} mangler varenummer`;
      }
      
      toast({
        title: "Produkter lastet opp",
        description,
      });
    } catch (error) {
      console.error('Product upload error:', error);
      setUploadStatus(prev => ({ ...prev, products: 'error' }));
      toast({
        title: "Feil ved opplasting",
        description: `Kunne ikke laste opp produkter: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return { handleProductUpload };
};
