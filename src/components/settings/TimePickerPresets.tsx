import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TimePickerPresetsProps {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
}

const PRESET_TIMES = [
  { value: '04:00', label: '04:00' },
  { value: '05:00', label: '05:00' },
  { value: '05:30', label: '05:30' },
  { value: '06:00', label: '06:00' },
  { value: '06:30', label: '06:30' },
  { value: '07:00', label: '07:00' },
];

const TimePickerPresets: React.FC<TimePickerPresetsProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const isPresetSelected = PRESET_TIMES.some(preset => preset.value === value);

  return (
    <div className="space-y-3">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {PRESET_TIMES.map((preset) => (
          <Button
            key={preset.value}
            type="button"
            variant={value === preset.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(preset.value)}
            disabled={disabled}
            className={cn(
              'min-w-[60px]',
              value === preset.value && 'ring-2 ring-primary ring-offset-2'
            )}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Custom time input */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">eller velg selv:</span>
        <Input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-32',
            !isPresetSelected && 'ring-2 ring-primary ring-offset-2'
          )}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Synkronisering kjører daglig på valgt tidspunkt
      </p>
    </div>
  );
};

export default TimePickerPresets;
