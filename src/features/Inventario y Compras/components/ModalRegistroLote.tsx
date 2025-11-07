import { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { NuevaLote, crearLote } from '../api/lotesApi';

interface ModalRegistroLoteProps {
  onClose: () => void;
  onLoteCreado: () => void;
  productos: Array<{ _id: string; nombre: string; sku?: string }>;
  productoIdPreSeleccionado?: string;
}

export default function ModalRegistroLote({
  onClose,
  onLoteCreado,
  productos,
  productoIdPreSeleccionado,
}: ModalRegistroLoteProps) {
  const [formData, setFormData] = useState<NuevaLote>({
    producto: productoIdPreSeleccionado || productos[0]?._id || '',
    numeroLote: '',
    fechaCaducidad: '',
    cantidadInicial: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'cantidadInicial' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    if (!formData.producto) {
      setError('Debe seleccionar un producto');
      setLoading(false);
      return;
    }

    if (!formData.numeroLote.trim()) {
      setError('El número de lote es obligatorio');
      setLoading(false);
      return;
    }

    if (!formData.fechaCaducidad) {
      setError('La fecha de caducidad es obligatoria');
      setLoading(false);
      return;
    }

    if (formData.cantidadInicial <= 0) {
      setError('La cantidad inicial debe ser mayor a cero');
      setLoading(false);
      return;
    }

    // Validar que la fecha de caducidad no sea en el pasado
    const fechaCaducidad = new Date(formData.fechaCaducidad);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaCaducidad < hoy) {
      setError('La fecha de caducidad no puede ser en el pasado');
      setLoading(false);
      return;
    }

    try {
      await crearLote(formData);
      onLoteCreado();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el lote');
    } finally {
      setLoading(false);
    }
  };

  const productoSeleccionado = productos.find((p) => p._id === formData.producto);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plus className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Lote</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="producto" className="block text-sm font-medium text-gray-700 mb-2">
              Producto <span className="text-red-500">*</span>
            </label>
            <select
              id="producto"
              name="producto"
              value={formData.producto}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto._id} value={producto._id}>
                  {producto.nombre} {producto.sku && `(${producto.sku})`}
                </option>
              ))}
            </select>
            {productoSeleccionado && (
              <p className="mt-1 text-sm text-gray-500">
                Producto seleccionado: {productoSeleccionado.nombre}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="numeroLote" className="block text-sm font-medium text-gray-700 mb-2">
              Número de Lote <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="numeroLote"
              name="numeroLote"
              value={formData.numeroLote}
              onChange={handleChange}
              required
              placeholder="Ej: LOTE-2024-001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
            <p className="mt-1 text-xs text-gray-500">
              Ingrese el número de lote único del producto según el proveedor
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fechaCaducidad" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Caducidad <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="fechaCaducidad"
                name="fechaCaducidad"
                value={formData.fechaCaducidad}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="cantidadInicial" className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad Inicial <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="cantidadInicial"
                name="cantidadInicial"
                value={formData.cantidadInicial}
                onChange={handleChange}
                required
                min="1"
                step="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Al registrar un lote, el sistema automáticamente actualizará
              el stock total del producto y generará alertas si el lote está próximo a caducar.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Registrar Lote
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



