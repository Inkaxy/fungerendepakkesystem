import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { usePackingDeviations, usePackingDeviationsByDate } from '@/hooks/usePackingDeviations';
import { useDeletePackingSessions, useDeletePackingDataWithOrders } from '@/hooks/useDeletePackingData';
import DeviationOverview from '@/components/reports/DeviationOverview';
import DeviationDetails from '@/components/reports/DeviationDetails';
import DeletePackingDataDialog from '@/components/reports/DeletePackingDataDialog';
import PageHeader from '@/components/shared/PageHeader';
import LoadingState from '@/components/shared/LoadingState';

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

  const { data: dailyDeviations } = usePackingDeviationsByDate(
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

  // Calculate days in range
  const daysInRange = Math.ceil(
    (new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          icon={AlertTriangle}
          title="Avviksrapporter"
          subtitle="Oversikt over pakkeavvik og rapporter"
        />
        <LoadingState message="Laster avviksdata..." icon={AlertTriangle} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={AlertTriangle}
        title="Avviksrapporter"
        subtitle="Oversikt over pakkeavvik og detaljerte rapporter"
        actions={
          !selectedDate && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Slett pakkedata
            </Button>
          )
        }
      />

      {/* Stats */}
      {!selectedDate && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Totale avvik</p>
                <p className="text-2xl font-bold text-foreground">
                  {deviationData?.totalDeviations || 0}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-destructive/15">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dager med avvik</p>
                <p className="text-2xl font-bold text-foreground">
                  {deviationData?.daysWithDeviationsCount || 0}
                </p>
              </div>
              <div className="stat-card-icon">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Periode</p>
                <p className="text-2xl font-bold text-foreground">{daysInRange} dager</p>
              </div>
              <div className="stat-card-icon">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Range Filter */}
      {!selectedDate && (
        <Card className="card-warm">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="grid grid-cols-2 gap-4 flex-1 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">Fra dato</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">Til dato</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  />
                </div>
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
