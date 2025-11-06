import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PerformanceRankingItem } from '../api/dashboardAPI';

interface PerformanceRankingListProps {
  ranking: PerformanceRankingItem[];
  metric: 'revenue' | 'newPatients' | 'occupancy';
  onMetricChange?: (metric: 'revenue' | 'newPatients' | 'occupancy') => void;
  onOrderChange?: (order: 'asc' | 'desc') => void;
  currentOrder?: 'asc' | 'desc';
}

export default function PerformanceRankingList({
  ranking,
  metric,
  onMetricChange,
  onOrderChange,
  currentOrder = 'desc',
}: PerformanceRankingListProps) {
  const getMetricLabel = (m: string) => {
    switch (m) {
      case 'revenue':
        return 'Facturación';
      case 'newPatients':
        return 'Pacientes Nuevos';
      case 'occupancy':
        return 'Tasa de Ocupación';
      default:
        return m;
    }
  };

  const formatValue = (value: number, m: string) => {
    switch (m) {
      case 'revenue':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
        }).format(value);
      case 'occupancy':
        return `${value.toFixed(1)}%`;
      default:
        return value.toString();
    }
  };

  const getMedalColor = (index: number) => {
    if (index === 0) return 'text-yellow-500';
    if (index === 1) return 'text-gray-400';
    if (index === 2) return 'text-orange-600';
    return 'text-gray-300';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span>Ranking de Rendimiento</span>
        </h2>
        <div className="flex items-center space-x-2">
          <select
            value={metric}
            onChange={(e) =>
              onMetricChange?.(e.target.value as 'revenue' | 'newPatients' | 'occupancy')
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="revenue">Facturación</option>
            <option value="newPatients">Pacientes Nuevos</option>
            <option value="occupancy">Tasa de Ocupación</option>
          </select>
          <button
            onClick={() => onOrderChange?.(currentOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currentOrder === 'asc' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {ranking.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
        ) : (
          ranking.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0 w-8 text-center">
                  {index < 3 ? (
                    <Trophy className={`w-6 h-6 ${getMedalColor(index)}`} />
                  ) : (
                    <span className="text-gray-500 font-bold">#{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.nombre}</h3>
                  <p className="text-sm text-gray-500">{getMetricLabel(metric)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">
                  {formatValue(item.valor, metric)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


