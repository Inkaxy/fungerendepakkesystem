
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, TrendingUp, Users } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { DayWithDeviations } from '@/hooks/usePackingDeviations';

interface DeviationOverviewProps {
  daysWithDeviations: DayWithDeviations[];
  totalDeviations: number;
  daysWithDeviationsCount: number;
  onSelectDate: (date: string) => void;
}

const DeviationOverview = ({
  daysWithDeviations,
  totalDeviations,
  daysWithDeviationsCount,
  onSelectDate
}: DeviationOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt antall avvik</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{totalDeviations}</div>
            <p className="text-xs text-muted-foreground">Siste 30 dager</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dager med avvik</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{daysWithDeviationsCount}</div>
            <p className="text-xs text-muted-foreground">Av {daysWithDeviations.length} totalt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gjennomsnittlig avviksprosent</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {daysWithDeviations.length > 0 
                ? Math.round(daysWithDeviations.reduce((sum, day) => sum + day.deviation_percentage, 0) / daysWithDeviations.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Per dag med aktivitet</p>
          </CardContent>
        </Card>
      </div>

      {/* Days List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Dager med pakkeaktivitet
          </CardTitle>
          <CardDescription>
            Klikk på en dag for å se detaljerte avviks-rapporter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {daysWithDeviations.map((day) => (
              <div
                key={day.date}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-muted/50 cursor-pointer ${
                  day.has_deviations ? 'border-destructive/20 bg-destructive/5' : 'border-muted'
                }`}
                onClick={() => onSelectDate(day.date)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {format(new Date(day.date), 'EEEE dd. MMMM yyyy', { locale: nb })}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {day.total_orders} ordre totalt
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {day.has_deviations ? (
                    <>
                      <Badge variant="destructive" className="flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{day.total_deviations} avvik</span>
                      </Badge>
                      <Badge variant="outline">
                        {day.deviation_percentage}% av ordre
                      </Badge>
                    </>
                  ) : (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <span>Ingen avvik</span>
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    Se detaljer →
                  </Button>
                </div>
              </div>
            ))}
            
            {daysWithDeviations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ingen pakkeaktivitet funnet for valgt periode</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviationOverview;
