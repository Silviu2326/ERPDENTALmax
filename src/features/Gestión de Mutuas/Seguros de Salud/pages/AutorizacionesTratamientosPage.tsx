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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileCheck size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Autorizaciones de Tratamientos
                  </h1>
                  <p className="text-gray-600">
                    Gestiona las solicitudes de pre-autorización para tratamientos dentales
                  </p>
                </div>
              </div>
              
              {/* Botón de acción principal */}
              <div className="flex items-center justify-end">
                <button
                  onClick={handleNuevaAutorizacion}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-medium"
                >
                  <Plus size={20} />
                  Nueva Autorización
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8 space-y-6">

        {/* Métricas/KPIs */}
        {paginacion.total > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-slate-700">Total Autorizaciones</div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileCheck size={20} className="text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{paginacion.total}</div>
              <div className="text-xs text-slate-600 mt-1">Registradas en el sistema</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-slate-700">Aprobadas</div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {autorizaciones.filter(a => a.estado === 'Aprobada').length}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                {paginacion.total > 0 
                  ? `${Math.round((autorizaciones.filter(a => a.estado === 'Aprobada').length / paginacion.total) * 100)}% del total`
                  : 'Confirmadas'}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-slate-700">Pendientes</div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock size={20} className="text-yellow-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {autorizaciones.filter(a => a.estado === 'Pendiente').length}
              </div>
              <div className="text-xs text-slate-600 mt-1">En revisión por aseguradora</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-slate-700">Rechazadas</div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle size={20} className="text-red-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {autorizaciones.filter(a => a.estado === 'Rechazada').length}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                {autorizaciones.filter(a => a.estado === 'Requiere Información Adicional').length > 0 && (
                  <span className="block mt-1">
                    + {autorizaciones.filter(a => a.estado === 'Requiere Información Adicional').length} requieren info
                  </span>
                )}
                No aprobadas
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-white rounded-xl shadow-sm p-4 border border-red-200 bg-red-50 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-800 flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 transition-colors"
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
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(paginacion.page - 1)}
                disabled={paginacion.page === 1}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          paginacion.page === page
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
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
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
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
    </div>
  );
}

