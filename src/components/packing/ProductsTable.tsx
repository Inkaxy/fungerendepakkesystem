import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Package, ArrowUp, ArrowDown, ArrowUpDown, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import ProductFilters from './ProductFilters';
import KeyboardShortcutsHint from './KeyboardShortcutsHint';

interface Product {
  id: string;
  name: string;
  productNumber: string;
  category: string;
  totalQuantity: number;
  customers: Set<string>;
  packedQuantity: number;
}

interface ProductsTableProps {
  products: Product[];
  selectedProducts: string[];
  onProductSelection: (productId: string, checked: boolean) => void;
  onProductActivate?: (productId: string) => void;
}

type SortField = 'name' | 'category' | 'totalQuantity' | 'customers' | 'progress';
type SortDirection = 'asc' | 'desc';

const PRODUCT_COLORS = [
  { border: 'border-l-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { border: 'border-l-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { border: 'border-l-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
];

const ProductsTable = ({ 
  products, 
  selectedProducts, 
  onProductSelection,
  onProductActivate
}: ProductsTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category || 'Ingen kategori'));
    return Array.from(cats).sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(query) ||
          product.productNumber?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const productCategory = product.category || 'Ingen kategori';
        if (!selectedCategories.includes(productCategory)) return false;
      }

      // Status filter
      const progressPct = (product.packedQuantity / product.totalQuantity) * 100;
      if (statusFilter === 'pending' && progressPct > 0) return false;
      if (statusFilter === 'in_progress' && (progressPct === 0 || progressPct === 100)) return false;
      if (statusFilter === 'completed' && progressPct < 100) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategories, statusFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-primary" /> : 
      <ArrowDown className="w-4 h-4 text-primary" />;
  };

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'totalQuantity':
          aValue = a.totalQuantity;
          bValue = b.totalQuantity;
          break;
        case 'customers':
          aValue = a.customers.size;
          bValue = b.customers.size;
          break;
        case 'progress':
          aValue = (a.packedQuantity / a.totalQuantity) * 100;
          bValue = (b.packedQuantity / b.totalQuantity) * 100;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortField, sortDirection]);

  // Group by category
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    sortedProducts.forEach(product => {
      const category = product.category || 'Ingen kategori';
      if (!groups[category]) groups[category] = [];
      groups[category].push(product);
    });
    return groups;
  }, [sortedProducts]);

  const getProgressColor = (packed: number, total: number) => {
    const percentage = (packed / total) * 100;
    if (percentage === 100) return 'from-emerald-400 to-emerald-500';
    if (percentage > 50) return 'from-amber-400 to-emerald-400';
    if (percentage > 0) return 'from-orange-400 to-amber-400';
    return 'from-muted to-muted';
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (sortedProducts.length === 0) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setFocusedRowIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedRowIndex(prev => Math.min(sortedProducts.length - 1, prev + 1));
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedRowIndex >= 0) {
          const product = sortedProducts[focusedRowIndex];
          const isSelected = selectedProducts.includes(product.id);
          const canSelect = selectedProducts.length < 3 || isSelected;
          if (canSelect) {
            onProductSelection(product.id, !isSelected);
          }
        }
        break;
      case 'Tab':
        event.preventDefault();
        if (selectedProducts.length > 0) {
          const currentIndex = selectedProducts.findIndex(id => id === sortedProducts[focusedRowIndex]?.id);
          const nextIndex = (currentIndex + 1) % selectedProducts.length;
          const nextProductId = selectedProducts[nextIndex];
          const nextRowIndex = sortedProducts.findIndex(p => p.id === nextProductId);
          if (nextRowIndex >= 0) {
            setFocusedRowIndex(nextRowIndex);
          }
        }
        break;
    }
  };

  const handleRowClick = (product: Product, globalIndex: number) => {
    setFocusedRowIndex(globalIndex);
    const isSelected = selectedProducts.includes(product.id);
    const canSelect = selectedProducts.length < 3 || isSelected;
    if (canSelect) {
      onProductSelection(product.id, !isSelected);
    }
  };

  const handleRowDoubleClick = (product: Product) => {
    const isSelected = selectedProducts.includes(product.id);
    if (!isSelected && selectedProducts.length < 3) {
      onProductSelection(product.id, true);
    }
    if (onProductActivate) {
      onProductActivate(product.id);
    }
  };

  useEffect(() => {
    if (sortedProducts.length > 0 && focusedRowIndex === -1) {
      setFocusedRowIndex(0);
    }
  }, [sortedProducts.length, focusedRowIndex]);

  useEffect(() => {
    if (scrollContainerRef.current && focusedRowIndex >= 0) {
      const row = scrollContainerRef.current.querySelector(`[data-row-index="${focusedRowIndex}"]`) as HTMLElement;
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedRowIndex]);

  // Calculate global row index
  let globalRowIndex = 0;

  return (
    <div className="h-full flex flex-col">
      {/* Filters */}
      <div className="flex-shrink-0 p-4">
        <div className="flex items-center justify-between mb-4">
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            totalResults={sortedProducts.length}
          />
          <KeyboardShortcutsHint />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 px-4 pb-4">
        {sortedProducts.length > 0 ? (
          <div 
            ref={scrollContainerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="h-full overflow-auto outline-none border rounded-lg bg-background"
          >
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow className="hover:bg-transparent border-b-2">
                  <TableHead className="w-12">Velg</TableHead>
                  <TableHead className="w-[280px]">
                    <button
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <span>Produktnavn</span>
                      {getSortIcon('name')}
                    </button>
                  </TableHead>
                  <TableHead className="w-24">Vnr.</TableHead>
                  <TableHead className="w-32">
                    <button
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      onClick={() => handleSort('category')}
                    >
                      <span>Kategori</span>
                      {getSortIcon('category')}
                    </button>
                  </TableHead>
                  <TableHead className="w-24">
                    <button
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      onClick={() => handleSort('totalQuantity')}
                    >
                      <span>Antall</span>
                      {getSortIcon('totalQuantity')}
                    </button>
                  </TableHead>
                  <TableHead className="w-24">
                    <button
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      onClick={() => handleSort('customers')}
                    >
                      <span>Kunder</span>
                      {getSortIcon('customers')}
                    </button>
                  </TableHead>
                  <TableHead className="w-40">
                    <button
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      onClick={() => handleSort('progress')}
                    >
                      <span>Fremgang</span>
                      {getSortIcon('progress')}
                    </button>
                  </TableHead>
                  <TableHead className="w-24">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedProducts).map(([category, categoryProducts]) => {
                  const isCollapsed = collapsedCategories.has(category);
                  const categoryStartIndex = globalRowIndex;
                  
                  return (
                    <React.Fragment key={category}>
                      {/* Category Header */}
                      <TableRow 
                        className="bg-muted/50 hover:bg-muted/70 cursor-pointer"
                        onClick={() => toggleCategoryCollapse(category)}
                      >
                        <TableCell colSpan={8} className="py-2">
                          <div className="flex items-center gap-2 font-medium text-sm">
                            {isCollapsed ? (
                              <ChevronRight className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                            <span>{category}</span>
                            <Badge variant="secondary" className="ml-2 font-mono text-xs">
                              {categoryProducts.length}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {/* Category Products */}
                      {!isCollapsed && categoryProducts.map((product) => {
                        const currentIndex = globalRowIndex++;
                        const isSelected = selectedProducts.includes(product.id);
                        const selectedIndex = selectedProducts.indexOf(product.id);
                        const canSelect = selectedProducts.length < 3 || isSelected;
                        const progressPercentage = (product.packedQuantity / product.totalQuantity) * 100;
                        const isFocused = currentIndex === focusedRowIndex;
                        const colors = selectedIndex >= 0 ? PRODUCT_COLORS[selectedIndex] : null;

                        return (
                          <TableRow 
                            key={product.id}
                            data-row-index={currentIndex}
                            className={`
                              cursor-pointer transition-all duration-150
                              ${isSelected ? `${colors?.bg} border-l-4 ${colors?.border}` : 'border-l-4 border-l-transparent'} 
                              ${isFocused ? 'ring-2 ring-inset ring-primary/50 bg-accent/50' : ''}
                              ${!canSelect && !isSelected ? 'opacity-50' : ''}
                              hover:bg-accent/30
                            `}
                            onClick={() => handleRowClick(product, currentIndex)}
                            onDoubleClick={() => handleRowDoubleClick(product)}
                          >
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => onProductSelection(product.id, checked as boolean)}
                                disabled={!canSelect}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{product.name}</span>
                                {isSelected && onProductActivate && (
                                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground font-mono text-sm">
                              {product.productNumber || '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs font-normal">
                                {product.category || 'Ingen kategori'}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {product.totalQuantity} stk
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {product.customers.size}
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(product.packedQuantity, product.totalQuantity)} transition-all duration-500`}
                                          style={{ width: `${progressPercentage}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-medium w-10 text-right">
                                        {Math.round(progressPercentage)}%
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{product.packedQuantity} av {product.totalQuantity} enheter pakket</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={progressPercentage === 100 ? "default" : progressPercentage > 0 ? "secondary" : "outline"}
                                className={progressPercentage === 100 ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                              >
                                {progressPercentage === 100 ? "Ferdig" : progressPercentage > 0 ? "Pågår" : "Venter"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed">
            <div className="text-center p-8">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">Ingen produkter funnet</h3>
              <p className="text-muted-foreground max-w-sm">
                {searchQuery || selectedCategories.length > 0 || statusFilter !== 'all'
                  ? 'Prøv å justere søk eller filter for å se flere produkter'
                  : 'Det er ingen produkter å pakke for denne dagen'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTable;
