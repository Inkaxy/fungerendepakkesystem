
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
    <div className="flex items-center justify-between">
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {products.map((product) => {
          const progress = getProductProgress(product.id);
          return (
            <button
              key={product.id}
              onClick={() => onTabChange(product.id)}
              className={`px-4 py-3 rounded-md text-sm font-medium transition-colors relative ${
                activeTab === product.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="text-center">
                <div className="font-medium">{product.name}</div>
                <div className="text-xs mt-1 opacity-75">
                  {progress.packed}/{progress.total}
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
