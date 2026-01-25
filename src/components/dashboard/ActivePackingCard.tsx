import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, ArrowRight, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActivePackingDate } from '@/hooks/useActivePackingDate';
import { useActivePackingProducts, useClearActivePackingProducts } from '@/hooks/useActivePackingProducts';
import { useDashboardRealTime } from '@/hooks/useDashboardRealTime';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const ActivePackingCard = () => {
  const navigate = useNavigate();
  
  useDashboardRealTime();
  
  const { data: activeDate, isLoading: dateLoading } = useActivePackingDate();
  const { data: activeProducts, isLoading: productsLoading } = useActivePackingProducts(activeDate || undefined);
  const clearActiveProducts = useClearActivePackingProducts();

  if (dateLoading || productsLoading || !activeDate || !activeProducts || activeProducts.length === 0) {
    return null;
  }

  const handleContinuePacking = () => {
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

  const formattedDate = format(new Date(activeDate), 'EEEE dd. MMMM', { locale: nb });
  const totalQuantity = activeProducts.reduce((sum, p) => sum + p.total_quantity, 0);

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary to-primary/60" />
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
      
      <CardContent className="relative p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Package className="h-7 w-7" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">Pågående pakking</h3>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                  <Clock className="w-3 h-3 mr-1" />
                  Aktiv
                </Badge>
              </div>
              <p className="text-muted-foreground capitalize">
                {formattedDate}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="font-medium">
                  {activeProducts.length} {activeProducts.length === 1 ? 'produkt' : 'produkter'}
                </Badge>
                <Badge variant="outline" className="font-medium">
                  {totalQuantity} enheter totalt
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button 
              onClick={handleEndPacking}
              variant="outline"
              size="lg"
              className="border-muted-foreground/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              disabled={clearActiveProducts.isPending}
            >
              {clearActiveProducts.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Avslutt
            </Button>
            <Button 
              onClick={handleContinuePacking}
              size="lg"
              className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
            >
              <Package className="mr-2 h-5 w-5" />
              Fortsett pakking
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Product list preview */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex flex-wrap gap-2">
            {activeProducts.slice(0, 5).map((product) => (
              <div 
                key={product.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/80 border text-sm"
              >
                <span className="font-medium">{product.product_name}</span>
                <span className="text-muted-foreground">×{product.total_quantity}</span>
              </div>
            ))}
            {activeProducts.length > 5 && (
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground">
                +{activeProducts.length - 5} til
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivePackingCard;
