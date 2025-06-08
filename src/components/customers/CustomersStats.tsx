
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
      subtitle: 'Registrerte kunder',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-600',
      emoji: '🏪'
    },
    {
      title: 'Aktive kunder',
      value: activeCustomers.length,
      subtitle: `${totalCustomers > 0 ? Math.round((activeCustomers.length / totalCustomers) * 100) : 0}% av totale`,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-900',
      iconColor: 'text-emerald-600',
      emoji: '📈'
    },
    {
      title: 'Felles display',
      value: sharedDisplayCustomers.length,
      subtitle: 'Kunder på hovedvisning',
      icon: Monitor,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-900',
      iconColor: 'text-purple-600',
      emoji: '📺'
    },
    {
      title: 'Private displays',
      value: dedicatedDisplayCustomers.length,
      subtitle: 'Eksklusive visninger',
      icon: Zap,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-900',
      iconColor: 'text-amber-600',
      emoji: '⚡'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => (
        <Card 
          key={index}
          className={`
            relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg
            bg-gradient-to-br ${card.bgGradient} ${card.borderColor} border-2
            group cursor-pointer
          `}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className={`text-sm font-semibold ${card.textColor} flex items-center space-x-2`}>
                <span className="text-lg">{card.emoji}</span>
                <span>{card.title}</span>
              </CardTitle>
            </div>
            <div className={`p-2 rounded-lg bg-white/70 ${card.iconColor} group-hover:scale-110 transition-transform duration-200`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-1">
            <div className={`text-3xl font-bold ${card.textColor} tracking-tight`}>
              {card.value}
            </div>
            <p className={`text-xs ${card.iconColor} font-medium`}>
              {card.subtitle}
            </p>
            
            {/* Progress bar */}
            <div className="mt-3 w-full bg-white/50 rounded-full h-1.5">
              <div 
                className={`bg-gradient-to-r ${card.gradient} h-1.5 rounded-full transition-all duration-1000 delay-200`}
                style={{ 
                  width: card.title === 'Aktive kunder' && totalCustomers > 0 
                    ? `${(activeCustomers.length / totalCustomers) * 100}%`
                    : card.value > 0 ? '100%' : '0%'
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CustomersStats;
