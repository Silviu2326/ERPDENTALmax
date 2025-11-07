import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { CuotaAmortizacion } from '../api/financiacionApi';

interface TablaAmortizacionDetalladaProps {
  tablaAmortizacion: CuotaAmortizacion[];
  className?: string;
}

export default function TablaAmortizacionDetallada({ tablaAmortizacion, className }: TablaAmortizacionDetalladaProps) {
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pagada':
        return <CheckCircle2 size={18} className="text-green-600" />;
      case 'pendiente':
        return <Clock size={18} className="text-slate-500" />;
      case 'vencida':
        return <AlertCircle size={18} className="text-yellow-600" />;
      case 'mora':
        return <XCircle size={18} className="text-red-600" />;
      default:
        return <Clock size={18} className="text-slate-500" />;
    }
  };

  const getEstadoBadge = (estado: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (estado) {
      case 'pagada':
        return `${baseClasses} bg-green-100 text-green-800 ring-1 ring-green-200`;
      case 'pendiente':
        return `${baseClasses} bg-slate-100 text-slate-800 ring-1 ring-slate-200`;
      case 'vencida':
        return `${baseClasses} bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200`;
      case 'mora':
        return `${baseClasses} bg-red-100 text-red-800 ring-1 ring-red-200`;
      default:
        return `${baseClasses} bg-slate-100 text-slate-800 ring-1 ring-slate-200`;
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className={`bg-white shadow-sm rounded-xl ring-1 ring-slate-200 overflow-hidden ${className || ''}`}>
      <div className="px-4 py-3 border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <h3 className="text-lg font-semibold text-gray-900">Tabla de Amortización</h3>
        <p className="text-sm text-gray-600 mt-1">Detalle de todas las cuotas del plan de financiación</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Cuota
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Fecha Vencimiento
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Capital
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Interés
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Total Cuota
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Capital Pendiente
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {tablaAmortizacion.map((cuota) => (
              <tr
                key={cuota.numeroCuota}
                className={`hover:bg-slate-50 transition-colors ${
                  cuota.estadoPago === 'pagada' ? 'bg-green-50/30' : ''
                } ${cuota.estadoPago === 'vencida' ? 'bg-yellow-50/30' : ''} ${
                  cuota.estadoPago === 'mora' ? 'bg-red-50/30' : ''
                }`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getEstadoIcon(cuota.estadoPago)}
                    <span className="text-sm font-medium text-gray-900">#{cuota.numeroCuota}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatearFecha(cuota.fechaVencimiento)}
                  {cuota.fechaPago && (
                    <div className="text-xs text-green-600 mt-1">
                      Pagada: {formatearFecha(cuota.fechaPago)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  €{cuota.capital.toFixed(2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                  €{cuota.interes.toFixed(2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                  €{cuota.totalCuota.toFixed(2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                  €{cuota.capitalPendiente.toFixed(2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className={getEstadoBadge(cuota.estadoPago)}>
                    {cuota.estadoPago.charAt(0).toUpperCase() + cuota.estadoPago.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-300">
            <tr>
              <td colSpan={2} className="px-4 py-4 text-sm font-bold text-gray-900">
                TOTALES
              </td>
              <td className="px-4 py-4 text-sm text-right font-bold text-gray-900">
                €{tablaAmortizacion.reduce((sum, c) => sum + c.capital, 0).toFixed(2)}
              </td>
              <td className="px-4 py-4 text-sm text-right font-bold text-gray-900">
                €{tablaAmortizacion.reduce((sum, c) => sum + c.interes, 0).toFixed(2)}
              </td>
              <td className="px-4 py-4 text-sm text-right font-bold text-blue-600">
                €{tablaAmortizacion.reduce((sum, c) => sum + c.totalCuota, 0).toFixed(2)}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}



