import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { PackingSession } from '@/types/database';

interface ActiveSessionConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSession: PackingSession | null;
  newSessionDate: string;
  onCancel: () => void;
  onContinueExisting: () => void;
  onStartNew: () => void;
  isLoading?: boolean;
}

const ActiveSessionConfirmDialog = ({
  open,
  onOpenChange,
  activeSession,
  newSessionDate,
  onCancel,
  onContinueExisting,
  onStartNew,
  isLoading = false
}: ActiveSessionConfirmDialogProps) => {
  if (!activeSession) return null;

  const activeDate = new Date(activeSession.session_date);
  const newDate = new Date(newSessionDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>Aktiv pakkeøkt funnet</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Det er allerede en aktiv pakkeøkt i gang. Du kan kun ha én aktiv pakkeøkt om gangen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Active session info */}
          <div className="p-4 rounded-lg border bg-amber-50 border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-900">Aktiv pakkeøkt</span>
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                {activeSession.status === 'in_progress' ? 'Pågår' : 'Klar'}
              </Badge>
            </div>
            <p className="text-sm text-amber-800">
              {format(activeDate, 'dd. MMMM yyyy', { locale: nb })}
            </p>
            <div className="text-xs text-amber-700 mt-1">
              {activeSession.total_orders} ordrer • {activeSession.unique_customers} kunder
            </div>
          </div>

          {/* New session info */}
          <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Ny pakkeøkt</span>
            </div>
            <p className="text-sm text-blue-800">
              {format(newDate, 'dd. MMMM yyyy', { locale: nb })}
            </p>
          </div>

          {/* Arrow between */}
          <div className="flex justify-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isLoading}
            >
              Avbryt
            </Button>
            <Button
              variant="secondary"
              onClick={onContinueExisting}
              className="flex-1"
              disabled={isLoading}
            >
              Fortsett eksisterende
            </Button>
          </div>
          <Button
            onClick={onStartNew}
            className="w-full"
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? 'Starter...' : 'Start ny (avslutter eksisterende)'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActiveSessionConfirmDialog;