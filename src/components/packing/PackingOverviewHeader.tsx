import React from 'react';
import { Button } from '@/components/ui/button';
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
    <div className="flex-shrink-0 border-b bg-muted/30">
      <div className="px-4 py-3">
        {/* Single row with all elements */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Back button + Title */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Tilbake</span>
            </Button>
            
            <div className="h-6 w-px bg-border" />
            
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {format(new Date(date), 'dd. MMMM yyyy', { locale: nb })}
              </h1>
            </div>
          </div>

          {/* Center: Compact Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{totalProducts}</span>
              <span className="text-muted-foreground">produkter</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{totalUnits}</span>
              <span className="text-muted-foreground">enheter</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className={`w-4 h-4 ${progressPercentage === 100 ? 'text-emerald-500' : 'text-muted-foreground'}`} />
              <span className="font-medium">{completedProducts}/{totalProducts}</span>
              <span className={`${progressPercentage === 100 ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}`}>
                ({progressPercentage}%)
              </span>
            </div>
          </div>

          {/* Right: Status + Actions */}
          <div className="flex items-center gap-2">
            <div className={`
              flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
              ${connectionStatus === 'connected' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : connectionStatus === 'connecting'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }
            `}>
              <Wifi className={`w-3 h-3 ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">{connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Kobler til...' : 'Frakoblet'}</span>
            </div>
            
            <Button 
              onClick={onGenerateReport}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rapport</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackingOverviewHeader;
