import { Calendar, CreditCard, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FinanciacionPaciente } from '../api/financiacionApi';

interface CardResumenFinanciacionPacienteProps {
  financiacion: FinanciacionPaciente;
  onClick?: () => void;
}

export default function CardResumenFinanciacionPaciente({ financiacion, onClick }: CardResumenFinanciacionPacienteProps) {
  const cuotasPagadas = financiacion.tablaAmortizacion.filter((c) => c.estadoPago === 'pagada').length;
  const cuotasPendientes = financiacion.tablaAmortizacion.filter((c) => c.estadoPago === 'pendiente').length;
  const cuotasVencidas = financiacion.tablaAmortizacion.filter((c) => c.estadoPago === 'vencida' || c.estadoPago === 'mora').length;
  
  const capitalPagado = financiacion.tablaAmortizacion
    .filter((c) => c.estadoPago === 'pagada')
    .reduce((sum, c) => sum + c.capital, 0);
  const capitalPendiente = financiacion.montoTotalFinanciado - capitalPagado;

  const getEstadoColor = () => {
    switch (financiacion.estado) {
      case 'activo':
        return 'bg-blue-100 text-blue-800 ring-blue-200';
      case 'pagado':
        return 'bg-green-100 text-green-800 ring-green-200';
      case 'mora':
        return 'bg-red-100 text-red-800 ring-red-200';
      default:
        return 'bg-slate-100 text-slate-800 ring-slate-200';
    }
  };

  const getEstadoIcon = () => {
    switch (financiacion.estado) {
      case 'activo':
        return <TrendingUp size={16} />;
      case 'pagado':
        return <CheckCircle2 size={16} />;
      case 'mora':
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white shadow-sm rounded-xl ring-1 ring-slate-200 p-4 h-full flex flex-col transition-all overflow-hidden ${
        onClick ? 'cursor-pointer hover:shadow-md hover:ring-blue-300' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{financiacion.planFinanciacionId.nombre}</h3>
          <p className="text-sm text-gray-600">
            {financiacion.pacienteId.nombre} {financiacion.pacienteId.apellidos}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ring-1 ${getEstadoColor()}`}>
          {getEstadoIcon()}
          <span className="text-xs font-semibold capitalize">{financiacion.estado}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={16} className="text-slate-500" />
            <span className="text-xs text-slate-600">Monto Total</span>
          </div>
          <p className="text-lg font-bold text-gray-900">€{financiacion.montoTotalFinanciado.toFixed(2)}</p>
        </div>

        <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={16} className="text-slate-500" />
            <span className="text-xs text-slate-600">Cuota Mensual</span>
          </div>
          <p className="text-lg font-bold text-gray-900">€{financiacion.montoCuota.toFixed(2)}</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-600">Progreso de Pago</span>
          <span className="font-semibold text-gray-900">
            {cuotasPagadas} / {financiacion.numeroCuotas} cuotas
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(cuotasPagadas / financiacion.numeroCuotas) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Capital Pagado: €{capitalPagado.toFixed(2)}</span>
          <span>Pendiente: €{capitalPendiente.toFixed(2)}</span>
        </div>
      </div>

      {cuotasVencidas > 0 && (
        <div className="mt-4 rounded-xl bg-red-50 ring-1 ring-red-200 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600" />
            <span className="text-sm font-semibold text-red-800">
              {cuotasVencidas} {cuotasVencidas === 1 ? 'cuota vencida' : 'cuotas vencidas'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}



