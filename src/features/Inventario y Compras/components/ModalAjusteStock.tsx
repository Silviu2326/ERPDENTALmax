import { useState } from 'react';
import { X, Package, AlertCircle } from 'lucide-react';
import { ProductoInventario, AjusteStock, realizarAjusteStock } from '../api/stockApi';

interface ModalAjusteStockProps {
  producto: ProductoInventario | null;
  onClose: () => void;
  onAjusteCompletado: () => void;
  usuarioId: string;
}

export default function ModalAjusteStock({
  producto,
  onClose,
  onAjusteCompletado,
  usuarioId,
}: ModalAjusteStockProps) {
  const [nuevaCantidad, setNuevaCantidad] = useState<string>('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!producto) return null;

  const cantidadActual = parseFloat(nuevaCantidad) || producto.cantidadActual;
  const diferencia = cantidadActual - producto.cantidadActual;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nuevaCantidad || parseFloat(nuevaCantidad) < 0) {
      setError('La cantidad debe ser un número positivo');
      return;
    }

    if (!motivo.trim()) {
      setError('El motivo es obligatorio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ajuste: AjusteStock = {
        productoId: producto._id || '',
        nuevaCantidad: parseFloat(nuevaCantidad),
        motivo: motivo.trim(),
        usuarioId,
      };

      await realizarAjusteStock(ajuste);
      onAjusteCompletado();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al realizar el ajuste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Ajustar Stock</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Información del producto */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{producto.nombre}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">SKU:</span>
                <span className="ml-2 font-medium">{producto.sku}</span>
              </div>
              <div>
                <span className="text-gray-600">Unidad:</span>
                <span className="ml-2 font-medium">{producto.unidadMedida}</span>
              </div>
              <div>
                <span className="text-gray-600">Stock Actual:</span>
                <span className="ml-2 font-bold text-blue-600">
                  {producto.cantidadActual} {producto.unidadMedida}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Punto Reorden:</span>
                <span className="ml-2 font-medium">{producto.puntoReorden} {producto.unidadMedida}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Nueva cantidad */}
              <div>
                <label htmlFor="nuevaCantidad" className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Cantidad *
                </label>
                <input
                  type="number"
                  id="nuevaCantidad"
                  value={nuevaCantidad}
                  onChange={(e) => setNuevaCantidad(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={producto.cantidadActual.toString()}
                  required
                />
                {cantidadActual !== producto.cantidadActual && (
                  <p
                    className={`mt-2 text-sm ${
                      diferencia > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {diferencia > 0 ? '+' : ''}
                    {diferencia.toFixed(2)} {producto.unidadMedida}
                  </p>
                )}
              </div>

              {/* Motivo */}
              <div>
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo del Ajuste *
                </label>
                <textarea
                  id="motivo"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Merma por producto dañado, Conteo físico, Corrección de error..."
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Ajuste'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

