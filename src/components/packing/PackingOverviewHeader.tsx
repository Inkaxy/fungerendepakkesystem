import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Package, TrendingUp, CheckCircle, FileText, Wifi } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface PackingOverviewHeaderProps {
  date: string;
  totalProducts: number;
  totalUnits: number;
  completedProducts: number;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  onBack: () => void;
  onGenerateReport: () => void;
}

const PackingOverviewHeader = ({
  date,
  totalProducts,
  totalUnits,
  completedProducts,
  connectionStatus,
  onBack,
  onGenerateReport
}: PackingOverviewHeaderProps) => {
  const progressPercentage = totalProducts > 0 
    ? Math.round((completedProducts / totalProducts) * 100) 
    : 0;

  return (
    <div className="flex-shrink-0 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/10 border-b">
      <div className="p-6">
        {/* Top row with back button and actions */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tilbake til ordrer</span>
          </Button>
          
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
              ${connectionStatus === 'connected' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : connectionStatus === 'connecting'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }
            `}>
              <Wifi className={`w-3.5 h-3.5 ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`} />
              <span>{connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Kobler til...' : 'Frakoblet'}</span>
            </div>
            
            <Button 
              onClick={onGenerateReport}
              variant="outline"
              className="flex items-center gap-2 bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <FileText className="w-4 h-4" />
              <span>Generer rapport</span>
            </Button>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Pakking for {format(new Date(date), 'dd. MMMM yyyy', { locale: nb })}
          </h1>
          <p className="text-muted-foreground mt-1">
            Velg opptil 3 produkter for parallell pakking
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Products */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Produkter totalt</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Units */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/20">
                  <TrendingUp className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalUnits}</p>
                  <p className="text-sm text-muted-foreground">Enheter å pakke</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${progressPercentage === 100 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-muted'}`}>
                  <CheckCircle className={`w-6 h-6 ${progressPercentage === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-foreground">{completedProducts}/{totalProducts}</p>
                    <span className={`text-sm font-medium ${progressPercentage === 100 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      ({progressPercentage}%)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Ferdig pakket</p>
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PackingOverviewHeader;
