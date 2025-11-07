import { AlertTriangle, CheckCircle, Clock, ShoppingCart } from 'lucide-react';
import { AlertaReabastecimiento } from '../api/alertasApi';

interface ItemAlertaFilaProps {
  alerta: AlertaReabastecimiento;
  onAccion: (alerta: AlertaReabastecimiento, accion: 'revisar' | 'crear_orden' | 'resolver') => void;
}

export default function ItemAlertaFila({ alerta, onAccion }: ItemAlertaFilaProps) {
  const getEstadoBadge = () => {
    const baseClasses = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium';
    switch (alerta.estado) {
      case 'nueva':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <AlertTriangle size={12} />
            Nueva
          </span>
        );
      case 'revisada':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <Clock size={12} />
            Revisada
          </span>
        );
      case 'en_proceso_compra':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            <ShoppingCart size={12} />
            En Proceso
          </span>
        );
      case 'resuelta':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle size={12} />
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
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{alerta.producto.nombre}</div>
            <div className="text-sm text-slate-500">SKU: {alerta.producto.sku}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{alerta.sede.nombre}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-semibold">{alerta.stock_actual}</div>
        <div className="text-xs text-slate-500">Mínimo: {alerta.stock_minimo_al_generar}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-[60px]">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(porcentajeStock, 100)}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-red-600 font-semibold whitespace-nowrap">
            -{diferencia}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-semibold">{alerta.cantidad_sugerida_pedido}</div>
        {alerta.producto.proveedor_preferido && (
          <div className="text-xs text-slate-500">
            Proveedor: {alerta.producto.proveedor_preferido.nombre}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getEstadoBadge()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
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
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Revisar
              </button>
              <button
                onClick={() => onAccion(alerta, 'crear_orden')}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <ShoppingCart size={16} />
                Crear Orden
              </button>
            </>
          )}
          {alerta.estado === 'revisada' && (
            <button
              onClick={() => onAccion(alerta, 'crear_orden')}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <ShoppingCart size={16} />
              Crear Orden
            </button>
          )}
          {alerta.estado !== 'resuelta' && (
            <button
              onClick={() => onAccion(alerta, 'resolver')}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all text-slate-600 hover:text-slate-700 hover:bg-slate-100"
            >
              Resolver
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}



