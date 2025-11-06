import { BarChart3 } from 'lucide-react';
import { DashboardSummary } from '../api/dashboardAPI';

interface RevenueComparisonChartProps {
  centersData: DashboardSummary['centersData'];
}

export default function RevenueComparisonChart({
  centersData,
}: RevenueComparisonChartProps) {
  const maxRevenue = Math.max(...centersData.map((c) => c.facturacion), 0);

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Comparación de Facturación por Centro</h2>
      </div>

      <div className="space-y-4">
        {centersData.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
        ) : (
          centersData.map((center) => {
            const percentage = maxRevenue > 0 ? (center.facturacion / maxRevenue) * 100 : 0;

            return (
              <div key={center.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">{center.nombre}</span>
                  <span className="text-sm font-bold text-gray-800">
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(center.facturacion)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 10 && (
                      <span className="text-xs font-semibold text-white">
                        {percentage.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


