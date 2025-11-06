import { useState, useEffect } from 'react';
import { FileText, Plus, AlertCircle, ChevronLeft, ChevronRight, X, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import {
  obtenerConvenios,
  Convenio,
  FiltrosConvenios,
  PaginatedResponse,
  crearConvenio,
  actualizarConvenio,
  eliminarConvenio,
  NuevoConvenio,
} from '../api/conveniosApi';
import { obtenerMutuas, Mutua } from '../api/mutuasApi';
import FiltrosConvenios from '../components/FiltrosConvenios';
import ConveniosDataTable from '../components/ConveniosDataTable';
import ConvenioFormModal from '../components/ConvenioFormModal';
import DetalleCoberturaConvenio from '../components/DetalleCoberturaConvenio';

export default function ConveniosAcuerdosPage() {
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosConvenios>({
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
  const [convenioEditando, setConvenioEditando] = useState<Convenio | null>(null);
  const [convenioEliminar, setConvenioEliminar] = useState<Convenio | null>(null);
  const [convenioDetalle, setConvenioDetalle] = useState<Convenio | null>(null);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mutuas, setMutuas] = useState<Mutua[]>([]);

  const cargarMutuas = async () => {
    try {
      const respuesta = await obtenerMutuas({ limit: 1000 });
      setMutuas(respuesta.data);
    } catch (err) {
      console.error('Error al cargar mutuas:', err);
    }
  };

  const cargarConvenios = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta: PaginatedResponse<Convenio> = await obtenerConvenios(filtros);
      setConvenios(respuesta.data);
      setPaginacion({
        total: respuesta.total,
        page: respuesta.page,
        limit: respuesta.limit,
        totalPages: respuesta.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el listado de convenios');
      setConvenios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMutuas();
  }, []);

  useEffect(() => {
    cargarConvenios();
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosConvenios) => {
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

  const handleNuevoConvenio = () => {
    setConvenioEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarConvenio = (convenio: Convenio) => {
    setConvenioEditando(convenio);
    setMostrarFormulario(true);
  };

  const handleGuardarConvenio = async (datos: NuevoConvenio) => {
    setGuardando(true);
    try {
      if (convenioEditando) {
        await actualizarConvenio(convenioEditando._id!, datos);
      } else {
        await crearConvenio(datos);
      }
      setMostrarFormulario(false);
      setConvenioEditando(null);
      await cargarConvenios();
    } catch (err) {
      throw err; // Re-lanzar para que el formulario lo maneje
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setConvenioEditando(null);
  };

  const handleEliminarConvenio = (convenio: Convenio) => {
    setConvenioEliminar(convenio);
    setMostrarModalConfirmacion(true);
  };

  const confirmarEliminacion = async () => {
    if (!convenioEliminar) return;

    try {
      await eliminarConvenio(convenioEliminar._id!);
      setMostrarModalConfirmacion(false);
      setConvenioEliminar(null);
      await cargarConvenios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el convenio');
      setMostrarModalConfirmacion(false);
      setConvenioEliminar(null);
    }
  };

  const handleVerDetalle = async (convenio: Convenio) => {
    try {
      const { obtenerConvenioPorId } = await import('../api/conveniosApi');
      const detalle = await obtenerConvenioPorId(convenio._id!);
      setConvenioDetalle(detalle);
      setMostrarModalDetalle(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener el detalle del convenio');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Convenios y Acuerdos
            </h2>
            <p className="text-gray-600 mt-1">
              Gestiona los acuerdos comerciales con mutuas y seguros de salud
            </p>
          </div>
          <button
            onClick={handleNuevoConvenio}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Nuevo Convenio
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {convenios.length > 0 && (
        <div className="space-y-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-5 border border-blue-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-blue-700">Total Convenios</div>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900">{paginacion.total}</div>
              <div className="text-xs text-blue-600 mt-2">Registrados en el sistema</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-5 border border-green-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-green-700">Activos</div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-900">
                {convenios.filter(c => c.estado === 'activo').length}
              </div>
              <div className="text-xs text-green-600 mt-2">
                {paginacion.total > 0 
                  ? `${Math.round((convenios.filter(c => c.estado === 'activo').length / paginacion.total) * 100)}% del total`
                  : 'En vigor'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg p-5 border border-amber-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-amber-700">Borradores</div>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-900">
                {convenios.filter(c => c.estado === 'borrador').length}
              </div>
              <div className="text-xs text-amber-600 mt-2">Pendientes de aprobación</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg p-5 border border-indigo-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-indigo-700">Coberturas</div>
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-indigo-900">
                {convenios.reduce((sum, c) => sum + (c.coberturas?.length || 0), 0)}
              </div>
              <div className="text-xs text-indigo-600 mt-2">
                {convenios.length > 0 
                  ? `Promedio: ${Math.round(convenios.reduce((sum, c) => sum + (c.coberturas?.length || 0), 0) / convenios.length)} por convenio`
                  : 'Total configuradas'}
              </div>
            </div>
          </div>

          {/* Resumen de convenios por mutua */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Convenios por Mutua
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                const conveniosPorMutua = convenios.reduce((acc, convenio) => {
                  const nombreMutua = typeof convenio.mutua === 'object' 
                    ? convenio.mutua.nombreComercial 
                    : 'Desconocida';
                  if (!acc[nombreMutua]) {
                    acc[nombreMutua] = { nombre: nombreMutua, total: 0, activos: 0, coberturas: 0 };
                  }
                  acc[nombreMutua].total += 1;
                  if (convenio.estado === 'activo') acc[nombreMutua].activos += 1;
                  acc[nombreMutua].coberturas += convenio.coberturas?.length || 0;
                  return acc;
                }, {} as Record<string, { nombre: string; total: number; activos: number; coberturas: number }>);

                return Object.values(conveniosPorMutua).map((mutua) => (
                  <div key={mutua.nombre} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-semibold text-gray-900 mb-2">{mutua.nombre}</div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Convenios:</span>
                        <span className="font-medium">{mutua.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Activos:</span>
                        <span className="font-medium text-green-600">{mutua.activos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coberturas:</span>
                        <span className="font-medium text-indigo-600">{mutua.coberturas}</span>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

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
        <FiltrosConvenios
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          mutuas={mutuas}
        />

        {/* Tabla de convenios */}
        <ConveniosDataTable
          convenios={convenios}
          loading={loading}
          onEditar={handleEditarConvenio}
          onEliminar={handleEliminarConvenio}
          onVerDetalle={handleVerDetalle}
        />

        {/* Paginación */}
        {paginacion.totalPages > 1 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {convenios.length} de {paginacion.total} convenios
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
          <ConvenioFormModal
            convenio={convenioEditando}
            onGuardar={handleGuardarConvenio}
            onCancelar={handleCancelarFormulario}
            loading={guardando}
          />
        )}

        {/* Modal de confirmación de eliminación */}
        {mostrarModalConfirmacion && convenioEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Eliminar Convenio
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar el convenio "{convenioEliminar.nombre}"? 
                Esta acción cambiará el estado a 'inactivo' para mantener la integridad histórica de los datos.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setMostrarModalConfirmacion(false);
                    setConvenioEliminar(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarEliminacion}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalle */}
        {mostrarModalDetalle && convenioDetalle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detalle del Convenio
                </h2>
                <button
                  onClick={() => {
                    setMostrarModalDetalle(false);
                    setConvenioDetalle(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <p className="text-lg font-semibold text-gray-900">{convenioDetalle.nombre}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Código</label>
                    <p className="text-lg font-mono text-gray-900">{convenioDetalle.codigo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Mutua</label>
                    <p className="text-lg text-gray-900">
                      {typeof convenioDetalle.mutua === 'object' 
                        ? convenioDetalle.mutua.nombreComercial 
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      convenioDetalle.estado === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : convenioDetalle.estado === 'inactivo'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {convenioDetalle.estado}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Inicio</label>
                    <p className="text-lg text-gray-900">
                      {new Date(convenioDetalle.fechaInicio).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Fin</label>
                    <p className="text-lg text-gray-900">
                      {new Date(convenioDetalle.fechaFin).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                {convenioDetalle.notas && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Notas</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{convenioDetalle.notas}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Coberturas ({convenioDetalle.coberturas?.length || 0})
                  </h3>
                  {convenioDetalle.coberturas && convenioDetalle.coberturas.length > 0 ? (
                    <div className="space-y-3">
                      {convenioDetalle.coberturas.map((cobertura, index) => (
                        <DetalleCoberturaConvenio
                          key={cobertura._id || index}
                          cobertura={cobertura}
                          soloLectura={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No hay coberturas configuradas para este convenio
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

