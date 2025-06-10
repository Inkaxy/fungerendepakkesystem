
import { useToast } from '@/hooks/use-toast';
import { useCreateProduct } from '@/hooks/useProducts';
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
      const products = parseProductFile(text, profile.bakery_id);
      
      console.log('Parsed products:', products);
      
      const newProductMapping: IdMapping = {};
      const createdProducts = [];
      
      for (const product of products) {
        console.log('Creating product:', product);
        const { original_id, ...productData } = product;
        const createdProduct = await createProduct.mutateAsync(productData);
        
        newProductMapping[original_id] = createdProduct.id;
        createdProducts.push(createdProduct);
        
        console.log(`Mapped product ID ${original_id} -> ${createdProduct.id}`);
      }
      
      setProductIdMapping(newProductMapping);
      setUploadResults(prev => ({ ...prev, products: createdProducts }));
      setUploadStatus(prev => ({ ...prev, products: 'success' }));
      
      toast({
        title: "Produkter lastet opp",
        description: `${products.length} produkter ble importert med varenummer`,
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
