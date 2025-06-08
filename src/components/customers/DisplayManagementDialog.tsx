
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Settings, Link, QrCode } from 'lucide-react';
import { Customer } from '@/types/database';
import { useDisplayStations } from '@/hooks/useDisplayStations';
import { useCustomerDisplayAssignment } from '@/hooks/useDisplayAssignments';
import AssignDisplayDialog from './AssignDisplayDialog';
import DisplaySettingsDialog from './DisplaySettingsDialog';

interface DisplayManagementDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DisplayManagementDialog = ({ customer, open, onOpenChange }: DisplayManagementDialogProps) => {
  const { data: displayStations } = useDisplayStations();
  const { data: assignment } = useCustomerDisplayAssignment(customer.id);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const assignedStation = displayStations?.find(station => 
    station.id === customer.assigned_display_station_id
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Display-administrasjon for {customer.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Nåværende tildeling */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nåværende Display-tildeling</CardTitle>
                <CardDescription>
                  Informasjon om kundens display-stasjon og innstillinger
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignedStation ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{assignedStation.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {assignedStation.description}
                        </p>
                        {assignedStation.location && (
                          <p className="text-sm text-muted-foreground">
                            Lokasjon: {assignedStation.location}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {assignedStation.is_shared && (
                          <Badge variant="secondary">Felles</Badge>
                        )}
                        <Badge variant={assignedStation.is_active ? "default" : "destructive"}>
                          {assignedStation.is_active ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </div>
                    </div>

                    {customer.display_url && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Link className="w-4 h-4" />
                            <span className="font-mono text-sm">
                              {customer.display_url}
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            <QrCode className="w-4 h-4 mr-1" />
                            QR-kode
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowSettingsDialog(true)}
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Display-innstillinger
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShowAssignDialog(true)}
                      >
                        Endre tildeling
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h4 className="font-medium mb-2">Ingen display tildelt</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Denne kunden har ikke fått tildelt en display-stasjon ennå.
                    </p>
                    <Button onClick={() => setShowAssignDialog(true)}>
                      Tildel Display
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tilgjengelige display-stasjoner */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tilgjengelige Display-stasjoner</CardTitle>
                <CardDescription>
                  Oversikt over alle display-stasjoner i bakeriet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {displayStations && displayStations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayStations.map((station) => (
                      <div 
                        key={station.id} 
                        className="p-3 border rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <h5 className="font-medium">{station.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            {station.location || 'Ingen lokasjon'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {station.is_shared && (
                            <Badge variant="secondary" className="text-xs">Felles</Badge>
                          )}
                          <Badge 
                            variant={station.is_active ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {station.is_active ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Ingen display-stasjoner funnet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <AssignDisplayDialog
        customer={customer}
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
      />

      <DisplaySettingsDialog
        customer={customer}
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
      />
    </>
  );
};

export default DisplayManagementDialog;
