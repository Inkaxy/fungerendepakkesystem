
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface PackingProductHeaderProps {
  productName: string;
  productNumber: string;
  date: string;
  currentIndex: number;
  totalProducts: number;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoBack: boolean;
  isLastProduct: boolean;
}

const PackingProductHeader = ({
  productName,
  productNumber,
  date,
  currentIndex,
  totalProducts,
  onBack,
  onPrevious,
  onNext,
  canGoBack,
  isLastProduct
}: PackingProductHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tilbake til oversikt
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {productName}
            {productNumber && (
              <span className="ml-2 text-lg text-muted-foreground">
                ({productNumber})
              </span>
            )}
          </h1>
          <p className="text-muted-foreground">
            {format(new Date(date), 'dd. MMMM yyyy', { locale: nb })} • 
            Produkt {currentIndex + 1} av {totalProducts}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={!canGoBack}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={onNext}>
          {isLastProduct ? (
            <>
              Ferdig <Check className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Neste <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PackingProductHeader;
