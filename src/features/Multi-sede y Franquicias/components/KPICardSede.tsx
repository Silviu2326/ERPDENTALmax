import { DollarSign, Users, CalendarCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { SedeSummary } from '../api/dashboardSedesApi';

interface KPICardSedeProps {
  sede: SedeSummary;
  formatoMoneda?: (valor: number) => string;
}

export default function KPICardSede({ sede, formatoMoneda }: KPICardSedeProps) {
  const formatearMoneda =
    formatoMoneda ||
    ((valor: number) =>
      new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(valor));

  const formatearPorcentaje = (valor: number) => {
    return `${(valor * 100).toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{sede.nombreSede}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Ingresos */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-xs font-semibold text-green-700 uppercase">Ingresos</span>
          </div>
          <p className="text-xl font-bold text-green-900">{formatearMoneda(sede.totalIngresos)}</p>
        </div>

        {/* Nuevos Pacientes */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 uppercase">
              Nuevos Pacientes
            </span>
          </div>
          <p className="text-xl font-bold text-blue-900">{sede.nuevosPacientes}</p>
        </div>

        {/* Citas Atendidas */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <CalendarCheck className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold text-purple-700 uppercase">
              Citas Atendidas
            </span>
          </div>
          <p className="text-xl font-bold text-purple-900">{sede.citasAtendidas}</p>
        </div>

        {/* Tasa de Ocupación */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center space-x-2 mb-2">
            {sede.tasaOcupacion >= 0.75 ? (
              <TrendingUp className="w-5 h-5 text-orange-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-orange-600" />
            )}
            <span className="text-xs font-semibold text-orange-700 uppercase">
              Tasa Ocupación
            </span>
          </div>
          <p className="text-xl font-bold text-orange-900">
            {formatearPorcentaje(sede.tasaOcupacion)}
          </p>
        </div>
      </div>

      {/* Métricas adicionales */}
      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-gray-600">Ticket Promedio</span>
          <p className="text-sm font-semibold text-gray-800">
            {formatearMoneda(sede.ticketPromedio)}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-600">Tasa Cancelación</span>
          <p className="text-sm font-semibold text-gray-800">
            {formatearPorcentaje(sede.tasaCancelacion)}
          </p>
        </div>
      </div>
    </div>
  );
}


