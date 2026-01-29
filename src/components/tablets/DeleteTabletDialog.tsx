import React from 'react';
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
import { useTabletActions } from '@/hooks/useTabletActions';
import { Tablet } from '@/types/tablet';
import { Loader2 } from 'lucide-react';

interface DeleteTabletDialogProps {
  tablet: Tablet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteTabletDialog: React.FC<DeleteTabletDialogProps> = ({
  tablet,
  open,
  onOpenChange,
}) => {
  const { deleteTablet } = useTabletActions();

  const handleDelete = async () => {
    if (!tablet) return;
    await deleteTablet.mutateAsync(tablet.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Slett nettbrett</AlertDialogTitle>
          <AlertDialogDescription>
            Er du sikker på at du vil slette "{tablet?.name}"? 
            Denne handlingen kan ikke angres.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteTablet.isPending}
          >
            {deleteTablet.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Slett
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTabletDialog;
