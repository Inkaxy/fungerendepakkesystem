
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

const ColorPicker = ({ label, value, onChange, description }: ColorPickerProps) => {
  const presetColors = [
    '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#111827',
    '#fee2e2', '#fecaca', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
    '#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03',
    '#dcfce7', '#bbf7d0', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d',
    '#dbeafe', '#bfdbfe', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
    '#e0e7ff', '#c7d2fe', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#3730a3',
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-12 h-8 p-0 border-2"
              style={{ backgroundColor: value }}
            >
              <span className="sr-only">Velg farge</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Egendefinert farge</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-8 p-0 border-0 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 h-8 text-xs"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Forhåndsdefinerte farger</Label>
                <div className="grid grid-cols-8 gap-1 mt-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => onChange(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <span className="text-sm text-gray-600 font-mono">{value}</span>
      </div>
    </div>
  );
};

export default ColorPicker;
