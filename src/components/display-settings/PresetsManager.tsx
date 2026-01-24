import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sparkles, ChevronDown, Plus, Trash2, Loader2 } from 'lucide-react';
import { useDisplayPresets, useDeletePreset, systemPresets } from '@/hooks/useDisplayPresets';
import type { DisplaySettings } from '@/hooks/useDisplaySettings';

interface PresetsManagerProps {
  onApplyPreset: (settings: Partial<DisplaySettings>) => void;
  onOpenSaveDialog: () => void;
}

const PresetsManager = ({ onApplyPreset, onOpenSaveDialog }: PresetsManagerProps) => {
  const { data: userPresets = [], isLoading } = useDisplayPresets();
  const deletePreset = useDeletePreset();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [presetToDelete, setPresetToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, presetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPresetToDelete(presetId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (presetToDelete) {
      await deletePreset.mutateAsync(presetToDelete);
      setDeleteDialogOpen(false);
      setPresetToDelete(null);
    }
  };

  const getPresetTypeIcon = (type: string) => {
    switch (type) {
      case 'colors': return '🎨';
      case 'layout': return '📐';
      case 'typography': return '🔤';
      default: return '📋';
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Maler
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          {/* User presets */}
          <DropdownMenuLabel className="flex items-center gap-2">
            <span>Mine maler</span>
            {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {userPresets.length === 0 ? (
              <DropdownMenuItem disabled className="text-muted-foreground">
                Ingen lagrede maler ennå
              </DropdownMenuItem>
            ) : (
              userPresets.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => onApplyPreset(preset.settings)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-base">
                      {getPresetTypeIcon(preset.preset_type || 'complete')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{preset.name}</p>
                      {preset.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {preset.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDeleteClick(e, preset.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* System presets */}
          <DropdownMenuLabel>Systemtemaer</DropdownMenuLabel>
          <DropdownMenuGroup>
            {systemPresets.map((preset) => (
              <DropdownMenuItem
                key={preset.id}
                className="cursor-pointer"
                onClick={() => onApplyPreset(preset.settings)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{preset.icon}</span>
                  <div>
                    <p className="font-medium">{preset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {preset.description}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Save new preset */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={onOpenSaveDialog}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Lagre nåværende som mal</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Slett mal</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på at du vil slette denne malen? Denne handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePreset.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sletter...
                </>
              ) : (
                'Slett'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PresetsManager;
