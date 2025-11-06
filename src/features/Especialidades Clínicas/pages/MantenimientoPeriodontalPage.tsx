import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  obtenerSesionesMantenimiento,
  crearSesionMantenimiento,
  actualizarSesionMantenimiento,
  obtenerDetalleSesion,
  calcularIndicePlaca,
  calcularIndiceSangrado,
  SesionMantenimientoPeriodontal,
  MedicionDiente,
} from '../api/periodonciaApi';
import TablaRegistroPeriodontal from '../components/TablaRegistroPeriodontal';
import GraficoEvolucionPeriodontal from '../components/GraficoEvolucionPeriodontal';
import HistorialSesionesPeriodoncia from '../components/HistorialSesionesPeriodoncia';

interface MantenimientoPeriodontalPageProps {
  pacienteId?: string;
  onVolver: () => void;
}

export default function MantenimientoPeriodontalPage({
  pacienteId: pacienteIdProp,
  onVolver,
}: MantenimientoPeriodontalPageProps) {
  const { user } = useAuth();
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [sesiones, setSesiones] = useState<SesionMantenimientoPeriodontal[]>([]);
  const [sesionActual, setSesionActual] = useState<SesionMantenimientoPeriodontal | null>(null);
  const [mediciones, setMediciones] = useState<MedicionDiente[]>([]);
  const [fechaSesion, setFechaSesion] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [observaciones, setObservaciones] = useState('');
  const [planProximaVisita, setPlanProximaVisita] = useState('');
  const [intervaloRecomendado, setIntervaloRecomendado] = useState<number>(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [modoNuevaSesion, setModoNuevaSesion] = useState(false);
  const [sesionEditando, setSesionEditando] = useState<string | null>(null);

  useEffect(() => {
    if (pacienteId) {
      cargarSesiones();
    }
  }, [pacienteId]);

  const cargarSesiones = async () => {
    if (!pacienteId) return;
    try {
      setLoading(true);
      setError(null);
      const sesionesData = await obtenerSesionesMantenimiento(pacienteId);
      setSesiones(sesionesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las sesiones');
      setSesiones([]);
    } finally {
      setLoading(false);
    }
  };

  const iniciarNuevaSesion = () => {
    setSesionActual(null);
    setMediciones([]);
    setFechaSesion(new Date().toISOString().split('T')[0]);
    setObservaciones('');
    setPlanProximaVisita('');
    setIntervaloRecomendado(6);
    setModoNuevaSesion(true);
    setSesionEditando(null);
    setError(null);
    setMensaje(null);
  };

  const cargarSesionParaEditar = async (sesionId: string) => {
    try {
      setLoading(true);
      const sesion = await obtenerDetalleSesion(sesionId);
      setSesionActual(sesion);
      setMediciones(sesion.mediciones || []);
      setFechaSesion(
        typeof sesion.fechaSesion === 'string'
          ? sesion.fechaSesion.split('T')[0]
          : new Date(sesion.fechaSesion).toISOString().split('T')[0]
      );
      setObservaciones(sesion.observaciones || '');
      setPlanProximaVisita(sesion.planProximaVisita || '');
      setIntervaloRecomendado(sesion.intervaloRecomendado || 6);
      setModoNuevaSesion(true);
      setSesionEditando(sesionId);
      setError(null);
      setMensaje(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la sesión');
    } finally {
      setLoading(false);
    }
  };

  const guardarSesion = async () => {
    if (!pacienteId || !user?._id) {
      setError('Debe seleccionar un paciente y estar autenticado');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Calcular índices generales
      const indicePlaca = calcularIndicePlaca(mediciones);
      const indiceSangrado = calcularIndiceSangrado(mediciones);

      const datosSesion: Omit<SesionMantenimientoPeriodontal, '_id' | 'paciente'> = {
        profesional: user._id,
        fechaSesion: new Date(fechaSesion),
        indicePlacaGeneral: indicePlaca,
        indiceSangradoGeneral: indiceSangrado,
        observaciones: observaciones.trim() || undefined,
        mediciones: mediciones.filter(m => 
          m.profundidadSondaje.some(p => p > 0) ||
          m.sangradoAlSondaje.some(s => s) ||
          m.placaVisible.some(p => p)
        ), // Solo incluir dientes con datos
        planProximaVisita: planProximaVisita.trim() || undefined,
        intervaloRecomendado: intervaloRecomendado || undefined,
      };

      if (sesionEditando) {
        // Actualizar sesión existente
        await actualizarSesionMantenimiento(sesionEditando, datosSesion);
        setMensaje({ tipo: 'success', texto: 'Sesión actualizada correctamente' });
      } else {
        // Crear nueva sesión
        await crearSesionMantenimiento(pacienteId, datosSesion);
        setMensaje({ tipo: 'success', texto: 'Sesión guardada correctamente' });
      }

      // Recargar sesiones y limpiar formulario
      await cargarSesiones();
      setModoNuevaSesion(false);
      setSesionActual(null);
      setMediciones([]);
      setFechaSesion(new Date().toISOString().split('T')[0]);
      setObservaciones('');
      setPlanProximaVisita('');
      setIntervaloRecomendado(6);
      setSesionEditando(null);

      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la sesión');
      setMensaje({ tipo: 'error', texto: err instanceof Error ? err.message : 'Error al guardar' });
      setTimeout(() => setMensaje(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const cancelarEdicion = () => {
    setModoNuevaSesion(false);
    setSesionActual(null);
    setMediciones([]);
    setFechaSesion(new Date().toISOString().split('T')[0]);
    setObservaciones('');
    setPlanProximaVisita('');
    setIntervaloRecomendado(6);
    setSesionEditando(null);
    setError(null);
    setMensaje(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onVolver}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-teal-600 to-cyan-600 p-3 rounded-xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Mantenimiento Periodontal</h1>
                  <p className="text-sm text-gray-600">
                    Seguimiento y control a largo plazo de pacientes periodontales
                  </p>
                </div>
              </div>
            </div>
            {!modoNuevaSesion && (
              <button
                onClick={iniciarNuevaSesion}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Nueva Sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mensajes */}
        {mensaje && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              mensaje.tipo === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <p className="font-medium">{mensaje.texto}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Selección de paciente si no está definido */}
        {!pacienteId && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
            <p className="text-gray-600">Por favor, seleccione un paciente para continuar</p>
            {/* Aquí podría ir un selector de pacientes */}
          </div>
        )}

        {/* Contenido principal */}
        {pacienteId && (
          <>
            {/* Gráfico de evolución */}
            {sesiones.length > 0 && (
              <div className="mb-6">
                <GraficoEvolucionPeriodontal sesiones={sesiones} />
              </div>
            )}

            {/* Formulario de nueva sesión */}
            {modoNuevaSesion && (
              <div className="mb-6 space-y-6">
                {/* Información básica */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {sesionEditando ? 'Editar Sesión' : 'Nueva Sesión de Mantenimiento'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Sesión
                      </label>
                      <input
                        type="date"
                        value={fechaSesion}
                        onChange={(e) => setFechaSesion(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intervalo Recomendado (meses)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={intervaloRecomendado}
                        onChange={(e) => setIntervaloRecomendado(parseInt(e.target.value) || 6)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Tabla de registro */}
                  <div className="mb-4">
                    <TablaRegistroPeriodontal
                      mediciones={mediciones}
                      onMedicionesChange={setMediciones}
                    />
                  </div>

                  {/* Observaciones */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones
                    </label>
                    <textarea
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Anotaciones sobre la sesión, áreas de atención, etc."
                    />
                  </div>

                  {/* Plan para próxima visita */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan para Próxima Visita
                    </label>
                    <textarea
                      value={planProximaVisita}
                      onChange={(e) => setPlanProximaVisita(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Recomendaciones y plan de tratamiento para la siguiente visita"
                    />
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={cancelarEdicion}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={guardarSesion}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-5 h-5" />
                      <span>{loading ? 'Guardando...' : sesionEditando ? 'Actualizar' : 'Guardar Sesión'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Historial de sesiones */}
            <div>
              <HistorialSesionesPeriodoncia
                sesiones={sesiones}
                onVerSesion={(sesionId) => {
                  cargarSesionParaEditar(sesionId);
                }}
                onEditarSesion={(sesionId) => {
                  cargarSesionParaEditar(sesionId);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}


