import { Calendar, Package, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { MovimientoInventario } from '../api/stockApi';

interface HistorialMovimientosProductoProps {
  movimientos: MovimientoInventario[];
  loading?: boolean;
}

export default function HistorialMovimientosProducto({
  movimientos,
  loading,
}: HistorialMovimientosProductoProps) {
  const getIconoMovimiento = (tipo: MovimientoInventario['tipoMovimiento']) => {
    switch (tipo) {
      case 'compra':
      case 'ajuste_manual_entrada':
      case 'devolucion':
        return <ArrowUp className="w-5 h-5 text-green-600" />;
      case 'uso_clinico':
      case 'ajuste_manual_salida':
        return <ArrowDown className="w-5 h-5 text-red-600" />;
      default:
        return <RotateCcw className="w-5 h-5 text-gray-600" />;
    }
  };

  const getColorMovimiento = (tipo: MovimientoInventario['tipoMovimiento']) => {
    switch (tipo) {
      case 'compra':
      case 'ajuste_manual_entrada':
      case 'devolucion':
        return 'text-green-600 bg-green-50';
      case 'uso_clinico':
      case 'ajuste_manual_salida':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getLabelMovimiento = (tipo: MovimientoInventario['tipoMovimiento']) => {
    const labels: Record<MovimientoInventario['tipoMovimiento'], string> = {
      compra: 'Compra',
      uso_clinico: 'Uso Clínico',
      ajuste_manual_entrada: 'Ajuste Entrada',
      ajuste_manual_salida: 'Ajuste Salida',
      devolucion: 'Devolución',
    };
    return labels[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando movimientos...</p>
      </div>
    );
  }

  if (movimientos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No hay movimientos registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Movimientos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Anterior
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Nuevo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motivo / Referencia
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movimientos.map((movimiento) => (
              <tr key={movimiento._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {new Date(movimiento.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getIconoMovimiento(movimiento.tipoMovimiento)}
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getColorMovimiento(
                        movimiento.tipoMovimiento
                      )}`}
                    >
                      {getLabelMovimiento(movimiento.tipoMovimiento)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-semibold ${
                      movimiento.cantidad > 0
                        ? movimiento.tipoMovimiento === 'compra' ||
                          movimiento.tipoMovimiento === 'ajuste_manual_entrada' ||
                          movimiento.tipoMovimiento === 'devolucion'
                          ? 'text-green-600'
                          : 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {movimiento.cantidad > 0 ? '+' : ''}
                    {movimiento.cantidad}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {movimiento.stock_anterior}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {movimiento.stock_nuevo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof movimiento.usuario === 'object'
                    ? movimiento.usuario.nombre
                    : movimiento.usuario}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>
                    {movimiento.motivo && (
                      <div className="font-medium">{movimiento.motivo}</div>
                    )}
                    {movimiento.referencia && (
                      <div className="text-xs text-gray-400">Ref: {movimiento.referencia}</div>
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


