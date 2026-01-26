import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  statusFilter: 'all' | 'pending' | 'in_progress' | 'completed';
  onStatusFilterChange: (status: 'all' | 'pending' | 'in_progress' | 'completed') => void;
  totalResults: number;
}

const ProductFilters = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategories,
  onCategoryToggle,
  statusFilter,
  onStatusFilterChange,
  totalResults
}: ProductFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const statusOptions = [
    { value: 'all' as const, label: 'Alle', count: null },
    { value: 'pending' as const, label: 'Ikke startet', count: null },
    { value: 'in_progress' as const, label: 'Pågår', count: null },
    { value: 'completed' as const, label: 'Ferdig', count: null },
  ];

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || statusFilter !== 'all';

  const clearAllFilters = () => {
    setLocalSearch('');
    onSearchChange('');
    selectedCategories.forEach(cat => onCategoryToggle(cat));
    onStatusFilterChange('all');
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
      {/* Search Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Søk etter produktnavn eller varenummer..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 bg-background"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                onSearchChange('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {totalResults} {totalResults === 1 ? 'produkt' : 'produkter'}
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Nullstill filter
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-muted-foreground mr-1" />
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilterChange(option.value)}
              className={`h-7 px-3 text-xs ${
                statusFilter === option.value 
                  ? '' 
                  : 'bg-background hover:bg-muted'
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Divider */}
        {categories.length > 0 && (
          <div className="w-px h-6 bg-border mx-1" />
        )}

        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.slice(0, 6).map((category) => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedCategories.includes(category)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              }`}
              onClick={() => onCategoryToggle(category)}
            >
              {category}
              {selectedCategories.includes(category) && (
                <X className="w-3 h-3 ml-1" />
              )}
            </Badge>
          ))}
          {categories.length > 6 && (
            <Badge variant="outline" className="bg-background">
              +{categories.length - 6} flere
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
