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
    <div className="bg-white shadow-sm rounded-xl p-4 ring-1 ring-slate-200 h-full flex flex-col transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{sede.nombreSede}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Total Ingresos */}
        <div className="bg-green-100 rounded-xl p-4 ring-1 ring-green-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-green-600" />
            <span className="text-xs font-medium text-green-700 uppercase">Ingresos</span>
          </div>
          <p className="text-xl font-bold text-green-900">{formatearMoneda(sede.totalIngresos)}</p>
        </div>

        {/* Nuevos Pacientes */}
        <div className="bg-blue-100 rounded-xl p-4 ring-1 ring-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-700 uppercase">
              Nuevos Pacientes
            </span>
          </div>
          <p className="text-xl font-bold text-blue-900">{sede.nuevosPacientes}</p>
        </div>

        {/* Citas Atendidas */}
        <div className="bg-purple-100 rounded-xl p-4 ring-1 ring-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <CalendarCheck size={18} className="text-purple-600" />
            <span className="text-xs font-medium text-purple-700 uppercase">
              Citas Atendidas
            </span>
          </div>
          <p className="text-xl font-bold text-purple-900">{sede.citasAtendidas}</p>
        </div>

        {/* Tasa de Ocupación */}
        <div className="bg-orange-100 rounded-xl p-4 ring-1 ring-orange-200">
          <div className="flex items-center gap-2 mb-2">
            {sede.tasaOcupacion >= 0.75 ? (
              <TrendingUp size={18} className="text-orange-600" />
            ) : (
              <TrendingDown size={18} className="text-orange-600" />
            )}
            <span className="text-xs font-medium text-orange-700 uppercase">
              Tasa Ocupación
            </span>
          </div>
          <p className="text-xl font-bold text-orange-900">
            {formatearPorcentaje(sede.tasaOcupacion)}
          </p>
        </div>
      </div>

      {/* Métricas adicionales */}
      <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-slate-600">Ticket Promedio</span>
          <p className="text-sm font-semibold text-gray-900">
            {formatearMoneda(sede.ticketPromedio)}
          </p>
        </div>
        <div>
          <span className="text-xs text-slate-600">Tasa Cancelación</span>
          <p className="text-sm font-semibold text-gray-900">
            {formatearPorcentaje(sede.tasaCancelacion)}
          </p>
        </div>
      </div>
    </div>
  );
}



