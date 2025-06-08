
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Monitor } from 'lucide-react';
import { Customer } from '@/types/database';

interface CustomersStatsProps {
  customers: Customer[];
}

const CustomersStats = ({ customers }: CustomersStatsProps) => {
  const activeCustomers = customers.filter(c => c.status === 'active');
  const totalCustomers = customers.length;
  const dedicatedDisplayCustomers = customers.filter(c => c.has_dedicated_display);
  const sharedDisplayCustomers = customers.filter(c => !c.has_dedicated_display);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">
            Totale kunder
          </CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{totalCustomers}</div>
          <p className="text-xs text-blue-600">
            Registrerte kunder
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900">
            Aktive kunder
          </CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{activeCustomers.length}</div>
          <p className="text-xs text-green-600">
            {totalCustomers > 0 ? Math.round((activeCustomers.length / totalCustomers) * 100) : 0}% av totale
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-900">
            Felles display
          </CardTitle>
          <Monitor className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{sharedDisplayCustomers.length}</div>
          <p className="text-xs text-purple-600">
            Kunder på hovedvisning
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-indigo-900">
            Private displays
          </CardTitle>
          <Monitor className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-900">{dedicatedDisplayCustomers.length}</div>
          <p className="text-xs text-indigo-600">
            Eksklusive visninger
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersStats;
