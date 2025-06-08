
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Monitor, TrendingUp, Zap } from 'lucide-react';
import { Customer } from '@/types/database';

interface CustomersStatsProps {
  customers: Customer[];
}

const CustomersStats = ({ customers }: CustomersStatsProps) => {
  const activeCustomers = customers.filter(c => c.status === 'active');
  const totalCustomers = customers.length;
  const dedicatedDisplayCustomers = customers.filter(c => c.has_dedicated_display);
  const sharedDisplayCustomers = customers.filter(c => !c.has_dedicated_display);

  const statsCards = [
    {
      title: 'Totale kunder',
      value: totalCustomers,
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Aktive kunder',
      value: activeCustomers.length,
      icon: TrendingUp,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Felles display',
      value: sharedDisplayCustomers.length,
      icon: Monitor,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Private displays',
      value: dedicatedDisplayCustomers.length,
      icon: Zap,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((card, index) => (
        <Card key={index} className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.textColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CustomersStats;
