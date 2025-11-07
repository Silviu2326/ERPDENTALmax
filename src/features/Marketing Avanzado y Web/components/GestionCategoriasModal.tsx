import { useState, useEffect } from 'react';
import { X, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import {
  obtenerCategoriasServiciosWeb,
  crearCategoriaServicioWeb,
  actualizarCategoriaServicioWeb,
  eliminarCategoriaServicioWeb,
  CategoriaServicioWeb,
} from '../api/serviciosWebAPI';

interface GestionCategoriasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriaCreada?: () => void;
  onCategoriaActualizada?: () => void;
  onCategoriaEliminada?: () => void;
}

export default function GestionCategoriasModal({
  isOpen,
  onClose,
  onCategoriaCreada,
  onCategoriaActualizada,
  onCategoriaEliminada,
}: GestionCategoriasModalProps) {
  const [categorias, setCategorias] = useState<CategoriaServicioWeb[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaServicioWeb | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [mostrarConfirmarEliminar, setMostrarConfirmarEliminar] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      cargarCategorias();
    }
  }, [isOpen]);

  const cargarCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerCategoriasServiciosWeb();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (categoriaEditando?._id) {
        await actualizarCategoriaServicioWeb(categoriaEditando._id, formData);
        onCategoriaActualizada?.();
      } else {
        await crearCategoriaServicioWeb(formData);
        onCategoriaCreada?.();
      }
      await cargarCategorias();
      setMostrarFormulario(false);
      setCategoriaEditando(null);
      setFormData({ nombre: '', descripcion: '' });
    } catch (err: any) {
      setError(err.message || 'Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (categoria: CategoriaServicioWeb) => {
    setCategoriaEditando(categoria);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await eliminarCategoriaServicioWeb(id);
      onCategoriaEliminada?.();
      await cargarCategorias();
      setMostrarConfirmarEliminar(null);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setCategoriaEditando(null);
    setFormData({ nombre: '', descripcion: '' });
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Gestión de Categorías</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Botón para añadir categoría */}
          {!mostrarFormulario && (
            <button
              onClick={() => {
                setMostrarFormulario(true);
                setCategoriaEditando(null);
                setFormData({ nombre: '', descripcion: '' });
              }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              <Plus size={20} />
              <span>Añadir Categoría</span>
            </button>
          )}

          {/* Formulario de categoría */}
          {mostrarFormulario && (
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
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
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  rows={3}
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelar}
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
                  {loading ? 'Guardando...' : categoriaEditando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          )}

          {/* Lista de categorías */}
          {loading && !categorias.length ? (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Categorías Existentes</h3>
              {categorias.length === 0 ? (
                <div className="bg-white shadow-sm rounded-xl p-8 text-center">
                  <p className="text-gray-600">No hay categorías creadas</p>
                </div>
              ) : (
                categorias.map((categoria) => (
                  <div
                    key={categoria._id}
                    className="flex items-center justify-between p-4 bg-white shadow-sm ring-1 ring-slate-200 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{categoria.nombre}</h4>
                      {categoria.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">{categoria.descripcion}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditar(categoria)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        disabled={loading}
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {mostrarConfirmarEliminar === categoria._id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-red-600">¿Eliminar?</span>
                          <button
                            onClick={() => categoria._id && handleEliminar(categoria._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                            disabled={loading}
                          >
                            Sí
                          </button>
                          <button
                            onClick={() => setMostrarConfirmarEliminar(null)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                            disabled={loading}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setMostrarConfirmarEliminar(categoria._id || null)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={loading}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



