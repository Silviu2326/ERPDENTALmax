import { Eye, CheckCircle, AlertCircle, XCircle, Calendar } from 'lucide-react';
import { PagoSeguro } from '../api/pagosSeguroApi';

interface TablaPagosSeguroProps {
  pagos: PagoSeguro[];
  loading?: boolean;
  onVerDetalle?: (pago: PagoSeguro) => void;
}

export default function TablaPagosSeguro({
  pagos,
  loading = false,
  onVerDetalle,
}: TablaPagosSeguroProps) {
  const formatearFecha = (fecha: string | Date) => {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(monto);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'conciliado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Conciliado
          </span>
        );
      case 'parcial':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3" />
            Parcial
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Pendiente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {estado}
          </span>
        );
    }
  };

  const getMetodoPagoLabel = (metodo: string) => {
    switch (metodo) {
      case 'transferencia':
        return 'Transferencia';
      case 'cheque':
        return 'Cheque';
      case 'otro':
        return 'Otro';
      default:
        return metodo;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (pagos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay pagos registrados</p>
          <p className="text-sm">Los pagos de seguros aparecerán aquí cuando se registren</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aseguradora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reclamaciones
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagos.map((pago) => (
              <tr key={pago._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatearFecha(pago.fechaPago)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {pago.aseguradora?.nombreComercial || 'N/A'}
                  </div>
                  {pago.aseguradora?.razonSocial && (
                    <div className="text-xs text-gray-500">
                      {pago.aseguradora.razonSocial}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatearMoneda(pago.montoTotal)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getMetodoPagoLabel(pago.metodoPago)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono">
                    {pago.referencia || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEstadoBadge(pago.estado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {pago.reclamacionesCubiertas?.length || 0} reclamación(es)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {onVerDetalle && (
                      <button
                        onClick={() => onVerDetalle(pago)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


