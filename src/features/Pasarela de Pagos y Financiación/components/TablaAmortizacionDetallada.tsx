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
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pendiente':
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'vencida':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'mora':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getEstadoBadge = (estado: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (estado) {
      case 'pagada':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pendiente':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'vencida':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'mora':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
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
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <h3 className="text-lg font-bold text-white">Tabla de Amortización</h3>
        <p className="text-sm text-blue-100 mt-1">Detalle de todas las cuotas del plan de financiación</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Cuota
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fecha Vencimiento
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Capital
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Interés
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Total Cuota
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Capital Pendiente
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tablaAmortizacion.map((cuota, index) => (
              <tr
                key={cuota.numeroCuota}
                className={`hover:bg-gray-50 transition-colors ${
                  cuota.estadoPago === 'pagada' ? 'bg-green-50/30' : ''
                } ${cuota.estadoPago === 'mora' || cuota.estadoPago === 'vencida' ? 'bg-red-50/30' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getEstadoIcon(cuota.estadoPago)}
                    <span className="text-sm font-medium text-gray-900">#{cuota.numeroCuota}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatearFecha(cuota.fechaVencimiento)}
                  {cuota.fechaPago && (
                    <div className="text-xs text-green-600 mt-1">
                      Pagada: {formatearFecha(cuota.fechaPago)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  €{cuota.capital.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                  €{cuota.interes.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                  €{cuota.totalCuota.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                  €{cuota.capitalPendiente.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={getEstadoBadge(cuota.estadoPago)}>
                    {cuota.estadoPago.charAt(0).toUpperCase() + cuota.estadoPago.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t-2 border-gray-300">
            <tr>
              <td colSpan={2} className="px-6 py-4 text-sm font-bold text-gray-900">
                TOTALES
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                €{tablaAmortizacion.reduce((sum, c) => sum + c.capital, 0).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                €{tablaAmortizacion.reduce((sum, c) => sum + c.interes, 0).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-blue-600">
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


