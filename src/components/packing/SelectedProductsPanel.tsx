import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, X, Rocket, GripVertical, Plus } from 'lucide-react';

interface SelectedProduct {
  id: string;
  name: string;
  totalQuantity: number;
  customerCount: number;
  packedQuantity: number;
}

interface SelectedProductsPanelProps {
  selectedProducts: SelectedProduct[];
  onRemoveProduct: (productId: string) => void;
  onStartPacking: () => void;
  isLoading: boolean;
  maxProducts?: number;
}

const PRODUCT_COLORS = [
  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  { bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-500', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
];

const SelectedProductsPanel = ({
  selectedProducts,
  onRemoveProduct,
  onStartPacking,
  isLoading,
  maxProducts = 3
}: SelectedProductsPanelProps) => {
  const emptySlots = maxProducts - selectedProducts.length;

  return (
    <Card className="h-fit sticky top-6 shadow-lg border-2 border-primary/20 bg-gradient-to-b from-background to-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Valgte produkter</span>
          <Badge variant="secondary" className="font-mono">
            {selectedProducts.length}/{maxProducts}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Selected Products */}
        {selectedProducts.map((product, index) => {
          const colors = PRODUCT_COLORS[index];
          const progressPct = product.totalQuantity > 0 
            ? Math.round((product.packedQuantity / product.totalQuantity) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className={`
                relative p-3 rounded-lg border-l-4 transition-all
                ${colors.bg} ${colors.border}
              `}
            >
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-1.5 text-muted-foreground/50">
                  <GripVertical className="w-4 h-4" />
                  <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${colors.text}`}>
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{product.totalQuantity} stk</span>
                    <span>•</span>
                    <span>{product.customerCount} kunder</span>
                    {progressPct > 0 && (
                      <>
                        <span>•</span>
                        <span className={progressPct === 100 ? 'text-emerald-600 font-medium' : ''}>
                          {progressPct}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveProduct(product.id)}
                  className="p-1 rounded-md hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty Slots */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="p-3 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center gap-2 text-muted-foreground/50"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Velg produkt</span>
          </div>
        ))}

        {/* Start Button */}
        <Button
          onClick={onStartPacking}
          disabled={selectedProducts.length === 0 || isLoading}
          className="w-full mt-4 h-12 text-base font-semibold gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
        >
          <Rocket className="w-5 h-5" />
          Start pakking ({selectedProducts.length})
        </Button>

        {selectedProducts.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Velg produkter fra tabellen for å starte
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectedProductsPanel;
