import { Calendar, Package, ArrowUp, ArrowDown, RotateCcw, Loader2 } from 'lucide-react';
import { MovimientoInventario } from '../api/stockApi';

interface HistorialMovimientosProductoProps {
  movimientos: MovimientoInventario[];
  loading?: boolean;
}

export default function HistorialMovimientosProducto({
  movimientos,
  loading,
}: HistorialMovimientosProductoProps) {
  const getIconoMovimiento = (tipo: MovimientoInventario['tipoMovimiento'] | 'ajuste') => {
    switch (tipo) {
      case 'compra':
      case 'ajuste_manual_entrada':
      case 'devolucion':
        return <ArrowUp className="w-5 h-5 text-green-600" />;
      case 'uso_clinico':
      case 'ajuste_manual_salida':
        return <ArrowDown className="w-5 h-5 text-red-600" />;
      case 'ajuste':
        // Determinar por cantidad si es entrada o salida
        return <RotateCcw className="w-5 h-5 text-yellow-600" />;
      default:
        return <RotateCcw className="w-5 h-5 text-gray-600" />;
    }
  };

  const getColorMovimiento = (tipo: MovimientoInventario['tipoMovimiento'] | 'ajuste') => {
    switch (tipo) {
      case 'compra':
      case 'ajuste_manual_entrada':
      case 'devolucion':
        return 'text-green-600 bg-green-50';
      case 'uso_clinico':
      case 'ajuste_manual_salida':
        return 'text-red-600 bg-red-50';
      case 'ajuste':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getLabelMovimiento = (tipo: MovimientoInventario['tipoMovimiento'] | 'ajuste') => {
    const labels: Record<MovimientoInventario['tipoMovimiento'] | 'ajuste', string> = {
      compra: 'Compra',
      uso_clinico: 'Uso Clínico',
      ajuste_manual_entrada: 'Ajuste Entrada',
      ajuste_manual_salida: 'Ajuste Salida',
      devolucion: 'Devolución',
      ajuste: 'Ajuste',
    };
    return labels[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm p-8 text-center rounded-xl">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando movimientos...</p>
      </div>
    );
  }

  if (movimientos.length === 0) {
    return (
      <div className="bg-white shadow-sm p-8 text-center rounded-xl">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay movimientos registrados</h3>
        <p className="text-gray-600">No se han registrado movimientos para este producto</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm overflow-hidden rounded-xl">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Movimientos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Stock Anterior
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Stock Nuevo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Motivo / Referencia
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movimientos.map((movimiento) => (
              <tr key={movimiento._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
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
                    {getIconoMovimiento(movimiento.tipoMovimiento as MovimientoInventario['tipoMovimiento'] | 'ajuste')}
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getColorMovimiento(
                        movimiento.tipoMovimiento as MovimientoInventario['tipoMovimiento'] | 'ajuste'
                      )}`}
                    >
                      {getLabelMovimiento(movimiento.tipoMovimiento as MovimientoInventario['tipoMovimiento'] | 'ajuste')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-semibold ${
                      movimiento.cantidad > 0
                        ? movimiento.tipoMovimiento === 'compra' ||
                          movimiento.tipoMovimiento === 'ajuste_manual_entrada' ||
                          movimiento.tipoMovimiento === 'devolucion' ||
                          (movimiento.tipoMovimiento as string) === 'ajuste'
                          ? 'text-green-600'
                          : 'text-red-600'
                        : movimiento.cantidad < 0
                        ? 'text-red-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {movimiento.cantidad > 0 ? '+' : ''}
                    {movimiento.cantidad}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {movimiento.stock_anterior}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {movimiento.stock_nuevo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {typeof movimiento.usuario === 'object'
                    ? movimiento.usuario.nombre
                    : movimiento.usuario}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div>
                    {movimiento.motivo && (
                      <div className="font-medium text-gray-900">{movimiento.motivo}</div>
                    )}
                    {movimiento.referencia && (
                      <div className="text-xs text-slate-500 mt-1">Ref: {movimiento.referencia}</div>
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



