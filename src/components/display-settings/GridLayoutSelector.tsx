import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Grid3X3, Wand2 } from 'lucide-react';
import SliderControl from './SliderControl';
import type { DisplaySettings } from '@/hooks/useDisplaySettings';

interface GridLayoutSelectorProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
  customerCount?: number;
}

const GridLayoutSelector = ({ settings, onUpdate, customerCount = 0 }: GridLayoutSelectorProps) => {
  const rows = settings.grid_fixed_rows ?? 3;
  const columns = settings.grid_fixed_columns ?? 4;
  const capacity = rows * columns;
  const overflow = Math.max(0, customerCount - capacity);
  const isFixed = settings.grid_layout_mode === 'fixed';

  return (
    <div className="space-y-4">
      <RadioGroup
        value={settings.grid_layout_mode ?? 'auto'}
        onValueChange={(value) => onUpdate({ grid_layout_mode: value as 'auto' | 'fixed' })}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem
            value="auto"
            id="layout-auto"
            className="peer sr-only"
          />
          <Label
            htmlFor="layout-auto"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <Wand2 className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Automatisk</span>
            <span className="text-xs text-muted-foreground text-center mt-1">
              Systemet beregner optimal layout
            </span>
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="fixed"
            id="layout-fixed"
            className="peer sr-only"
          />
          <Label
            htmlFor="layout-fixed"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <Grid3X3 className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Fast rutenett</span>
            <span className="text-xs text-muted-foreground text-center mt-1">
              Du bestemmer rader og kolonner
            </span>
          </Label>
        </div>
      </RadioGroup>

      {isFixed && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <SliderControl
              label="Kolonner"
              value={columns}
              onChange={(v) => onUpdate({ grid_fixed_columns: v })}
              min={1}
              max={6}
              step={1}
              description="Antall kolonner i rutenettet"
            />
            <SliderControl
              label="Rader"
              value={rows}
              onChange={(v) => onUpdate({ grid_fixed_rows: v })}
              min={1}
              max={6}
              step={1}
              description="Antall rader i rutenettet"
            />
          </div>
          
          {/* Grid Preview */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Forhåndsvisning</Label>
            <div 
              className="aspect-video border rounded-lg p-2 bg-muted/30"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: '4px'
              }}
            >
              {Array.from({ length: capacity }, (_, i) => (
                <div 
                  key={i}
                  className={`rounded border-2 flex items-center justify-center text-xs font-medium transition-colors ${
                    i < customerCount 
                      ? "bg-primary/20 border-primary/40 text-primary" 
                      : "bg-muted border-dashed border-muted-foreground/30 text-muted-foreground/50"
                  }`}
                >
                  {i < customerCount ? i + 1 : ''}
                </div>
              ))}
            </div>
          </div>
          
          {/* Capacity info */}
          <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">
              Kapasitet: <span className="font-medium text-foreground">{capacity} kunder</span>
            </span>
            {customerCount > 0 && (
              <span className="text-muted-foreground">
                Aktive: <span className="font-medium text-foreground">{customerCount}</span>
              </span>
            )}
          </div>
          
          {/* Overflow warning */}
          {overflow > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-600">
                  {overflow} {overflow === 1 ? 'kunde' : 'kunder'} får ikke plass
                </p>
                <p className="text-amber-600/80 text-xs">
                  Øk antall rader eller kolonner for å vise alle
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GridLayoutSelector;
