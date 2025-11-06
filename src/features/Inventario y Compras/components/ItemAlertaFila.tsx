import { AlertTriangle, CheckCircle, Clock, ShoppingCart } from 'lucide-react';
import { AlertaReabastecimiento } from '../api/alertasApi';

interface ItemAlertaFilaProps {
  alerta: AlertaReabastecimiento;
  onAccion: (alerta: AlertaReabastecimiento, accion: 'revisar' | 'crear_orden' | 'resolver') => void;
}

export default function ItemAlertaFila({ alerta, onAccion }: ItemAlertaFilaProps) {
  const getEstadoBadge = () => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (alerta.estado) {
      case 'nueva':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800 flex items-center gap-1`}>
            <AlertTriangle className="w-3 h-3" />
            Nueva
          </span>
        );
      case 'revisada':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800 flex items-center gap-1`}>
            <Clock className="w-3 h-3" />
            Revisada
          </span>
        );
      case 'en_proceso_compra':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800 flex items-center gap-1`}>
            <ShoppingCart className="w-3 h-3" />
            En Proceso
          </span>
        );
      case 'resuelta':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800 flex items-center gap-1`}>
            <CheckCircle className="w-3 h-3" />
            Resuelta
          </span>
        );
      default:
        return null;
    }
  };

  const diferencia = alerta.stock_minimo_al_generar - alerta.stock_actual;
  const porcentajeStock = (alerta.stock_actual / alerta.stock_minimo_al_generar) * 100;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{alerta.producto.nombre}</div>
            <div className="text-sm text-gray-500">SKU: {alerta.producto.sku}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{alerta.sede.nombre}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-semibold">{alerta.stock_actual}</div>
        <div className="text-xs text-gray-500">Mínimo: {alerta.stock_minimo_al_generar}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-1 mr-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${Math.min(porcentajeStock, 100)}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-red-600 font-semibold">
            -{diferencia}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-semibold">{alerta.cantidad_sugerida_pedido}</div>
        {alerta.producto.proveedor_preferido && (
          <div className="text-xs text-gray-500">
            Proveedor: {alerta.producto.proveedor_preferido.nombre}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getEstadoBadge()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(alerta.fecha_creacion).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          {alerta.estado === 'nueva' && (
            <>
              <button
                onClick={() => onAccion(alerta, 'revisar')}
                className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50"
              >
                Revisar
              </button>
              <button
                onClick={() => onAccion(alerta, 'crear_orden')}
                className="text-green-600 hover:text-green-900 px-3 py-1 rounded hover:bg-green-50 flex items-center gap-1"
              >
                <ShoppingCart className="w-4 h-4" />
                Crear Orden
              </button>
            </>
          )}
          {alerta.estado === 'revisada' && (
            <button
              onClick={() => onAccion(alerta, 'crear_orden')}
              className="text-green-600 hover:text-green-900 px-3 py-1 rounded hover:bg-green-50 flex items-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              Crear Orden
            </button>
          )}
          {alerta.estado !== 'resuelta' && (
            <button
              onClick={() => onAccion(alerta, 'resolver')}
              className="text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100"
            >
              Resolver
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}


