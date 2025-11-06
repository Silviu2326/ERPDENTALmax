import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, Calendar, Activity } from 'lucide-react';
import { AtmEvaluacion, obtenerEvaluacionesPorPaciente, crearEvaluacionATM } from '../api/atmApi';
import FormularioAnamnesisATM from '../components/FormularioAnamnesisATM';
import DiagramaMuscularInteractivo from '../components/DiagramaMuscularInteractivo';
import TablaSeguimientoATM from '../components/TablaSeguimientoATM';
import GraficoEvolucionDolor from '../components/GraficoEvolucionDolor';
import ModalRegistroMovimientoMandibular from '../components/ModalRegistroMovimientoMandibular';

interface AtmDolorOrofacialPageProps {
  pacienteId?: string;
  onVolver?: () => void;
}

export default function AtmDolorOrofacialPage({ pacienteId, onVolver }: AtmDolorOrofacialPageProps) {
  const [evaluaciones, setEvaluaciones] = useState<AtmEvaluacion[]>([]);
  const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState<AtmEvaluacion | null>(null);
  const [mostrarNuevaEvaluacion, setMostrarNuevaEvaluacion] = useState(false);
  const [mostrarModalMovimiento, setMostrarModalMovimiento] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vista, setVista] = useState<'historial' | 'nueva' | 'detalle'>('historial');

  useEffect(() => {
    if (pacienteId) {
      cargarEvaluaciones();
    }
  }, [pacienteId]);

  const cargarEvaluaciones = async () => {
    if (!pacienteId) return;

    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerEvaluacionesPorPaciente(pacienteId);
      setEvaluaciones(datos.sort((a, b) => 
        new Date(b.fechaEvaluacion).getTime() - new Date(a.fechaEvaluacion).getTime()
      ));
    } catch (err) {
      setError('Error al cargar las evaluaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaEvaluacion = () => {
    setEvaluacionSeleccionada(null);
    setMostrarNuevaEvaluacion(true);
    setVista('nueva');
  };

  const handleGuardarEvaluacion = async (evaluacionData: Partial<AtmEvaluacion>) => {
    if (!pacienteId) return;

    try {
      setLoading(true);
      const nuevaEvaluacion = await crearEvaluacionATM(pacienteId, {
        ...evaluacionData,
        fechaEvaluacion: new Date().toISOString(),
      } as AtmEvaluacion);
      
      await cargarEvaluaciones();
      setEvaluacionSeleccionada(nuevaEvaluacion);
      setMostrarNuevaEvaluacion(false);
      setVista('detalle');
    } catch (err) {
      setError('Error al guardar la evaluación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = (evaluacion: AtmEvaluacion) => {
    setEvaluacionSeleccionada(evaluacion);
    setVista('detalle');
  };

  if (!pacienteId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-lg max-w-md w-full">
          <div className="text-center">
            <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Seleccione un Paciente</h2>
            <p className="text-gray-600 mb-4">Para acceder a las evaluaciones de ATM, necesita seleccionar un paciente primero.</p>
            {onVolver && (
              <button
                onClick={onVolver}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (vista === 'nueva' || mostrarNuevaEvaluacion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => {
              setVista('historial');
              setMostrarNuevaEvaluacion(false);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al historial
          </button>
          <FormularioAnamnesisATM
            pacienteId={pacienteId}
            onGuardar={handleGuardarEvaluacion}
            onCancelar={() => {
              setVista('historial');
              setMostrarNuevaEvaluacion(false);
            }}
          />
        </div>
      </div>
    );
  }

  if (vista === 'detalle' && evaluacionSeleccionada) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => {
              setVista('historial');
              setEvaluacionSeleccionada(null);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al historial
          </button>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Evaluación de ATM</h2>
                <p className="text-gray-600">
                  {new Date(evaluacionSeleccionada.fechaEvaluacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {evaluacionSeleccionada.motivoConsulta && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Motivo de Consulta</h3>
                <p className="text-gray-600">{evaluacionSeleccionada.motivoConsulta}</p>
              </div>
            )}

            {evaluacionSeleccionada.anamnesis && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Anamnesis</h3>
                {evaluacionSeleccionada.anamnesis.indiceFonseca !== undefined && (
                  <p className="text-gray-600 mb-2">
                    Índice de Fonseca: {evaluacionSeleccionada.anamnesis.indiceFonseca.toFixed(1)}%
                  </p>
                )}
                {evaluacionSeleccionada.anamnesis.detalles && (
                  <p className="text-gray-600">{evaluacionSeleccionada.anamnesis.detalles}</p>
                )}
              </div>
            )}

            {evaluacionSeleccionada.examenClinico && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Examen Clínico</h3>
                <DiagramaMuscularInteractivo
                  mapaDolor={evaluacionSeleccionada.examenClinico.mapaDolor}
                  palpaciones={evaluacionSeleccionada.examenClinico.palpacionMuscular}
                  modoLectura={true}
                />
                
                <button
                  onClick={() => setMostrarModalMovimiento(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver Rangos de Movimiento
                </button>
              </div>
            )}

            {evaluacionSeleccionada.diagnostico && evaluacionSeleccionada.diagnostico.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Diagnóstico</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {evaluacionSeleccionada.diagnostico.map((diag, index) => (
                    <li key={index}>
                      <strong>{diag.codigo}:</strong> {diag.descripcion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {evaluacionSeleccionada.planTratamiento && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Plan de Tratamiento</h3>
                <p className="text-gray-600">{evaluacionSeleccionada.planTratamiento}</p>
              </div>
            )}
          </div>
        </div>

        {mostrarModalMovimiento && evaluacionSeleccionada.examenClinico && (
          <ModalRegistroMovimientoMandibular
            rangosMovimiento={evaluacionSeleccionada.examenClinico.rangosMovimiento}
            onCerrar={() => setMostrarModalMovimiento(false)}
            modoLectura={true}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ATM y Dolor Orofacial</h1>
                <p className="text-sm text-gray-600">Evaluación y seguimiento de trastornos temporomandibulares</p>
              </div>
            </div>
            <button
              onClick={handleNuevaEvaluacion}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nueva Evaluación
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading && !evaluaciones.length ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando evaluaciones...</p>
          </div>
        ) : evaluaciones.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay evaluaciones registradas</h3>
            <p className="text-gray-600 mb-6">Comience creando una nueva evaluación de ATM y dolor orofacial</p>
            <button
              onClick={handleNuevaEvaluacion}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Primera Evaluación
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <TablaSeguimientoATM
                  evaluaciones={evaluaciones}
                  onVerDetalle={handleVerDetalle}
                />
              </div>
              <div className="lg:col-span-1">
                <GraficoEvolucionDolor evaluaciones={evaluaciones} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


