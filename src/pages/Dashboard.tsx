
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: "Dagens ordrer",
      value: "47",
      change: "+12%",
      changeType: "positive",
      icon: Package,
      description: "Fra i går"
    },
    {
      title: "Pakket i dag",
      value: "34",
      change: "+8%",
      changeType: "positive", 
      icon: CheckCircle,
      description: "72% ferdig"
    },
    {
      title: "Aktive leveranser",
      value: "12",
      change: "-3",
      changeType: "neutral",
      icon: Truck,
      description: "På vei til kunder"
    },
    {
      title: "Gjennomsnittlig pakketid",
      value: "1.8 min",
      change: "-15%",
      changeType: "positive",
      icon: Clock,
      description: "Bedre enn målet"
    }
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Bakeri Sentralen", status: "packed", time: "08:30", items: 12 },
    { id: "ORD-002", customer: "Konditori Nord", status: "in_progress", time: "09:15", items: 8 },
    { id: "ORD-003", customer: "Bakehouse AS", status: "pending", time: "10:00", items: 15 },
    { id: "ORD-004", customer: "Brød & Mer", status: "packed", time: "10:30", items: 6 },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      packed: { label: "Pakket", variant: "default" as const, className: "bg-green-100 text-green-800" },
      in_progress: { label: "Pakkes", variant: "secondary" as const, className: "bg-bakery-orange/20 text-bakery-orange" },
      pending: { label: "Venter", variant: "outline" as const, className: "bg-gray-100 text-gray-600" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-bakery-brown">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Velkommen tilbake! Her er oversikten for i dag.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-bakery-orange text-bakery-orange hover:bg-bakery-orange hover:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Rapporter
              </Button>
              <Button className="bg-bakery-orange hover:bg-bakery-orange-light">
                <Package className="h-4 w-4 mr-2" />
                Ny ordre
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-bakery-orange/10">
                    <stat.icon className="h-5 w-5 text-bakery-orange" />
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-bakery-brown mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {stat.title}
                </div>
                <div className="text-xs text-gray-500">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-bakery-brown flex items-center">
                <Package className="h-5 w-5 mr-2 text-bakery-orange" />
                Dagens ordrer
              </CardTitle>
              <CardDescription>
                Siste oppdateringer fra pakking og levering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-bakery-orange/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-bakery-orange" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">{order.customer}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{order.items} produkter</div>
                        <div className="text-xs text-gray-500">{order.time}</div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full border-bakery-orange text-bakery-orange hover:bg-bakery-orange hover:text-white">
                  Se alle ordrer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-bakery-brown flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-bakery-orange" />
                Hurtighandlinger
              </CardTitle>
              <CardDescription>
                De mest brukte funksjonene
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2 border-bakery-orange/20 hover:border-bakery-orange hover:bg-bakery-orange/5">
                  <Package className="h-6 w-6 text-bakery-orange" />
                  <span className="text-sm font-medium">Start pakking</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 border-bakery-orange/20 hover:border-bakery-orange hover:bg-bakery-orange/5">
                  <Users className="h-6 w-6 text-bakery-orange" />
                  <span className="text-sm font-medium">Administrer kunder</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 border-bakery-orange/20 hover:border-bakery-orange hover:bg-bakery-orange/5">
                  <Truck className="h-6 w-6 text-bakery-orange" />
                  <span className="text-sm font-medium">Spor leveranser</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 border-bakery-orange/20 hover:border-bakery-orange hover:bg-bakery-orange/5">
                  <BarChart3 className="h-6 w-6 text-bakery-orange" />
                  <span className="text-sm font-medium">Se rapporter</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Summary */}
        <Card className="mt-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-bakery-brown">Dagens sammendrag</CardTitle>
            <CardDescription>Status for pakking og leveranser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">72%</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Ferdig pakket</div>
                <div className="text-xs text-gray-500">34 av 47 ordrer</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-bakery-orange mb-2">28%</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Under pakking</div>
                <div className="text-xs text-gray-500">13 ordrer igjen</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">92%</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Leveringsrate</div>
                <div className="text-xs text-gray-500">På tid i dag</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
