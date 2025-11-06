import { Pago } from '../api/pagosApi';
import { Eye, FileText, XCircle, Receipt } from 'lucide-react';

interface TablaPagosProps {
  pagos: Pago[];
  loading?: boolean;
  onVerRecibo?: (pagoId: string) => void;
  onAnularPago?: (pagoId: string) => void;
}

export default function TablaPagos({
  pagos,
  loading = false,
  onVerRecibo,
  onAnularPago,
}: TablaPagosProps) {
  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'Anulado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetodoPagoColor = (metodo: string): string => {
    switch (metodo) {
      case 'Efectivo':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Tarjeta de Crédito':
      case 'Tarjeta de Débito':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Transferencia':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cheque':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
          <Receipt className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay pagos registrados</p>
          <p className="text-sm">Los pagos aparecerán aquí cuando se registren</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-900">Lista de Pagos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nº Recibo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Factura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagos.map((pago) => (
              <tr key={pago._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{pago.numeroRecibo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {pago.paciente.nombre} {pago.paciente.apellidos}
                  </div>
                  {pago.paciente.documentoIdentidad && (
                    <div className="text-xs text-gray-500">
                      {pago.paciente.documentoIdentidad}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    #{pago.factura.numeroFactura}
                  </div>
                  <div className="text-xs text-gray-500">
                    Saldo: {formatearMoneda(pago.factura.saldoPendiente)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatearMoneda(pago.monto)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getMetodoPagoColor(
                      pago.metodoPago
                    )}`}
                  >
                    {pago.metodoPago}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatearFecha(pago.fechaPago)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(
                      pago.estado
                    )}`}
                  >
                    {pago.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {onVerRecibo && pago._id && pago.estado === 'Completado' && (
                      <button
                        onClick={() => onVerRecibo(pago._id!)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 transition-colors"
                        title="Ver recibo"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Ver</span>
                      </button>
                    )}
                    {onAnularPago && pago._id && pago.estado === 'Completado' && (
                      <button
                        onClick={() => {
                          if (window.confirm('¿Está seguro de que desea anular este pago? Esta acción revertirá el saldo de la factura.')) {
                            onAnularPago(pago._id!);
                          }
                        }}
                        className="text-red-600 hover:text-red-900 flex items-center space-x-1 transition-colors"
                        title="Anular pago"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Anular</span>
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


