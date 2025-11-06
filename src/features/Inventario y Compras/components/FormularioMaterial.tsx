import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  NuevoMaterial,
  crearMaterial,
  obtenerProveedores,
  obtenerCategoriasMaterial,
  Proveedor,
  CategoriaMaterial,
} from '../api/materialesApi';

interface FormularioMaterialProps {
  onMaterialCreado?: (material: any) => void;
  onCancelar?: () => void;
}

export default function FormularioMaterial({
  onMaterialCreado,
  onCancelar,
}: FormularioMaterialProps) {
  const [formData, setFormData] = useState<NuevoMaterial>({
    nombre: '',
    sku: '',
    descripcion: '',
    categoria: '',
    unidadMedida: 'unidad',
    stockMinimo: 0,
    proveedorPreferido: undefined,
    costoUnitario: 0,
  });

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [categorias, setCategorias] = useState<CategoriaMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const unidadesMedida = [
    'unidad',
    'kg',
    'g',
    'l',
    'ml',
    'paquete',
    'caja',
    'botella',
    'ampolla',
    'rollo',
    'metro',
  ];

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingData(true);
      try {
        const [proveedoresData, categoriasData] = await Promise.all([
          obtenerProveedores(),
          obtenerCategoriasMaterial(),
        ]);
        setProveedores(proveedoresData);
        setCategorias(categoriasData);

        // Si hay categorías, seleccionar la primera por defecto
        if (categoriasData.length > 0 && !formData.categoria) {
          setFormData((prev) => ({ ...prev, categoria: categoriasData[0]._id }));
        }
      } catch (err) {
        setError('Error al cargar los datos del formulario. Por favor, recarga la página.');
        console.error('Error al cargar datos:', err);
      } finally {
        setLoadingData(false);
      }
    };

    cargarDatos();
  }, []);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!formData.sku.trim()) {
      nuevosErrores.sku = 'El SKU es obligatorio';
    }

    if (!formData.categoria) {
      nuevosErrores.categoria = 'Debes seleccionar una categoría';
    }

    if (!formData.unidadMedida) {
      nuevosErrores.unidadMedida = 'Debes seleccionar una unidad de medida';
    }

    if (formData.stockMinimo < 0) {
      nuevosErrores.stockMinimo = 'El stock mínimo no puede ser negativo';
    }

    if (formData.costoUnitario < 0) {
      nuevosErrores.costoUnitario = 'El costo unitario no puede ser negativo';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'stockMinimo' || name === 'costoUnitario'
          ? parseFloat(value) || 0
          : name === 'proveedorPreferido' && value === ''
          ? undefined
          : value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores((prev) => {
        const nuevos = { ...prev };
        delete nuevos[name];
        return nuevos;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validarFormulario()) {
      setError('Por favor, corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const materialCreado = await crearMaterial(formData);
      setSuccess('Material creado exitosamente');

      // Limpiar formulario
      setFormData({
        nombre: '',
        sku: '',
        descripcion: '',
        categoria: categorias[0]?._id || '',
        unidadMedida: 'unidad',
        stockMinimo: 0,
        proveedorPreferido: undefined,
        costoUnitario: 0,
      });

      // Notificar al componente padre
      if (onMaterialCreado) {
        onMaterialCreado(materialCreado);
      }

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      const mensajeError =
        err instanceof Error
          ? err.message
          : 'Error al crear el material. Por favor, intenta nuevamente.';
      setError(mensajeError);

      // Si el error es por SKU duplicado, marcar el campo
      if (mensajeError.toLowerCase().includes('sku') && mensajeError.toLowerCase().includes('duplicado')) {
        setErrores((prev) => ({ ...prev, sku: 'Este SKU ya existe en el sistema' }));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Nuevo Material</h2>
        <p className="text-gray-600 mt-1">
          Registra un nuevo material en el inventario con todos sus detalles
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Éxito</p>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="md:col-span-2">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Material *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.nombre ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Resina Composite A2"
              required
            />
            {errores.nombre && (
              <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
            )}
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.sku ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: MAT-001"
              required
            />
            {errores.sku && (
              <p className="mt-1 text-sm text-red-600">{errores.sku}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Identificador único del material (Stock Keeping Unit)
            </p>
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.categoria ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {errores.categoria && (
              <p className="mt-1 text-sm text-red-600">{errores.categoria}</p>
            )}
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.unidadMedida ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              {unidadesMedida.map((unidad) => (
                <option key={unidad} value={unidad}>
                  {unidad.charAt(0).toUpperCase() + unidad.slice(1)}
                </option>
              ))}
            </select>
            {errores.unidadMedida && (
              <p className="mt-1 text-sm text-red-600">{errores.unidadMedida}</p>
            )}
          </div>

          {/* Stock Mínimo */}
          <div>
            <label htmlFor="stockMinimo" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Mínimo *
            </label>
            <input
              type="number"
              id="stockMinimo"
              name="stockMinimo"
              value={formData.stockMinimo}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.stockMinimo ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errores.stockMinimo && (
              <p className="mt-1 text-sm text-red-600">{errores.stockMinimo}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Nivel mínimo de stock antes de generar alerta de reabastecimiento
            </p>
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.costoUnitario ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errores.costoUnitario && (
              <p className="mt-1 text-sm text-red-600">{errores.costoUnitario}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Precio de compra por unidad</p>
          </div>

          {/* Proveedor Preferido */}
          <div className="md:col-span-2">
            <label htmlFor="proveedorPreferido" className="block text-sm font-medium text-gray-700 mb-2">
              Proveedor Preferido (Opcional)
            </label>
            <select
              id="proveedorPreferido"
              name="proveedorPreferido"
              value={formData.proveedorPreferido || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sin proveedor preferido</option>
              {proveedores.map((prov) => (
                <option key={prov._id} value={prov._id}>
                  {prov.nombre}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Proveedor recomendado para la recompra de este material
            </p>
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción detallada del material, características, uso, etc."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          {onCancelar && (
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Material'}
          </button>
        </div>
      </form>
    </div>
  );
}


