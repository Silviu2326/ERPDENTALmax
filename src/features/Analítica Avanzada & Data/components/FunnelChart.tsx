import { FunnelStage } from '../api/funnelApi';
import FunnelStageCard from './FunnelStageCard';

export interface FunnelChartProps {
  stages: FunnelStage[];
  loading?: boolean;
}

export default function FunnelChart({ stages, loading = false }: FunnelChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del embudo...</p>
        </div>
      </div>
    );
  }

  if (stages.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 text-lg font-medium">
          No hay datos disponibles para el período seleccionado
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
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


