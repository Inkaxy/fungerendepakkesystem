import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tablet, Wifi, WifiOff, Store } from 'lucide-react';
import { Tablet as TabletType } from '@/types/tablet';

interface TabletsStatsProps {
  tablets: TabletType[];
}

const TabletsStats: React.FC<TabletsStatsProps> = ({ tablets }) => {
  const total = tablets.length;
  const online = tablets.filter(t => t.status === 'online').length;
  const offline = tablets.filter(t => t.status === 'offline').length;
  const unassigned = tablets.filter(t => !t.customer_id).length;

  const stats = [
    {
      label: 'Totalt',
      value: total,
      icon: Tablet,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Online',
      value: online,
      icon: Wifi,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      label: 'Offline',
      value: offline,
      icon: WifiOff,
      color: 'text-slate-500',
      bgColor: 'bg-slate-100'
    },
    {
      label: 'Uten butikk',
      value: unassigned,
      icon: Store,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="card-warm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TabletsStats;
