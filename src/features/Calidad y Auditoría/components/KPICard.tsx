import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: {
    value: number;
    percentage: number;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

export default function KPICard({
  title,
  value,
  unit = '',
  trend,
  icon,
  color = 'blue',
}: KPICardProps) {
  const colorClasses = {
    blue: 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100',
    green: 'border-green-500 bg-gradient-to-br from-green-50 to-green-100',
    yellow: 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100',
    purple: 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100',
    red: 'border-red-500 bg-gradient-to-br from-red-50 to-red-100',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
  };

  const formatValue = (val: number | string): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(2) + 'M';
      }
      if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
      return val.toFixed(2);
    }
    return val;
  };

  return (
    <div
      className={`rounded-xl shadow-md p-6 border-l-4 ${colorClasses[color]} transition-all hover:shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className={iconColorClasses[color]}>{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold text-gray-900">{formatValue(value)}</span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm mt-2">
          {trend.percentage > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : trend.percentage < 0 ? (
            <TrendingDown className="w-4 h-4 text-red-600" />
          ) : (
            <Minus className="w-4 h-4 text-gray-400" />
          )}
          <span
            className={
              trend.percentage > 0
                ? 'text-green-600 font-medium'
                : trend.percentage < 0
                ? 'text-red-600 font-medium'
                : 'text-gray-500'
            }
          >
            {trend.percentage > 0 ? '+' : ''}
            {trend.percentage.toFixed(1)}% vs período anterior
          </span>
        </div>
      )}
    </div>
  );
}


