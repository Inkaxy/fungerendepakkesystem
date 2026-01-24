import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ToggleSettingProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSetting = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false
}: ToggleSettingProps) => {
  return (
    <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between gap-4">
      <div className="flex-1">
        <Label htmlFor={id} className="font-medium cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
};

export default ToggleSetting;
