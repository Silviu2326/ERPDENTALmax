import { BarChart3, TrendingUp } from 'lucide-react';
import { SourceBreakdown } from '../api/funnelApi';

export interface LeadSourceBreakdownChartProps {
  sourceBreakdown: SourceBreakdown[];
  loading?: boolean;
}

export default function LeadSourceBreakdownChart({
  sourceBreakdown,
  loading = false,
}: LeadSourceBreakdownChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando desglose por origen...</p>
        </div>
      </div>
    );
  }

  if (sourceBreakdown.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">
          No hay datos de origen disponibles
        </p>
      </div>
    );
  }

  const totalLeads = sourceBreakdown.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...sourceBreakdown.map((item) => item.count));

  const getColorForSource = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-rose-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-green-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <span>Desglose por Origen del Lead</span>
        </h2>
      </div>

      <div className="space-y-4">
        {sourceBreakdown.map((item, index) => {
          const percentage = totalLeads > 0 ? (item.count / totalLeads) * 100 : 0;
          const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded ${getColorForSource(index)}`}
                  />
                  <span className="font-medium text-gray-900">{item.source}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${getColorForSource(index)} transition-all duration-500 rounded-full`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Total de Leads</span>
          <span className="text-xl font-bold text-gray-900">
            {totalLeads.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}


