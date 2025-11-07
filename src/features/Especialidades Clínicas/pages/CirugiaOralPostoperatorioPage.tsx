import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle, Loader2, Activity } from 'lucide-react';
import {
  Postoperatorio,
  obtenerPostoperatorioPorTratamiento,
  crearRegistroPostoperatorio,
  actualizarIndicaciones,
  agregarEntradaSeguimiento,
  actualizarEstadoPostoperatorio,
  ActualizarIndicacionesRequest,
  AgregarSeguimientoRequest,
} from '../api/postoperatorioApi';
import PanelResumenCirugia from '../components/PanelResumenCirugia';
import FormularioIndicacionesPostoperatorias from '../components/FormularioIndicacionesPostoperatorias';
import ListaMedicacionPrescrita from '../components/ListaMedicacionPrescrita';
import HistorialSeguimientoPostoperatorio from '../components/HistorialSeguimientoPostoperatorio';
import ModalNuevoSeguimiento from '../components/ModalNuevoSeguimiento';

interface CirugiaOralPostoperatorioPageProps {
  tratamientoId?: string;
  pacienteId?: string;
  onVolver?: () => void;
}

export default function CirugiaOralPostoperatorioPage({
  tratamientoId: tratamientoIdProp,
  pacienteId: pacienteIdProp,
  onVolver,
}: CirugiaOralPostoperatorioPageProps) {
  const [tratamientoId, setTratamientoId] = useState<string>(tratamientoIdProp || '');
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [postoperatorio, setPostoperatorio] = useState<Postoperatorio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mostrarModalSeguimiento, setMostrarModalSeguimiento] = useState(false);
  const [modoCreacion, setModoCreacion] = useState(false);

  // Cargar postoperatorio existente si hay tratamientoId
  useEffect(() => {
    if (tratamientoId) {
      cargarPostoperatorio();
    } else {
      setModoCreacion(true);
    }
  }, [tratamientoId]);

  const cargarPostoperatorio = async () => {
    if (!tratamientoId) return;

    setLoading(true);
    setError(null);
    try {
      const registro = await obtenerPostoperatorioPorTratamiento(tratamientoId);
      if (registro) {
        setPostoperatorio(registro);
        setModoCreacion(false);
      } else {
        // No existe registro, preparar para crear uno nuevo
        setModoCreacion(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el registro postoperatorio');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearRegistro = async () => {
    if (!tratamientoId || !pacienteId) {
      setError('Se requiere un ID de tratamiento y un ID de paciente para crear el registro');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const nuevoRegistro = await crearRegistroPostoperatorio({
        pacienteId,
        tratamientoId,
        indicacionesGenerales: '',
        medicacionPrescrita: [],
        notasIniciales: '',
      });
      setPostoperatorio(nuevoRegistro);
      setModoCreacion(false);
      setSuccess('Registro postoperatorio creado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el registro postoperatorio');
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarIndicaciones = async (datos: ActualizarIndicacionesRequest) => {
    if (!postoperatorio?._id) return;

    setLoading(true);
    setError(null);
    try {
      const actualizado = await actualizarIndicaciones(postoperatorio._id, datos);
      setPostoperatorio(actualizado);
      setSuccess('Indicaciones actualizadas exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar las indicaciones');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarSeguimiento = async (seguimiento: AgregarSeguimientoRequest) => {
    if (!postoperatorio?._id) return;

    setLoading(true);
    setError(null);
    try {
      const actualizado = await agregarEntradaSeguimiento(postoperatorio._id, seguimiento);
      setPostoperatorio(actualizado);
      setSuccess('Seguimiento agregado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar el seguimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarPostoperatorio = async () => {
    if (!postoperatorio?._id) return;
    if (!confirm('¿Está seguro de que desea finalizar el seguimiento postoperatorio? Esta acción no se puede deshacer.')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const actualizado = await actualizarEstadoPostoperatorio(postoperatorio._id, 'Finalizado');
      setPostoperatorio(actualizado);
      setSuccess('Postoperatorio finalizado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al finalizar el postoperatorio');
    } finally {
      setLoading(false);
    }
  };

  // Si no hay tratamientoId, mostrar formulario para ingresarlo
  if (!tratamientoIdProp && !tratamientoId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione un Tratamiento</h3>
            <p className="text-gray-600 mb-4">
              Para acceder al registro postoperatorio, necesita especificar un tratamiento de cirugía oral.
            </p>

            <div className="max-w-md mx-auto space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">ID del Tratamiento</label>
                <input
                  type="text"
                  value={tratamientoId}
                  onChange={(e) => setTratamientoId(e.target.value)}
                  placeholder="Ingrese el ID del tratamiento"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                />
              </div>
              {!pacienteIdProp && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ID del Paciente</label>
                  <input
                    type="text"
                    value={pacienteId}
                    onChange={(e) => setPacienteId(e.target.value)}
                    placeholder="Ingrese el ID del paciente"
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                  />
                </div>
              )}
              <div className="flex gap-2 pt-4">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Volver
                  </button>
                )}
                <button
                  onClick={() => {
                    if (tratamientoId) {
                      cargarPostoperatorio();
                    }
                  }}
                  disabled={!tratamientoId}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar estado de carga
  if (loading && !postoperatorio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando registro postoperatorio...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si no existe registro y estamos en modo creación, mostrar opción de crear
  if (modoCreacion && !postoperatorio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No existe registro postoperatorio</h3>
            <p className="text-gray-600 mb-4">
              Aún no se ha creado un registro postoperatorio para este tratamiento. ¿Desea crearlo ahora?
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 justify-center">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-2 max-w-md mx-auto">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Volver
                </button>
              )}
              <button
                onClick={handleCrearRegistro}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Creando...' : 'Crear Registro Postoperatorio'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay postoperatorio cargado, mostrar mensaje
  if (!postoperatorio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">No se pudo cargar el registro postoperatorio.</p>
            {onVolver && (
              <button
                onClick={onVolver}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Volver
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all mr-4"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Activity size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Cirugía Oral: Postoperatorio
                  </h1>
                  <p className="text-gray-600">
                    Gestión del seguimiento postoperatorio
                  </p>
                </div>
              </div>
              {postoperatorio.estado === 'Activo' && (
                <button
                  onClick={handleFinalizarPostoperatorio}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  Finalizar Postoperatorio
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de éxito/error */}
      {success && (
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle size={20} />
            <p>{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8 space-y-6">
        {/* Panel de Resumen */}
        <PanelResumenCirugia postoperatorio={postoperatorio} />

        {/* Indicaciones y Medicación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormularioIndicacionesPostoperatorias
            postoperatorio={postoperatorio}
            onGuardar={handleActualizarIndicaciones}
            loading={loading}
          />
          <ListaMedicacionPrescrita
            postoperatorio={postoperatorio}
            onActualizar={handleActualizarIndicaciones}
            loading={loading}
          />
        </div>

        {/* Historial de Seguimiento */}
        <HistorialSeguimientoPostoperatorio
          postoperatorio={postoperatorio}
          onNuevoSeguimiento={() => setMostrarModalSeguimiento(true)}
        />
      </div>

      {/* Modal de Nuevo Seguimiento */}
      <ModalNuevoSeguimiento
        isOpen={mostrarModalSeguimiento}
        onClose={() => setMostrarModalSeguimiento(false)}
        onGuardar={handleAgregarSeguimiento}
        loading={loading}
      />
    </div>
  );
}



