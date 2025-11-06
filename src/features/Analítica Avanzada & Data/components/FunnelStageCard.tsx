import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { FunnelStage } from '../api/funnelApi';

export interface FunnelStageCardProps {
  stage: FunnelStage;
  previousStageCount?: number;
  index: number;
  totalStages: number;
}

export default function FunnelStageCard({
  stage,
  previousStageCount,
  index,
  totalStages,
}: FunnelStageCardProps) {
  const widthPercentage =
    previousStageCount && previousStageCount > 0
      ? (stage.count / previousStageCount) * 100
      : 100;

  const getStageColor = (idx: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-indigo-500 to-indigo-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-rose-500 to-rose-600',
    ];
    return colors[idx % colors.length];
  };

  const getConversionIcon = () => {
    if (stage.conversionRate === undefined) return null;
    if (stage.conversionRate >= 50) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (stage.conversionRate >= 30) {
      return <Minus className="w-4 h-4 text-yellow-600" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="relative">
      <div
        className={`bg-gradient-to-r ${getStageColor(index)} rounded-lg shadow-lg p-6 text-white transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
        style={{
          width: `${Math.max(widthPercentage, 10)}%`,
          minWidth: '200px',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold mb-1">{stage.name}</h3>
            <p className="text-3xl font-extrabold">{stage.count.toLocaleString()}</p>
          </div>
          {index > 0 && stage.conversionRate !== undefined && (
            <div className="flex items-center space-x-1 bg-white/20 rounded-lg px-2 py-1">
              {getConversionIcon()}
              <span className="text-sm font-semibold">
                {stage.conversionRate.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {index > 0 && previousStageCount && previousStageCount > 0 && (
          <div className="mt-3">
            <div className="text-xs text-white/80 mb-1">
              Tasa de conversión desde etapa anterior
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${Math.min(widthPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {index < totalStages - 1 && (
        <div className="flex justify-center my-2">
          <div className="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-400" />
        </div>
      )}
    </div>
  );
}


