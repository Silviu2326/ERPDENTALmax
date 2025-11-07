import { Loader2, BarChart3 } from 'lucide-react';
import { FunnelStage } from '../api/funnelApi';
import FunnelStageCard from './FunnelStageCard';

export interface FunnelChartProps {
  stages: FunnelStage[];
  loading?: boolean;
}

export default function FunnelChart({ stages, loading = false }: FunnelChartProps) {
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando datos del embudo...</p>
      </div>
    );
  }

  if (stages.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay datos disponibles
        </h3>
        <p className="text-gray-600">
          No hay datos disponibles para el período seleccionado
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BarChart3 size={24} className="text-blue-600" />
        <span>Embudo de Conversión</span>
      </h2>

      <div className="space-y-0">
        {stages.map((stage, index) => {
          const previousStageCount = index > 0 ? stages[index - 1].count : undefined;
          return (
            <div key={index} className="flex justify-center">
              <FunnelStageCard
                stage={stage}
                previousStageCount={previousStageCount}
                index={index}
                totalStages={stages.length}
              />
            </div>
          );
        })}
      </div>

      {/* Resumen de métricas */}
      <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Total de Leads</div>
          <div className="text-2xl font-bold text-gray-900">
            {stages[0]?.count.toLocaleString() || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Pacientes Activos</div>
          <div className="text-2xl font-bold text-green-600">
            {stages[stages.length - 1]?.count.toLocaleString() || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Tasa de Conversión Total</div>
          <div className="text-2xl font-bold text-blue-600">
            {stages.length > 0 && stages[0].count > 0
              ? (
                  (stages[stages.length - 1].count / stages[0].count) *
                  100
                ).toFixed(1)
              : 0}
            %
          </div>
        </div>
      </div>
    </div>
  );
}



