import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsSectionProps {
  value: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsSection = ({
  value,
  icon: Icon,
  iconColor,
  bgColor,
  title,
  description,
  children
}: SettingsSectionProps) => {
  return (
    <AccordionItem value={value} className="border rounded-lg bg-card shadow-sm overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", bgColor)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          <div className="text-left">
            <div className="font-semibold text-foreground">{title}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="pt-2 space-y-4">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SettingsSection;
