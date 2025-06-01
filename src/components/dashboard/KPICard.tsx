
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  delta?: number;
  trend?: 'up' | 'down' | 'stable';
  subtitle?: string;
  icon: LucideIcon;
  severity?: 'low' | 'medium' | 'high';
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  delta,
  trend,
  subtitle,
  icon: Icon,
  severity = 'medium'
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'high': return 'text-red-400 border-red-500/20 bg-red-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
      case 'low': return 'text-green-400 border-green-500/20 bg-green-500/10';
      default: return 'text-gray-400 border-gray-500/20 bg-gray-500/10';
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    switch (trend) {
      case 'up': return 'text-red-400';
      case 'down': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendSymbol = () => {
    if (!trend || !delta) return '';
    return trend === 'up' ? '+' : '';
  };

  return (
    <Card className={`border ${getSeverityColor()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-white">{value}</div>
          {delta !== undefined && (
            <Badge variant="outline" className={`${getTrendColor()} border-current`}>
              {getTrendSymbol()}{delta}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
