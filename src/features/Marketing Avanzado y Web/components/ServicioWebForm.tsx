import { useState, useEffect } from 'react';
import { X, AlertTriangle, Upload, Trash2, Globe, Star } from 'lucide-react';
import {
  ServicioWeb,
  NuevoServicioWeb,
  CategoriaServicioWeb,
  obtenerCategoriasServiciosWeb,
} from '../api/serviciosWebAPI';

interface ServicioWebFormProps {
  servicio?: ServicioWeb;
  onGuardar: (servicio: NuevoServicioWeb) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

export default function ServicioWebForm({
  servicio,
  onGuardar,
  onCancelar,
  loading = false,
}: ServicioWebFormProps) {
  const [categorias, setCategorias] = useState<CategoriaServicioWeb[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NuevoServicioWeb>({
    nombre: servicio?.nombre || '',
    descripcionCorta: servicio?.descripcionCorta || '',
    descripcionLarga: servicio?.descripcionLarga || '',
    precio: servicio?.precio || 0,
    precioPromocional: servicio?.precioPromocional,
    categoria: typeof servicio?.categoria === 'object' && servicio.categoria
      ? servicio.categoria._id
      : servicio?.categoria || '',
    imagenes: servicio?.imagenes || [],
    videoURL: servicio?.videoURL || '',
    publicado: servicio?.publicado || false,
    destacado: servicio?.destacado || false,
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategoriasServiciosWeb();
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nombre.trim()) {
      setError('El nombre del servicio es obligatorio');
      return;
    }

    if (formData.precio <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    if (formData.precioPromocional && formData.precioPromocional >= formData.precio) {
      setError('El precio promocional debe ser menor al precio normal');
      return;
    }

    try {
      await onGuardar(formData);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el servicio');
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // En una implementación real, aquí subirías las imágenes a un servicio de almacenamiento
    // Por ahora, solo simulamos las URLs
    const nuevasImagenes = files.map((file) => URL.createObjectURL(file));
    setFormData({
      ...formData,
      imagenes: [...(formData.imagenes || []), ...nuevasImagenes],
    });
  };

  const handleEliminarImagen = (index: number) => {
    const nuevasImagenes = [...(formData.imagenes || [])];
    nuevasImagenes.splice(index, 1);
    setFormData({ ...formData, imagenes: nuevasImagenes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Información básica */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre del Servicio <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción Corta
          </label>
          <textarea
            value={formData.descripcionCorta || ''}
            onChange={(e) => setFormData({ ...formData, descripcionCorta: e.target.value })}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            rows={3}
            disabled={loading}
            placeholder="Breve descripción que aparecerá en las tarjetas..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción Larga
          </label>
          <textarea
            value={formData.descripcionLarga || ''}
            onChange={(e) => setFormData({ ...formData, descripcionLarga: e.target.value })}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            rows={8}
            disabled={loading}
            placeholder="Descripción detallada del servicio (puede incluir HTML)..."
          />
          <p className="text-xs text-slate-500 mt-1">
            Puede incluir formato HTML para enriquecer la descripción
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Categoría
          </label>
          <select
            value={formData.categoria || ''}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value || undefined })}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            disabled={loading}
          >
            <option value="">Sin categoría</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Precios */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Precios</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Precio Normal (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Precio Promocional (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.precioPromocional || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  precioPromocional: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              disabled={loading}
            />
            {formData.precioPromocional && formData.precioPromocional > 0 && (
              <p className="text-xs text-green-600 mt-1">
                Descuento: {((1 - formData.precioPromocional / formData.precio) * 100).toFixed(0)}%
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Multimedia */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Multimedia</h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Imágenes del Servicio
          </label>
          <div className="flex flex-wrap gap-4 mb-4">
            {formData.imagenes?.map((imagen, index) => (
              <div key={index} className="relative">
                <img
                  src={imagen}
                  alt={`Imagen ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => handleEliminarImagen(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <Upload className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">Añadir imágenes</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagenChange}
              className="hidden"
              disabled={loading}
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            URL del Video (Opcional)
          </label>
          <input
            type="url"
            value={formData.videoURL || ''}
            onChange={(e) => setFormData({ ...formData, videoURL: e.target.value || undefined })}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            disabled={loading}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      </div>

      {/* Configuración de publicación */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Configuración de Publicación</h3>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.publicado || false}
              onChange={(e) => setFormData({ ...formData, publicado: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Publicar en el sitio web
              </span>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.destacado || false}
              onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
              className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              disabled={loading}
            />
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">
                Marcar como destacado
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancelar}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-700 bg-white hover:bg-slate-50 ring-1 ring-slate-200"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <span>{servicio ? 'Actualizar Servicio' : 'Crear Servicio'}</span>
          )}
        </button>
      </div>
    </form>
  );
}



