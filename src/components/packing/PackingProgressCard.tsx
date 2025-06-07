
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PackingProgressCardProps {
  packedCount: number;
  totalItems: number;
  onSaveProgress: () => void;
}

const PackingProgressCard = ({ packedCount, totalItems, onSaveProgress }: PackingProgressCardProps) => {
  const progressPercentage = totalItems > 0 ? (packedCount / totalItems) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Pakking fremgang</span>
          <Button onClick={onSaveProgress}>
            Lagre fremgang
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{packedCount} av {totalItems} pakket</span>
          <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PackingProgressCard;
