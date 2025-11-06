import { RefreshCw, Eye } from 'lucide-react';
import { TransaccionOnePay } from '../api/pasarelasPagoApi';

interface TablaTransaccionesOnePayProps {
  transacciones: TransaccionOnePay[];
  loading: boolean;
  onRecargar: () => void;
}

export default function TablaTransaccionesOnePay({
  transacciones,
  loading,
  onRecargar,
}: TablaTransaccionesOnePayProps) {
  const getEstadoColor = (estado: TransaccionOnePay['estado']) => {
    switch (estado) {
      case 'PAGADO':
        return 'text-green-600 bg-green-100';
      case 'RECHAZADO':
        return 'text-red-600 bg-red-100';
      case 'PENDIENTE':
        return 'text-yellow-600 bg-yellow-100';
      case 'ANULADO':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(monto);
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Transacciones One Pay</h2>
          <p className="text-gray-600">Historial de transacciones procesadas a través de One Pay</p>
        </div>
        <button
          onClick={onRecargar}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Recargar</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden de Compra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Creación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transacciones.map((transaccion) => (
                  <tr key={transaccion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaccion.ordenCompra}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaccion.pacienteId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatearMonto(transaccion.monto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(
                          transaccion.estado
                        )}`}
                      >
                        {transaccion.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatearFecha(transaccion.fechaCreacion)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transacciones.length === 0 && (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay transacciones registradas</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


