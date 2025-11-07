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
          <div key={i} className="bg-white shadow-sm rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">No se encontraron indicadores para el período seleccionado</p>
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
      <div className="bg-white shadow-sm rounded-xl p-6 border border-red-200/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">Total de Ausencias</h3>
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle size={20} className="text-red-600" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{kpis.totalAusencias}</span>
          <span className="text-sm text-gray-600">citas</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Citas no asistidas en el período</p>
      </div>

      {/* Tasa de Ausentismo */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-orange-200/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">Tasa de Ausentismo</h3>
          <div className="p-2 bg-orange-100 rounded-lg">
            <TrendingDown size={20} className="text-orange-600" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{kpis.tasaAusentismo.toFixed(1)}</span>
          <span className="text-sm text-gray-600">%</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Porcentaje sobre el total de citas</p>
      </div>

      {/* Pérdida Estimada */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-blue-200/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">Pérdida Estimada</h3>
          <div className="p-2 bg-blue-100 rounded-lg">
            <DollarSign size={20} className="text-blue-600" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{formatearMoneda(kpis.perdidaEstimada)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Valor estimado de tratamientos perdidos</p>
      </div>
    </div>
  );
}



