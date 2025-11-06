import { useState, useEffect } from 'react';
import { Save, X, Package, AlertCircle } from 'lucide-react';
import { Producto, NuevoProducto, CategoriaProducto, UnidadMedida } from '../api/productosApi';
import { obtenerProveedores, Proveedor as ProveedorType } from '../api/proveedoresApi';

interface FormularioProductoProps {
  producto?: Producto;
  onGuardar: (producto: NuevoProducto) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

export default function FormularioProducto({
  producto,
  onGuardar,
  onCancelar,
  loading = false,
}: FormularioProductoProps) {
  const [formData, setFormData] = useState<NuevoProducto>({
    nombre: producto?.nombre || '',
    sku: producto?.sku || '',
    descripcion: producto?.descripcion || '',
    categoria: producto?.categoria || 'Consumible',
    proveedorId: producto?.proveedorId || '',
    costoUnitario: producto?.costoUnitario || 0,
    stockActual: producto?.stockActual || 0,
    stockMinimo: producto?.stockMinimo || 0,
    unidadMedida: producto?.unidadMedida || 'unidad',
    lote: producto?.lote || '',
    fechaCaducidad: producto?.fechaCaducidad || '',
    activo: producto?.activo !== false,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [proveedores, setProveedores] = useState<ProveedorType[]>([]);
  const [cargandoProveedores, setCargandoProveedores] = useState(false);

  const categorias: CategoriaProducto[] = ['Consumible', 'Instrumental', 'Equipamiento', 'Oficina'];
  const unidadesMedida: UnidadMedida[] = ['unidad', 'caja', 'paquete', 'litro'];

  useEffect(() => {
    const cargarProveedores = async () => {
      setCargandoProveedores(true);
      try {
        const respuesta = await obtenerProveedores({ limit: 1000, estado: 'activo' });
        setProveedores(respuesta.proveedores);
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
      } finally {
        setCargandoProveedores(false);
      }
    };

    cargarProveedores();
  }, []);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre del producto es obligatorio';
    }

    if (!formData.sku.trim()) {
      nuevosErrores.sku = 'El SKU es obligatorio';
    }

    if (formData.costoUnitario < 0) {
      nuevosErrores.costoUnitario = 'El costo unitario no puede ser negativo';
    }

    if (formData.stockActual < 0) {
      nuevosErrores.stockActual = 'El stock actual no puede ser negativo';
    }

    if (formData.stockMinimo < 0) {
      nuevosErrores.stockMinimo = 'El stock mínimo no puede ser negativo';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    if (!validarFormulario()) {
      setErrorGeneral('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      await onGuardar(formData);
    } catch (error: any) {
      setErrorGeneral(error.message || 'Error al guardar el producto');
    }
  };

  const handleChange = (campo: keyof NuevoProducto, valor: any) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: valor,
    }));
    // Limpiar error del campo
    if (errores[campo]) {
      setErrores((prev) => {
        const nuevos = { ...prev };
        delete nuevos[campo];
        return nuevos;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6" />
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onCancelar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errorGeneral && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorGeneral}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Información básica */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Guantes de látex quirúrgicos"
                  />
                  {errores.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleChange('sku', e.target.value.toUpperCase())}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores.sku ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: GLAT-001"
                  />
                  {errores.sku && (
                    <p className="mt-1 text-sm text-red-600">{errores.sku}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => handleChange('descripcion', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción detallada del producto..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => handleChange('categoria', e.target.value as CategoriaProducto)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor
                  </label>
                  <select
                    value={formData.proveedorId || ''}
                    onChange={(e) => handleChange('proveedorId', e.target.value || undefined)}
                    disabled={cargandoProveedores}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar proveedor...</option>
                    {proveedores.map((prov) => (
                      <option key={prov._id} value={prov._id}>
                        {prov.nombreComercial}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Información de stock y costos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock y Costos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo Unitario <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.costoUnitario}
                      onChange={(e) => handleChange('costoUnitario', parseFloat(e.target.value) || 0)}
                      className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errores.costoUnitario ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errores.costoUnitario && (
                    <p className="mt-1 text-sm text-red-600">{errores.costoUnitario}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad de Medida <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.unidadMedida}
                    onChange={(e) => handleChange('unidadMedida', e.target.value as UnidadMedida)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {unidadesMedida.map((unidad) => (
                      <option key={unidad} value={unidad}>
                        {unidad}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Actual
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockActual || 0}
                    onChange={(e) => handleChange('stockActual', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores.stockActual ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errores.stockActual && (
                    <p className="mt-1 text-sm text-red-600">{errores.stockActual}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Mínimo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockMinimo}
                    onChange={(e) => handleChange('stockMinimo', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores.stockMinimo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errores.stockMinimo && (
                    <p className="mt-1 text-sm text-red-600">{errores.stockMinimo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lote
                  </label>
                  <input
                    type="text"
                    value={formData.lote || ''}
                    onChange={(e) => handleChange('lote', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Número de lote..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Caducidad
                  </label>
                  <input
                    type="date"
                    value={formData.fechaCaducidad || ''}
                    onChange={(e) => handleChange('fechaCaducidad', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.activo !== false}
                  onChange={(e) => handleChange('activo', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Producto activo</span>
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

