import { useState, useEffect } from 'react';
import { FileText, Plus, AlertCircle, ChevronLeft, ChevronRight, X, CheckCircle, XCircle, Clock, Shield, Loader2, Package } from 'lucide-react';
import {
  obtenerConvenios,
  Convenio,
  FiltrosConvenios as FiltrosConveniosType,
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
  const [filtros, setFiltros] = useState<FiltrosConveniosType>({
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

  const handleFiltrosChange = (nuevosFiltros: FiltrosConveniosType) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Convenios y Acuerdos
                </h1>
                <p className="text-gray-600">
                  Gestiona los acuerdos comerciales con mutuas y seguros de salud
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleNuevoConvenio}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200"
            >
              <Plus size={20} />
              Nuevo Convenio
            </button>
          </div>

          {/* Estadísticas/KPIs */}
          {convenios.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Total Convenios</h3>
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">{paginacion.total}</span>
                </div>
                <p className="text-xs text-gray-600">Registrados en el sistema</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Activos</h3>
                  <div className="bg-green-600 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {convenios.filter(c => c.estado === 'activo').length}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {paginacion.total > 0 
                    ? `${Math.round((convenios.filter(c => c.estado === 'activo').length / paginacion.total) * 100)}% del total`
                    : 'En vigor'}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Borradores</h3>
                  <div className="bg-yellow-600 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {convenios.filter(c => c.estado === 'borrador').length}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Pendientes de aprobación</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700">Coberturas</h3>
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {convenios.reduce((sum, c) => sum + (c.coberturas?.length || 0), 0)}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {convenios.length > 0 
                    ? `Promedio: ${Math.round(convenios.reduce((sum, c) => sum + (c.coberturas?.length || 0), 0) / convenios.length)} por convenio`
                    : 'Total configuradas'}
                </p>
              </div>
            </div>
          )}

          {/* Resumen de convenios por mutua */}
          {convenios.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
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
                          <span className="font-medium text-blue-600">{mutua.coberturas}</span>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
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
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(paginacion.page - 1)}
                  disabled={paginacion.page === 1}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                            paginacion.page === page
                              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
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
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 text-center text-sm text-gray-600">
                Mostrando {convenios.length} de {paginacion.total} convenios
              </div>
            </div>
          )}
        </div>
      </div>


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
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-red-600 text-white hover:bg-red-700 shadow-sm ring-1 ring-red-200"
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                  <p className="text-lg font-semibold text-gray-900">{convenioDetalle.nombre}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Código</label>
                  <p className="text-lg font-mono text-gray-900">{convenioDetalle.codigo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mutua</label>
                  <p className="text-lg text-gray-900">
                    {typeof convenioDetalle.mutua === 'object' 
                      ? convenioDetalle.mutua.nombreComercial 
                      : '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Inicio</label>
                  <p className="text-lg text-gray-900">
                    {new Date(convenioDetalle.fechaInicio).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Fin</label>
                  <p className="text-lg text-gray-900">
                    {new Date(convenioDetalle.fechaFin).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>

              {convenioDetalle.notas && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notas</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{convenioDetalle.notas}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Coberturas ({convenioDetalle.coberturas?.length || 0})
                </h3>
                {convenioDetalle.coberturas && convenioDetalle.coberturas.length > 0 ? (
                  <div className="space-y-4">
                    {convenioDetalle.coberturas.map((cobertura, index) => (
                      <DetalleCoberturaConvenio
                        key={cobertura._id || index}
                        cobertura={cobertura}
                        soloLectura={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay coberturas</h3>
                    <p className="text-gray-600">No hay coberturas configuradas para este convenio</p>
                  </div>
                )}
              </div>
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
    </div>
  );
}

