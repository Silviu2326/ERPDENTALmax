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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Volver"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <Calendar size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Mantenimiento Periodontal
                    </h1>
                    <p className="text-gray-600">
                      Seguimiento y control a largo plazo de pacientes periodontales
                    </p>
                  </div>
                </div>
              </div>
              {!modoNuevaSesion && (
                <button
                  onClick={iniciarNuevaSesion}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200"
                >
                  <Plus size={20} />
                  <span>Nueva Sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Mensajes */}
          {mensaje && (
            <div
              className={`p-4 rounded-lg border ${
                mensaje.tipo === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <p className="font-medium">{mensaje.texto}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Selección de paciente si no está definido */}
          {!pacienteId && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">Por favor, seleccione un paciente para continuar</p>
              {/* Aquí podría ir un selector de pacientes */}
            </div>
          )}

          {/* Contenido principal */}
          {pacienteId && (
            <>
              {/* Gráfico de evolución */}
              {sesiones.length > 0 && (
                <div>
                  <GraficoEvolucionPeriodontal sesiones={sesiones} />
                </div>
              )}

              {/* Formulario de nueva sesión */}
              {modoNuevaSesion && (
                <div className="space-y-6">
                  {/* Información básica */}
                  <div className="bg-white shadow-sm rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {sesionEditando ? 'Editar Sesión' : 'Nueva Sesión de Mantenimiento'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Fecha de Sesión
                        </label>
                        <input
                          type="date"
                          value={fechaSesion}
                          onChange={(e) => setFechaSesion(e.target.value)}
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Intervalo Recomendado (meses)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={intervaloRecomendado}
                          onChange={(e) => setIntervaloRecomendado(parseInt(e.target.value) || 6)}
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
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
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Observaciones
                      </label>
                      <textarea
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                        placeholder="Anotaciones sobre la sesión, áreas de atención, etc."
                      />
                    </div>

                    {/* Plan para próxima visita */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Plan para Próxima Visita
                      </label>
                      <textarea
                        value={planProximaVisita}
                        onChange={(e) => setPlanProximaVisita(e.target.value)}
                        rows={2}
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                        placeholder="Recomendaciones y plan de tratamiento para la siguiente visita"
                      />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                      <button
                        onClick={cancelarEdicion}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-700 hover:bg-slate-100 ring-1 ring-slate-300"
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={guardarSesion}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={20} />
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
    </div>
  );
}



