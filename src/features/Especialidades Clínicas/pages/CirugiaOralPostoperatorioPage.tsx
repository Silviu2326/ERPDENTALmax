import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-6">
            <AlertCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Seleccione un Tratamiento</h2>
            <p className="text-gray-600">
              Para acceder al registro postoperatorio, necesita especificar un tratamiento de cirugía oral.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID del Tratamiento</label>
              <input
                type="text"
                value={tratamientoId}
                onChange={(e) => setTratamientoId(e.target.value)}
                placeholder="Ingrese el ID del tratamiento"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {!pacienteIdProp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID del Paciente</label>
                <input
                  type="text"
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                  placeholder="Ingrese el ID del paciente"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={onVolver}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={() => {
                  if (tratamientoId) {
                    cargarPostoperatorio();
                  }
                }}
                disabled={!tratamientoId}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar estado de carga
  if (loading && !postoperatorio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando registro postoperatorio...</p>
        </div>
      </div>
    );
  }

  // Si no existe registro y estamos en modo creación, mostrar opción de crear
  if (modoCreacion && !postoperatorio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <AlertCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No existe registro postoperatorio</h2>
              <p className="text-gray-600">
                Aún no se ha creado un registro postoperatorio para este tratamiento. ¿Desea crearlo ahora?
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onVolver}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleCrearRegistro}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No se encontró el registro</h2>
            <p className="text-gray-600 mb-6">No se pudo cargar el registro postoperatorio.</p>
            {onVolver && (
              <button
                onClick={onVolver}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Cirugía Oral: Postoperatorio</h1>
                <p className="text-sm text-gray-600">Gestión del seguimiento postoperatorio</p>
              </div>
            </div>
            {postoperatorio.estado === 'Activo' && (
              <button
                onClick={handleFinalizarPostoperatorio}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Finalizar Postoperatorio
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mensajes de éxito/error */}
      {success && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <p>{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
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


