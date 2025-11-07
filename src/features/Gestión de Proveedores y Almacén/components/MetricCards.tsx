interface MetricCardData {
  id: string;
  title: string;
  value: number | string;
  color: 'info' | 'success' | 'warning' | 'danger';
}

interface MetricCardsProps {
  data: MetricCardData[];
}

export default function MetricCards({ data }: MetricCardsProps) {
  const getColorClasses = (color: MetricCardData['color']) => {
    switch (color) {
      case 'info':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-600',
          border: 'border-blue-200',
        };
      case 'success':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          border: 'border-green-200',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-600',
          border: 'border-yellow-200',
        };
      case 'danger':
        return {
          bg: 'bg-red-100',
          text: 'text-red-600',
          border: 'border-red-200',
        };
    }
  };

  const formatValue = (value: number | string): string => {
    if (typeof value === 'string') return value;
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((metric) => {
        const colors = getColorClasses(metric.color);
        return (
          <div
            key={metric.id}
            className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${colors.border} transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-700">{metric.title}</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${colors.text}`}>
                {typeof metric.value === 'number' && metric.color === 'info' 
                  ? formatValue(metric.value)
                  : metric.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

