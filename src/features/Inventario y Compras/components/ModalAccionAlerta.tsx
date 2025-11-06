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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {accion === 'crear_orden' && <ShoppingCart className="w-6 h-6 text-green-600" />}
            {accion === 'revisar' && <Clock className="w-6 h-6 text-yellow-600" />}
            {accion === 'resolver' && <CheckCircle className="w-6 h-6 text-blue-600" />}
            <h3 className="text-lg font-semibold text-gray-900">{getTitulo()}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">{getDescripcion()}</p>

          {/* Información de la alerta */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Producto:</span>
                <span className="text-sm text-gray-900 ml-2">{alerta.producto.nombre}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Sede:</span>
                <span className="text-sm text-gray-900 ml-2">{alerta.sede.nombre}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Stock Actual:</span>
                <span className="text-sm text-red-600 font-semibold ml-2">{alerta.stock_actual}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Stock Mínimo:</span>
                <span className="text-sm text-gray-900 ml-2">{alerta.stock_minimo_al_generar}</span>
              </div>
              {alerta.producto.proveedor_preferido && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Proveedor:</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad a Pedir
              </label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cantidad sugerida"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cantidad sugerida: {cantidadInicial}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={loading || (accion === 'crear_orden' && cantidad <= 0)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Procesando...
              </>
            ) : (
              <>
                {accion === 'crear_orden' && <ShoppingCart className="w-4 h-4" />}
                Confirmar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

