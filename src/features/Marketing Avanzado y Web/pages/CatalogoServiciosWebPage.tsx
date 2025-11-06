import { useState, useEffect } from 'react';
import { Plus, FolderTree, AlertCircle, X } from 'lucide-react';
import {
  obtenerServiciosWeb,
  crearServicioWeb,
  actualizarServicioWeb,
  eliminarServicioWeb,
  ServicioWeb,
  FiltrosServiciosWeb,
  NuevoServicioWeb,
} from '../api/serviciosWebAPI';
import ListaServiciosWeb from '../components/ListaServiciosWeb';
import ServicioWebForm from '../components/ServicioWebForm';
import GestionCategoriasModal from '../components/GestionCategoriasModal';

export default function CatalogoServiciosWebPage() {
  const [servicios, setServicios] = useState<ServicioWeb[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [servicioEditando, setServicioEditando] = useState<ServicioWeb | null>(null);
  const [mostrarGestionCategorias, setMostrarGestionCategorias] = useState(false);
  const [mostrarConfirmarEliminar, setMostrarConfirmarEliminar] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosServiciosWeb>({
    page: 1,
    limit: 12,
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });

  useEffect(() => {
    cargarServicios();
  }, [filtros]);

  const cargarServicios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerServiciosWeb(filtros);
      setServicios(response.data);
      setPaginacion({
        total: response.total,
        totalPages: response.totalPages,
        currentPage: response.page,
      });
    } catch (err: any) {
      setError(err.message || 'Error al cargar los servicios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarServicio = async (servicioData: NuevoServicioWeb) => {
    setLoading(true);
    setError(null);
    try {
      if (servicioEditando?._id) {
        await actualizarServicioWeb(servicioEditando._id, servicioData);
      } else {
        await crearServicioWeb(servicioData);
      }
      await cargarServicios();
      setMostrarFormulario(false);
      setServicioEditando(null);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el servicio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id: string) => {
    const servicio = servicios.find((s) => s._id === id);
    if (servicio) {
      setServicioEditando(servicio);
      setMostrarFormulario(true);
    }
  };

  const handleEliminar = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await eliminarServicioWeb(id);
      await cargarServicios();
      setMostrarConfirmarEliminar(null);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoServicio = () => {
    setServicioEditando(null);
    setMostrarFormulario(true);
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setServicioEditando(null);
    setError(null);
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros({ ...filtros, page: nuevaPagina });
  };

  if (mostrarFormulario) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {servicioEditando ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>
            <button
              onClick={handleCancelarFormulario}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <ServicioWebForm
            servicio={servicioEditando || undefined}
            onGuardar={handleGuardarServicio}
            onCancelar={handleCancelarFormulario}
            loading={loading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Servicios en Web</h1>
          <p className="text-gray-600 mt-2">
            Gestiona los servicios y tratamientos que se mostrarán en tu sitio web público
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMostrarGestionCategorias(true)}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FolderTree className="w-5 h-5" />
            <span>Categorías</span>
          </button>
          <button
            onClick={handleNuevoServicio}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Añadir Servicio</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-600">Total Servicios</div>
          <div className="text-2xl font-bold text-gray-900">{paginacion.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-600">Publicados</div>
          <div className="text-2xl font-bold text-green-600">
            {servicios.filter((s) => s.publicado).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-600">Borradores</div>
          <div className="text-2xl font-bold text-gray-600">
            {servicios.filter((s) => !s.publicado).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-600">Destacados</div>
          <div className="text-2xl font-bold text-yellow-600">
            {servicios.filter((s) => s.destacado).length}
          </div>
        </div>
      </div>

      {/* Lista de servicios */}
      <ListaServiciosWeb
        servicios={servicios}
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onEditar={handleEditar}
        onEliminar={(id) => setMostrarConfirmarEliminar(id)}
        loading={loading}
      />

      {/* Paginación */}
      {paginacion.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handleCambiarPagina(paginacion.currentPage - 1)}
            disabled={paginacion.currentPage === 1 || loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-gray-700">
            Página {paginacion.currentPage} de {paginacion.totalPages}
          </span>
          <button
            onClick={() => handleCambiarPagina(paginacion.currentPage + 1)}
            disabled={paginacion.currentPage === paginacion.totalPages || loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {mostrarConfirmarEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMostrarConfirmarEliminar(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={() => mostrarConfirmarEliminar && handleEliminar(mostrarConfirmarEliminar)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestión de categorías */}
      <GestionCategoriasModal
        isOpen={mostrarGestionCategorias}
        onClose={() => setMostrarGestionCategorias(false)}
        onCategoriaCreada={cargarServicios}
        onCategoriaActualizada={cargarServicios}
        onCategoriaEliminada={cargarServicios}
      />
    </div>
  );
}


