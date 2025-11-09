
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, AlertTriangle, Trash2 } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { usePackingDeviations, usePackingDeviationsByDate } from '@/hooks/usePackingDeviations';
import { useDeletePackingSessions, useDeletePackingDataWithOrders } from '@/hooks/useDeletePackingData';
import DeviationOverview from '@/components/reports/DeviationOverview';
import DeviationDetails from '@/components/reports/DeviationDetails';
import DeletePackingDataDialog from '@/components/reports/DeletePackingDataDialog';

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const deleteSessionsMutation = useDeletePackingSessions();
  const deleteAllMutation = useDeletePackingDataWithOrders();

  const { data: deviationData, isLoading } = usePackingDeviations(
    dateRange.startDate,
    dateRange.endDate
  );

  const { data: dailyDeviations, isLoading: isDailyLoading } = usePackingDeviationsByDate(
    selectedDate || ''
  );

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  const handleBack = () => {
    setSelectedDate(null);
  };

  const handleDeleteConfirm = async (deleteType: 'sessions' | 'all') => {
    if (deleteType === 'sessions') {
      await deleteSessionsMutation.mutateAsync({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
    } else {
      await deleteAllMutation.mutateAsync({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Avviksrapporter</h1>
            <p className="text-muted-foreground">
              Oversikt over pakkeavvik og rapporter
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="text-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Laster avviksdata...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <AlertTriangle className="mr-3 h-8 w-8 text-destructive" />
            Avviksrapporter
          </h1>
          <p className="text-muted-foreground">
            Oversikt over pakkeavvik og detaljerte rapporter
          </p>
        </div>
        
        {!selectedDate && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Slett pakkedata</span>
          </Button>
        )}
      </div>

      {/* Date Range Filter */}
      {!selectedDate && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="grid grid-cols-2 gap-4 flex-1 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fra dato</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Til dato</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Viser data for {Math.ceil((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} dager
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {selectedDate ? (
        <DeviationDetails
          date={selectedDate}
          deviations={dailyDeviations || []}
          onBack={handleBack}
        />
      ) : (
        <DeviationOverview
          daysWithDeviations={deviationData?.daysWithDeviations || []}
          totalDeviations={deviationData?.totalDeviations || 0}
          daysWithDeviationsCount={deviationData?.daysWithDeviationsCount || 0}
          onSelectDate={handleSelectDate}
        />
      )}

      <DeletePackingDataDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteSessionsMutation.isPending || deleteAllMutation.isPending}
      />
    </div>
  );
};

export default Reports;
