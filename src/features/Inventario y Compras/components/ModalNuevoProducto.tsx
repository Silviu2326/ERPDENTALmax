import { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { NuevoProducto, crearProducto } from '../api/stockApi';

interface ModalNuevoProductoProps {
  onClose: () => void;
  onProductoCreado: () => void;
  proveedores: Array<{ _id: string; nombre: string }>;
  sedes: Array<{ _id: string; nombre: string }>;
  categorias: string[];
  sedeIdDefault?: string;
}

export default function ModalNuevoProducto({
  onClose,
  onProductoCreado,
  proveedores,
  sedes,
  categorias,
  sedeIdDefault,
}: ModalNuevoProductoProps) {
  const [formData, setFormData] = useState<NuevoProducto>({
    nombre: '',
    sku: '',
    descripcion: '',
    categoria: categorias[0] || '',
    proveedor: proveedores[0]?._id || '',
    unidadMedida: 'unidad',
    cantidadInicial: 0,
    puntoReorden: 0,
    costoUnitario: 0,
    fechaCaducidad: '',
    ubicacion: '',
    sedeId: sedeIdDefault || sedes[0]?._id || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unidadesMedida = ['unidad', 'kg', 'g', 'l', 'ml', 'paquete', 'caja'];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cantidadInicial' || name === 'puntoReorden' || name === 'costoUnitario'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await crearProducto(formData);
      onProductoCreado();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plus className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Nuevo Producto</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* SKU */}
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Código) *
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Categoría */}
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proveedor */}
              <div>
                <label htmlFor="proveedor" className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor *
                </label>
                <select
                  id="proveedor"
                  name="proveedor"
                  value={formData.proveedor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map((prov) => (
                    <option key={prov._id} value={prov._id}>
                      {prov.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sede */}
              <div>
                <label htmlFor="sedeId" className="block text-sm font-medium text-gray-700 mb-2">
                  Sede *
                </label>
                <select
                  id="sedeId"
                  name="sedeId"
                  value={formData.sedeId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {sedes.map((sede) => (
                    <option key={sede._id} value={sede._id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unidad de Medida */}
              <div>
                <label htmlFor="unidadMedida" className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad de Medida *
                </label>
                <select
                  id="unidadMedida"
                  name="unidadMedida"
                  value={formData.unidadMedida}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {unidadesMedida.map((unidad) => (
                    <option key={unidad} value={unidad}>
                      {unidad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantidad Inicial */}
              <div>
                <label htmlFor="cantidadInicial" className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad Inicial *
                </label>
                <input
                  type="number"
                  id="cantidadInicial"
                  name="cantidadInicial"
                  value={formData.cantidadInicial}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Punto de Reorden */}
              <div>
                <label htmlFor="puntoReorden" className="block text-sm font-medium text-gray-700 mb-2">
                  Punto de Reorden *
                </label>
                <input
                  type="number"
                  id="puntoReorden"
                  name="puntoReorden"
                  value={formData.puntoReorden}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Costo Unitario */}
              <div>
                <label htmlFor="costoUnitario" className="block text-sm font-medium text-gray-700 mb-2">
                  Costo Unitario *
                </label>
                <input
                  type="number"
                  id="costoUnitario"
                  name="costoUnitario"
                  value={formData.costoUnitario}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Fecha de Caducidad */}
              <div>
                <label htmlFor="fechaCaducidad" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Caducidad
                </label>
                <input
                  type="date"
                  id="fechaCaducidad"
                  name="fechaCaducidad"
                  value={formData.fechaCaducidad}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Ubicación */}
              <div>
                <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Almacén A, Estante 3"
                />
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                {loading ? 'Creando...' : 'Crear Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


