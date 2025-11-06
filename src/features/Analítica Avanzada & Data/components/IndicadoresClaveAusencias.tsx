import { AlertCircle, TrendingDown, DollarSign } from 'lucide-react';
import { AusenciasKPIs } from '../api/analiticaApi';

interface IndicadoresClaveAusenciasProps {
  kpis: AusenciasKPIs | null;
  loading?: boolean;
}

export default function IndicadoresClaveAusencias({
  kpis,
  loading = false,
}: IndicadoresClaveAusenciasProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-500 text-center">No hay datos disponibles</p>
      </div>
    );
  }

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total de Ausencias */}
      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-lg p-6 border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Total de Ausencias</h3>
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{kpis.totalAusencias}</span>
          <span className="text-sm text-gray-600">citas</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Citas no asistidas en el período</p>
      </div>

      {/* Tasa de Ausentismo */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-lg p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Tasa de Ausentismo</h3>
          <TrendingDown className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{kpis.tasaAusentismo.toFixed(1)}</span>
          <span className="text-sm text-gray-600">%</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Porcentaje sobre el total de citas</p>
      </div>

      {/* Pérdida Estimada */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Pérdida Estimada</h3>
          <DollarSign className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{formatearMoneda(kpis.perdidaEstimada)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Valor estimado de tratamientos perdidos</p>
      </div>
    </div>
  );
}


