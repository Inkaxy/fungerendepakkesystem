
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

const ColorPicker = ({ label, value, onChange, description }: ColorPickerProps) => {
  const presetColors = [
    // Grays and whites
    '#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#111827', '#000000',
    // Blues
    '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554',
    // Greens
    '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16',
    // Reds
    '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a',
    // Yellows/Oranges
    '#fef3c7', '#fde68a', '#fcd34d', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03', '#1c0a00',
    // Purples
    '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81', '#1e1b4b',
  ];

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-sm font-medium flex items-center gap-2">
          {label}
          <Badge variant="outline" className="text-xs">
            {value}
          </Badge>
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-16 h-10 p-0 border-2 rounded-md shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: value }}
            >
              <span className="sr-only">Velg farge for {label}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Egendefinert farge</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-16 h-10 p-0 border-2 cursor-pointer rounded"
                  />
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 h-10 text-sm font-mono"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Forhåndsdefinerte farger</Label>
                <div className="grid grid-cols-10 gap-2 mt-3">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      className="w-7 h-7 rounded border-2 hover:scale-110 transition-transform shadow-sm hover:shadow-md"
                      style={{ 
                        backgroundColor: color,
                        borderColor: value === color ? '#3b82f6' : '#d1d5db'
                      }}
                      onClick={() => onChange(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            Klikk på fargeknappen for å åpne fargevelger
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
