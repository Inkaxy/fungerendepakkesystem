
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, TrendingUp, Calendar } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapporter</h1>
          <p className="text-muted-foreground">
            Analyser og rapporter for bedre innsikt i virksomheten
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Eksporter Rapport
        </Button>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Salgsrapport
            </CardTitle>
            <CardDescription>
              Oversikt over salg og omsetning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">125.400 kr</div>
              <p className="text-sm text-muted-foreground">Total omsetning denne måneden</p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12% fra forrige måned
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              Se detaljer
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Leveringsrapport
            </CardTitle>
            <CardDescription>
              Leveringsstatistikk og effektivitet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">94%</div>
              <p className="text-sm text-muted-foreground">Leveringer i tide denne måneden</p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2% fra forrige måned
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              Se detaljer
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Produktrapport
            </CardTitle>
            <CardDescription>
              Mest populære produkter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">847</div>
              <p className="text-sm text-muted-foreground">Produkter solgt denne måneden</p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                +8% fra forrige måned
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              Se detaljer
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Månedlige Trender</CardTitle>
            <CardDescription>
              Sammenligning av ytelse over tid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-500">Graf kommer snart</p>
                <p className="text-xs text-gray-400">Integrering med Recharts planlagt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kundeanalyse</CardTitle>
            <CardDescription>
              Innsikt i kundeadferd og preferanser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Nye kunder</span>
                <span className="font-medium">12 denne måneden</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Gjentakende kunder</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Gjennomsnittlig ordrestørrelse</span>
                <span className="font-medium">1.485 kr</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Mest populære produkt</span>
                <span className="font-medium">Grovbrød</span>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Detaljert analyse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Eksporter Data</CardTitle>
          <CardDescription>
            Last ned rapporter i forskjellige formater
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span>Excel (.xlsx)</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span>PDF Rapport</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span>CSV Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
