import { useState, useEffect } from 'react';
import { Building2, Plus, AlertCircle, ChevronLeft, ChevronRight, Loader2, Package } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Building2 size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Gestión de Mutuas y Seguros de Salud
                  </h1>
                  <p className="text-gray-600">
                    Administra las compañías de seguros y mutuas con las que trabajas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleNuevaMutua}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              <Plus size={20} />
              Nueva Mutua/Seguro
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
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
            <div className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(paginacion.page - 1)}
                  disabled={paginacion.page === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
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
                          <span className="px-2 text-slate-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            paginacion.page === page
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${
                  mutuaEliminar.activo ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    mutuaEliminar.activo ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {mutuaEliminar.activo ? 'Desactivar Mutua' : 'Reactivar Mutua'}
                </h3>
              </div>
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



