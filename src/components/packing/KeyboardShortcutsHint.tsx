import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';

const shortcuts = [
  { keys: ['↑', '↓'], description: 'Naviger mellom rader' },
  { keys: ['Enter'], description: 'Velg/avvelg produkt' },
  { keys: ['Tab'], description: 'Hopp til neste valgte' },
  { keys: ['Dobbeltklikk'], description: 'Gå direkte til pakking' },
];

const KeyboardShortcutsHint = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground gap-2"
        >
          <Keyboard className="w-4 h-4" />
          <span className="hidden sm:inline">Hurtigtaster</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Hurtigtaster</h4>
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, i) => (
                    <React.Fragment key={i}>
                      <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
                        {key}
                      </kbd>
                      {i < shortcut.keys.length - 1 && (
                        <span className="text-muted-foreground text-xs">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default KeyboardShortcutsHint;
