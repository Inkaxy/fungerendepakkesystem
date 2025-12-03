import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActivePackingDate } from '@/hooks/useActivePackingDate';
import { useActivePackingProducts, useClearActivePackingProducts } from '@/hooks/useActivePackingProducts';
import { useRealTimeActivePackingProducts } from '@/hooks/useRealTimeActivePackingProducts';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const ContinuePackingButton = () => {
  const navigate = useNavigate();
  
  // ✅ Aktiver WebSocket-lytter for real-time oppdateringer
  useRealTimeActivePackingProducts();
  
  const { data: activeDate, isLoading: dateLoading } = useActivePackingDate();
  const { data: activeProducts, isLoading: productsLoading } = useActivePackingProducts(activeDate || undefined);
  const clearActiveProducts = useClearActivePackingProducts();

  // Ikke vis noe hvis vi laster eller ikke har aktive produkter
  if (dateLoading || productsLoading || !activeDate || !activeProducts || activeProducts.length === 0) {
    return null;
  }

  const handleContinuePacking = () => {
    // Naviger til første produkt med alle produkter i state
    const productIds = activeProducts.map(p => p.product_id);
    navigate(`/dashboard/orders/packing/${activeDate}/${productIds[0]}`, {
      state: { selectedProducts: productIds }
    });
  };

  const handleEndPacking = () => {
    if (activeDate) {
      clearActiveProducts.mutate(activeDate);
    }
  };

  const formattedDate = format(new Date(activeDate), 'dd. MMMM yyyy', { locale: nb });

  return (
    <Card className="border-2 border-orange-500 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-900">
                Pågående pakking
              </h3>
              <p className="text-sm text-orange-700">
                {formattedDate} • {activeProducts.length} {activeProducts.length === 1 ? 'produkt' : 'produkter'}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {activeProducts.map(p => p.product_name).join(', ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleEndPacking}
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
              disabled={clearActiveProducts.isPending}
            >
              <X className="mr-2 h-5 w-5" />
              Avslutt
            </Button>
            <Button 
              onClick={handleContinuePacking}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Package className="mr-2 h-5 w-5" />
              Fortsett pakking
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContinuePackingButton;
