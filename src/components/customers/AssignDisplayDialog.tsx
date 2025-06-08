
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Loader2 } from 'lucide-react';
import { Customer } from '@/types/database';
import { useDisplayStations } from '@/hooks/useDisplayStations';
import { useCreateDisplayAssignment } from '@/hooks/useDisplayAssignments';

interface AssignDisplayDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssignDisplayDialog = ({ customer, open, onOpenChange }: AssignDisplayDialogProps) => {
  const { data: displayStations } = useDisplayStations();
  const createAssignment = useCreateDisplayAssignment();
  const [selectedStationId, setSelectedStationId] = useState<string>('');

  const handleAssign = async () => {
    if (!selectedStationId) return;

    try {
      await createAssignment.mutateAsync({
        customer_id: customer.id,
        display_station_id: selectedStationId,
        is_active: true,
      });
      onOpenChange(false);
      setSelectedStationId('');
    } catch (error) {
      console.error('Failed to assign display:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Tildel Display til {customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Label>Velg display-stasjon:</Label>
          
          {displayStations && displayStations.length > 0 ? (
            <RadioGroup 
              value={selectedStationId} 
              onValueChange={setSelectedStationId}
            >
              {displayStations
                .filter(station => station.is_active)
                .map((station) => (
                <div key={station.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={station.id} id={station.id} />
                  <Label htmlFor={station.id} className="flex-1 cursor-pointer">
                    <Card className="p-3">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{station.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {station.description}
                            </p>
                            {station.location && (
                              <p className="text-xs text-muted-foreground">
                                {station.location}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            {station.is_shared && (
                              <Badge variant="secondary" className="text-xs">
                                Felles
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="text-center py-6">
              <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Ingen aktive display-stasjoner tilgjengelig
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={!selectedStationId || createAssignment.isPending}
          >
            {createAssignment.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Tildel Display
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDisplayDialog;
