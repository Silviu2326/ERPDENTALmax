import { useState, useEffect } from 'react';
import { Building2, Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  obtenerMutuas,
  Mutua,
  FiltrosMutuas,
  PaginatedResponse,
  crearMutua,
  actualizarMutua,
  desactivarMutua,
  reactivarMutua,
  NuevaMutua,
} from '../api/mutuasApi';
import BarraBusquedaFiltros from '../components/BarraBusquedaFiltros';
import MutuasTable from '../components/MutuasTable';
import FormularioMutua from '../components/FormularioMutua';

export default function GestionMutuasSegurosSaludPage() {
  const [mutuas, setMutuas] = useState<Mutua[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosMutuas>({
    page: 1,
    limit: 10,
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mutuaEditando, setMutuaEditando] = useState<Mutua | null>(null);
  const [mutuaEliminar, setMutuaEliminar] = useState<Mutua | null>(null);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const cargarMutuas = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta: PaginatedResponse<Mutua> = await obtenerMutuas(filtros);
      setMutuas(respuesta.data);
      setPaginacion({
        total: respuesta.total,
        page: respuesta.page,
        limit: respuesta.limit,
        totalPages: respuesta.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el listado de mutuas');
      setMutuas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMutuas();
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosMutuas) => {
    setFiltros((prev) => ({
      ...prev,
      ...nuevosFiltros,
    }));
  };

  const handlePageChange = (page: number) => {
    setFiltros((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleNuevaMutua = () => {
    setMutuaEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarMutua = (mutua: Mutua) => {
    setMutuaEditando(mutua);
    setMostrarFormulario(true);
  };

  const handleGuardarMutua = async (datos: NuevaMutua) => {
    setGuardando(true);
    try {
      if (mutuaEditando) {
        await actualizarMutua(mutuaEditando._id!, datos);
      } else {
        await crearMutua(datos);
      }
      setMostrarFormulario(false);
      setMutuaEditando(null);
      await cargarMutuas();
    } catch (err) {
      throw err; // Re-lanzar para que el formulario lo maneje
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setMutuaEditando(null);
  };

  const handleEliminarMutua = (mutua: Mutua) => {
    setMutuaEliminar(mutua);
    setMostrarModalConfirmacion(true);
  };

  const confirmarEliminacion = async () => {
    if (!mutuaEliminar) return;

    try {
      if (mutuaEliminar.activo) {
        await desactivarMutua(mutuaEliminar._id!);
      } else {
        await reactivarMutua(mutuaEliminar._id!);
      }
      setMostrarModalConfirmacion(false);
      setMutuaEliminar(null);
      await cargarMutuas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar el estado de la mutua');
      setMostrarModalConfirmacion(false);
      setMutuaEliminar(null);
    }
  };

  const handleVerDetalle = (mutua: Mutua) => {
    // TODO: Implementar vista de detalle o modal con información completa
    console.log('Ver detalle de mutua:', mutua);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestión de Mutuas y Seguros de Salud
                </h1>
                <p className="text-gray-600 mt-1">
                  Administra las compañías de seguros y mutuas con las que trabajas
                </p>
              </div>
            </div>
            <button
              onClick={handleNuevaMutua}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Nueva Mutua/Seguro
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <BarraBusquedaFiltros filtros={filtros} onFiltrosChange={handleFiltrosChange} />

        {/* Tabla de mutuas */}
        <MutuasTable
          mutuas={mutuas}
          loading={loading}
          onEditar={handleEditarMutua}
          onEliminar={handleEliminarMutua}
          onVerDetalle={handleVerDetalle}
        />

        {/* Paginación */}
        {paginacion.totalPages > 1 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {mutuas.length} de {paginacion.total} mutuas
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(paginacion.page - 1)}
                  disabled={paginacion.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: paginacion.totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === paginacion.totalPages ||
                        (page >= paginacion.page - 1 && page <= paginacion.page + 1)
                    )
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center gap-1">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            paginacion.page === page
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => handlePageChange(paginacion.page + 1)}
                  disabled={paginacion.page === paginacion.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de formulario */}
        {mostrarFormulario && (
          <FormularioMutua
            mutua={mutuaEditando}
            onGuardar={handleGuardarMutua}
            onCancelar={handleCancelarFormulario}
            loading={guardando}
          />
        )}

        {/* Modal de confirmación de eliminación */}
        {mostrarModalConfirmacion && mutuaEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {mutuaEliminar.activo ? 'Desactivar Mutua' : 'Reactivar Mutua'}
              </h3>
              <p className="text-gray-600 mb-6">
                {mutuaEliminar.activo
                  ? `¿Estás seguro de que deseas desactivar "${mutuaEliminar.nombreComercial}"? La mutua no aparecerá en las opciones para nuevos pacientes, pero se mantendrá en el historial.`
                  : `¿Deseas reactivar "${mutuaEliminar.nombreComercial}"?`}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setMostrarModalConfirmacion(false);
                    setMutuaEliminar(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarEliminacion}
                  className={`px-6 py-2 rounded-lg text-white transition-colors ${
                    mutuaEliminar.activo
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {mutuaEliminar.activo ? 'Desactivar' : 'Reactivar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


