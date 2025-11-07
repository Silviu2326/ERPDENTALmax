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
    <div className="bg-white shadow-sm rounded-xl p-4 ring-1 ring-gray-200">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy size={20} className="text-yellow-500" />
          <span>Ranking de Rendimiento</span>
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={metric}
            onChange={(e) =>
              onMetricChange?.(e.target.value as 'revenue' | 'newPatients' | 'occupancy')
            }
            className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
          >
            <option value="revenue">Facturación</option>
            <option value="newPatients">Pacientes Nuevos</option>
            <option value="occupancy">Tasa de Ocupación</option>
          </select>
          <button
            onClick={() => onOrderChange?.(currentOrder === 'asc' ? 'desc' : 'asc')}
            className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm transition-all"
          >
            {currentOrder === 'asc' ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
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
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors ring-1 ring-slate-200/50"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0 w-8 text-center">
                  {index < 3 ? (
                    <Trophy size={20} className={`${getMedalColor(index)}`} />
                  ) : (
                    <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.nombre}</h3>
                  <p className="text-sm text-gray-600">{getMetricLabel(metric)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
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



