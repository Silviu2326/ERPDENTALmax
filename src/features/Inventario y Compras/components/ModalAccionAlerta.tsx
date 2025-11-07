import { useState, useEffect } from 'react';
import { X, AlertTriangle, ShoppingCart, CheckCircle, Clock } from 'lucide-react';
import { AlertaReabastecimiento, crearOrdenCompraDesdeAlerta, actualizarEstadoAlerta } from '../api/alertasApi';

interface ModalAccionAlertaProps {
  alerta: AlertaReabastecimiento | null;
  accion: 'revisar' | 'crear_orden' | 'resolver' | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalAccionAlerta({ alerta, accion, onClose, onSuccess }: ModalAccionAlertaProps) {
  const [cantidad, setCantidad] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar cantidad cuando se abre el modal para crear orden
  useEffect(() => {
    if (alerta && accion === 'crear_orden') {
      setCantidad(alerta.cantidad_sugerida_pedido);
    } else {
      setCantidad(0);
    }
  }, [alerta, accion]);

  if (!alerta || !accion) return null;

  const cantidadInicial = alerta.cantidad_sugerida_pedido;

  const handleConfirmar = async () => {
    setLoading(true);
    setError(null);

    try {
      if (accion === 'crear_orden') {
        await crearOrdenCompraDesdeAlerta(alerta._id, cantidad || undefined);
        // Redirigir a la página de órdenes de compra o mostrar mensaje de éxito
      } else if (accion === 'revisar') {
        await actualizarEstadoAlerta(alerta._id, 'revisada');
      } else if (accion === 'resolver') {
        await actualizarEstadoAlerta(alerta._id, 'resuelta');
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la acción');
    } finally {
      setLoading(false);
    }
  };

  const getTitulo = () => {
    switch (accion) {
      case 'revisar':
        return 'Marcar Alerta como Revisada';
      case 'crear_orden':
        return 'Crear Orden de Compra';
      case 'resolver':
        return 'Resolver Alerta';
      default:
        return 'Acción sobre Alerta';
    }
  };

  const getDescripcion = () => {
    switch (accion) {
      case 'revisar':
        return '¿Estás seguro de que deseas marcar esta alerta como revisada?';
      case 'crear_orden':
        return 'Se creará un borrador de orden de compra con la información del producto y su proveedor preferido.';
      case 'resolver':
        return '¿Estás seguro de que deseas marcar esta alerta como resuelta? Esto indicará que el reabastecimiento ha sido completado.';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              accion === 'crear_orden' ? 'bg-green-100' : 
              accion === 'revisar' ? 'bg-yellow-100' : 
              'bg-blue-100'
            }`}>
              {accion === 'crear_orden' && <ShoppingCart size={20} className="text-green-600" />}
              {accion === 'revisar' && <Clock size={20} className="text-yellow-600" />}
              {accion === 'resolver' && <CheckCircle size={20} className="text-blue-600" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{getTitulo()}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">{getDescripcion()}</p>

          {/* Información de la alerta */}
          <div className="bg-slate-50 rounded-xl p-4 mb-4 ring-1 ring-slate-200">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-slate-700">Producto:</span>
                <span className="text-sm text-gray-900 ml-2">{alerta.producto.nombre}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Sede:</span>
                <span className="text-sm text-gray-900 ml-2">{alerta.sede.nombre}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Stock Actual:</span>
                <span className="text-sm text-red-600 font-semibold ml-2">{alerta.stock_actual}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Stock Mínimo:</span>
                <span className="text-sm text-gray-900 ml-2">{alerta.stock_minimo_al_generar}</span>
              </div>
              {alerta.producto.proveedor_preferido && (
                <div>
                  <span className="text-sm font-medium text-slate-700">Proveedor:</span>
                  <span className="text-sm text-gray-900 ml-2">
                    {alerta.producto.proveedor_preferido.nombre}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Campo de cantidad para crear orden */}
          {accion === 'crear_orden' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cantidad a Pedir
              </label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                placeholder="Cantidad sugerida"
              />
              <p className="text-xs text-slate-500 mt-1">
                Cantidad sugerida: {cantidadInicial}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-slate-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm ring-1 ring-slate-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={loading || (accion === 'crear_orden' && cantidad <= 0)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Procesando...
              </>
            ) : (
              <>
                {accion === 'crear_orden' && <ShoppingCart size={18} />}
                Confirmar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

