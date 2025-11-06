import { DollarSign, TrendingUp, Box, Users, BarChart3 } from 'lucide-react';
import { ProduccionBoxKPIs } from '../api/analiticaApi';

interface IndicadoresProduccionBoxProps {
  kpis: ProduccionBoxKPIs | null;
  loading?: boolean;
}

export default function IndicadoresProduccionBox({
  kpis,
  loading = false,
}: IndicadoresProduccionBoxProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {/* Producción Total */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Producción Total</h3>
          <DollarSign className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">{formatearMoneda(kpis.produccionTotal)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Total generado en el período</p>
      </div>

      {/* Producción Promedio por Profesional */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Promedio Profesional</h3>
          <Users className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">{formatearMoneda(kpis.produccionPromedioProfesional)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Por profesional</p>
      </div>

      {/* Utilización de Boxes */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Utilización Boxes</h3>
          <Box className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">{kpis.utilizacionBoxes.toFixed(1)}</span>
          <span className="text-sm text-gray-600">%</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Porcentaje de utilización</p>
      </div>

      {/* Producción por Box */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-lg p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Producción por Box</h3>
          <BarChart3 className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">{formatearMoneda(kpis.produccionPorBox)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Promedio por box</p>
      </div>

      {/* Total Profesionales */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-lg p-6 border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Total Profesionales</h3>
          <Users className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">{kpis.totalProfesionales}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Profesionales activos</p>
      </div>

      {/* Total Boxes */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl shadow-lg p-6 border border-cyan-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Total Boxes</h3>
          <Box className="w-5 h-5 text-cyan-600" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">{kpis.totalBoxes}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Boxes disponibles</p>
      </div>
    </div>
  );
}


