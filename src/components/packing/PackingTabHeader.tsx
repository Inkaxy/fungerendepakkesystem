
import React from 'react';

interface ProductTabData {
  id: string;
  name: string;
  productNumber: string;
  category: string;
  items: any[];
}

interface PackingTabHeaderProps {
  products: ProductTabData[];
  activeTab: string;
  onTabChange: (productId: string) => void;
  getProductProgress: (productId: string) => { packed: number; total: number; percentage: number };
}

const PackingTabHeader = ({
  products,
  activeTab,
  onTabChange,
  getProductProgress
}: PackingTabHeaderProps) => {
  return (
    <div className="w-full">
      <div className="flex space-x-1 w-full">
        {products.map((product) => {
          const progress = getProductProgress(product.id);
          return (
            <button
              key={product.id}
              onClick={() => onTabChange(product.id)}
              className={`flex-1 px-6 py-4 rounded-lg text-base font-semibold transition-all duration-200 relative border-2 ${
                activeTab === product.id
                  ? 'bg-primary text-primary-foreground shadow-lg border-primary scale-105'
                  : 'bg-background text-foreground hover:bg-muted border-border hover:border-muted-foreground'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold text-lg">{product.name}</div>
                <div className="text-sm mt-2 opacity-90">
                  {progress.packed}/{progress.total} pakket
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {progress.percentage}% ferdig
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PackingTabHeader;
