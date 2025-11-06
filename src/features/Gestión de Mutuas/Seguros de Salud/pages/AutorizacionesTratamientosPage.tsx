import { useState, useEffect } from 'react';
import { FileCheck, Plus, AlertCircle, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import {
  obtenerAutorizaciones,
  crearAutorizacion,
  actualizarAutorizacion,
  subirDocumentosAutorizacion,
  Autorizacion,
  FiltrosAutorizaciones,
  NuevaAutorizacion,
  ActualizarAutorizacion,
} from '../api/autorizacionesApi';
import TablaAutorizaciones from '../components/TablaAutorizaciones';
import FormularioAutorizacion from '../components/FormularioAutorizacion';
import ModalDetalleAutorizacion from '../components/ModalDetalleAutorizacion';
import FiltrosAutorizacionesComponent from '../components/FiltrosAutorizaciones';

export default function AutorizacionesTratamientosPage() {
  const [autorizaciones, setAutorizaciones] = useState<Autorizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosAutorizaciones>({
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
  const [autorizacionEditando, setAutorizacionEditando] = useState<Autorizacion | null>(null);
  const [autorizacionDetalle, setAutorizacionDetalle] = useState<Autorizacion | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Datos para los selectores (en un caso real, estos vendrían de APIs)
  const [pacientes, setPacientes] = useState<Array<{ _id: string; nombre: string; apellidos: string }>>([]);
  const [mutuas, setMutuas] = useState<Array<{ _id: string; nombreComercial: string }>>([]);
  const [tratamientos, setTratamientos] = useState<Array<{ _id: string; nombre: string; descripcion?: string }>>([]);

  const cargarAutorizaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta = await obtenerAutorizaciones(filtros);
      setAutorizaciones(respuesta.data);
      setPaginacion({
        total: respuesta.total,
        page: respuesta.page,
        limit: respuesta.limit,
        totalPages: respuesta.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las autorizaciones');
      setAutorizaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAutorizaciones();
  }, [filtros]);

  // Cargar datos para los selectores (simulado - en producción vendría de APIs)
  useEffect(() => {
    // Cargar mutuas
    const cargarMutuas = async () => {
      try {
        const { obtenerMutuas } = await import('../api/mutuasApi');
        const respuesta = await obtenerMutuas({ limit: 1000 });
        setMutuas(respuesta.data.map(m => ({ _id: m._id!, nombreComercial: m.nombreComercial })));
      } catch (err) {
        console.error('Error al cargar mutuas:', err);
      }
    };

    // Cargar pacientes falsos
    const pacientesFalsos = [
      { _id: 'p1', nombre: 'Juan', apellidos: 'García López' },
      { _id: 'p2', nombre: 'María', apellidos: 'Rodríguez Sánchez' },
      { _id: 'p3', nombre: 'Carlos', apellidos: 'Fernández Torres' },
      { _id: 'p4', nombre: 'Ana', apellidos: 'López Martín' },
      { _id: 'p5', nombre: 'Pedro', apellidos: 'Sánchez Díaz' },
      { _id: 'p6', nombre: 'Laura', apellidos: 'Gómez Pérez' },
      { _id: 'p7', nombre: 'Miguel', apellidos: 'Torres Jiménez' },
      { _id: 'p8', nombre: 'Sofía', apellidos: 'Martínez Ruiz' },
    ];
    setPacientes(pacientesFalsos);

    // Cargar tratamientos falsos
    const cargarTratamientos = async () => {
      try {
        const { obtenerTratamientos } = await import('../api/conveniosApi');
        const tratamientosData = await obtenerTratamientos();
        setTratamientos(tratamientosData.map(t => ({ _id: t._id, nombre: t.nombre, descripcion: t.codigo })));
      } catch (err) {
        console.error('Error al cargar tratamientos:', err);
      }
    };

    cargarMutuas();
    cargarTratamientos();
  }, []);

  const handleFiltrosChange = (nuevosFiltros: FiltrosAutorizaciones) => {
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

  const handleNuevaAutorizacion = () => {
    setAutorizacionEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarAutorizacion = (autorizacion: Autorizacion) => {
    setAutorizacionEditando(autorizacion);
    setMostrarFormulario(true);
  };

  const handleVerDetalle = (autorizacion: Autorizacion) => {
    setAutorizacionDetalle(autorizacion);
  };

  const handleGuardarAutorizacion = async (datos: NuevaAutorizacion) => {
    setGuardando(true);
    try {
      if (autorizacionEditando) {
        // Las autorizaciones existentes no se pueden editar completamente, solo actualizar estado
        // Por ahora, solo permitimos crear nuevas
        throw new Error('La edición de autorizaciones no está permitida');
      } else {
        await crearAutorizacion(datos);
      }
      setMostrarFormulario(false);
      setAutorizacionEditando(null);
      await cargarAutorizaciones();
    } catch (err) {
      throw err; // Re-lanzar para que el formulario lo maneje
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setAutorizacionEditando(null);
  };

  const handleEstadoChange = async (
    autorizacionId: string,
    nuevoEstado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Requiere Información Adicional'
  ) => {
    try {
      const datosActualizar: ActualizarAutorizacion = {
        estado: nuevoEstado,
        fechaRespuesta: nuevoEstado !== 'Pendiente' ? new Date().toISOString() : undefined,
      };
      await actualizarAutorizacion(autorizacionId, datosActualizar);
      await cargarAutorizaciones();
      // Actualizar también el detalle si está abierto
      if (autorizacionDetalle && autorizacionDetalle._id === autorizacionId) {
        const autorizacionActualizada = await obtenerAutorizaciones({ page: 1, limit: 1 });
        const encontrada = autorizacionActualizada.data.find((a) => a._id === autorizacionId);
        if (encontrada) {
          setAutorizacionDetalle(encontrada);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado de la autorización');
    }
  };

  const handleSubirDocumentos = async (archivos: File[]) => {
    if (!autorizacionDetalle?._id) return;
    try {
      await subirDocumentosAutorizacion(autorizacionDetalle._id, archivos);
      // Recargar la autorización actualizada
      const actualizada = await obtenerAutorizaciones({ page: 1, limit: 1 });
      const encontrada = actualizada.data.find((a) => a._id === autorizacionDetalle._id);
      if (encontrada) {
        setAutorizacionDetalle(encontrada);
      }
      await cargarAutorizaciones();
    } catch (err) {
      throw err;
    }
  };

  const handleActualizarAutorizacion = async (datos: { codigoAutorizacion?: string; notas?: string; fechaRespuesta?: string }) => {
    if (!autorizacionDetalle?._id) return;
    try {
      const datosActualizar: ActualizarAutorizacion = {
        codigoAutorizacion: datos.codigoAutorizacion,
        notas: datos.notas,
        fechaRespuesta: datos.fechaRespuesta,
      };
      const actualizada = await actualizarAutorizacion(autorizacionDetalle._id, datosActualizar);
      setAutorizacionDetalle(actualizada);
      await cargarAutorizaciones();
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Autorizaciones de Tratamientos
            </h2>
            <p className="text-gray-600 mt-1">
              Gestiona las solicitudes de pre-autorización para tratamientos dentales
            </p>
          </div>
          <button
            onClick={handleNuevaAutorizacion}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Nueva Autorización
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {autorizaciones.length > 0 && (
        <div className="space-y-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-5 border border-blue-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-blue-700">Total Autorizaciones</div>
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900">{paginacion.total}</div>
              <div className="text-xs text-blue-600 mt-2">Registradas en el sistema</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-5 border border-green-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-green-700">Aprobadas</div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-900">
                {autorizaciones.filter(a => a.estado === 'Aprobada').length}
              </div>
              <div className="text-xs text-green-600 mt-2">
                {paginacion.total > 0 
                  ? `${Math.round((autorizaciones.filter(a => a.estado === 'Aprobada').length / paginacion.total) * 100)}% del total`
                  : 'Confirmadas'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg p-5 border border-amber-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-amber-700">Pendientes</div>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-900">
                {autorizaciones.filter(a => a.estado === 'Pendiente').length}
              </div>
              <div className="text-xs text-amber-600 mt-2">En revisión por aseguradora</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-5 border border-red-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-red-700">Rechazadas</div>
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-900">
                {autorizaciones.filter(a => a.estado === 'Rechazada').length}
              </div>
              <div className="text-xs text-red-600 mt-2">
                {autorizaciones.filter(a => a.estado === 'Requiere Información Adicional').length > 0 && (
                  <span className="block mt-1">
                    + {autorizaciones.filter(a => a.estado === 'Requiere Información Adicional').length} requieren info
                  </span>
                )}
                No aprobadas
              </div>
            </div>
          </div>

          {/* Resumen de tiempos de respuesta */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Resumen de Autorizaciones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Tiempo promedio de respuesta</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(() => {
                    const aprobadas = autorizaciones.filter(a => a.estado === 'Aprobada' && a.fechaRespuesta);
                    if (aprobadas.length === 0) return 'N/A';
                    const tiempos = aprobadas.map(a => {
                      const solicitud = new Date(a.fechaSolicitud);
                      const respuesta = new Date(a.fechaRespuesta!);
                      return Math.round((respuesta.getTime() - solicitud.getTime()) / (1000 * 60 * 60 * 24));
                    });
                    const promedio = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
                    return `${promedio.toFixed(1)} días`;
                  })()}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Autorizaciones con documentos</div>
                <div className="text-2xl font-bold text-gray-900">
                  {autorizaciones.filter(a => a.documentos && a.documentos.length > 0).length}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {paginacion.total > 0 
                    ? `${Math.round((autorizaciones.filter(a => a.documentos && a.documentos.length > 0).length / paginacion.total) * 100)}% del total`
                    : ''}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Tasa de aprobación</div>
                <div className="text-2xl font-bold text-gray-900">
                  {paginacion.total > 0 
                    ? `${Math.round((autorizaciones.filter(a => a.estado === 'Aprobada').length / paginacion.total) * 100)}%`
                    : '0%'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {autorizaciones.filter(a => a.estado === 'Aprobada').length} de {paginacion.total}
                </div>
              </div>
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

        {/* Filtros */}
        <FiltrosAutorizacionesComponent
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          pacientes={pacientes}
          mutuas={mutuas}
        />

        {/* Tabla de autorizaciones */}
        <TablaAutorizaciones
          autorizaciones={autorizaciones}
          loading={loading}
          onVerDetalle={handleVerDetalle}
          onEditar={handleEditarAutorizacion}
          onEstadoChange={(id, estado) => handleEstadoChange(id, estado)}
        />

        {/* Paginación */}
        {paginacion.totalPages > 1 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {autorizaciones.length} de {paginacion.total} autorizaciones
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
          <FormularioAutorizacion
            autorizacion={autorizacionEditando}
            onGuardar={handleGuardarAutorizacion}
            onCancelar={handleCancelarFormulario}
            loading={guardando}
            pacientes={pacientes}
            mutuas={mutuas}
            tratamientos={tratamientos}
          />
        )}

        {/* Modal de detalle */}
        {autorizacionDetalle && (
          <ModalDetalleAutorizacion
            autorizacion={autorizacionDetalle}
            onCerrar={() => setAutorizacionDetalle(null)}
            onEstadoChange={async (nuevoEstado) => {
              if (autorizacionDetalle._id) {
                await handleEstadoChange(autorizacionDetalle._id, nuevoEstado);
              }
            }}
            onSubirDocumentos={handleSubirDocumentos}
            onActualizar={handleActualizarAutorizacion}
            loading={guardando}
          />
        )}
    </div>
  );
}

