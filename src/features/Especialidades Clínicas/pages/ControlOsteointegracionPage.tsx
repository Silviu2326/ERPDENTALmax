import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Activity, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Implante,
  MedicionOsteointegracion,
  obtenerImplantesPorPaciente,
  obtenerMedicionesPorImplante,
  obtenerImplantePorId,
  actualizarEstadoImplante,
} from '../api/implantesApi';
import TablaImplantesPaciente from '../components/TablaImplantesPaciente';
import ModalRegistroMedicion from '../components/ModalRegistroMedicion';
import GraficoEvolucionISQ from '../components/GraficoEvolucionISQ';
import TimelineOsteointegracion from '../components/TimelineOsteointegracion';
import IndicadorEstadoImplante from '../components/IndicadorEstadoImplante';

interface ControlOsteointegracionPageProps {
  pacienteId?: string;
  onVolver: () => void;
}

export default function ControlOsteointegracionPage({
  pacienteId: pacienteIdProp,
  onVolver,
}: ControlOsteointegracionPageProps) {
  const { user } = useAuth();
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [implanteSeleccionado, setImplanteSeleccionado] = useState<Implante | null>(null);
  const [mediciones, setMediciones] = useState<MedicionOsteointegracion[]>([]);
  const [mostrarModalMedicion, setMostrarModalMedicion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (implanteSeleccionado?._id) {
      cargarMediciones();
    }
  }, [implanteSeleccionado?._id]);

  const cargarMediciones = async () => {
    if (!implanteSeleccionado?._id) return;
    try {
      setLoading(true);
      const data = await obtenerMedicionesPorImplante(implanteSeleccionado._id);
      setMediciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las mediciones');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = async (implante: Implante) => {
    try {
      setLoading(true);
      const implanteCompleto = await obtenerImplantePorId(implante._id!);
      setImplanteSeleccionado(implanteCompleto);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle del implante');
    } finally {
      setLoading(false);
    }
  };

  const handleMedicionRegistrada = async () => {
    if (implanteSeleccionado?._id) {
      await cargarMediciones();
      // Recargar el implante para obtener la última medición
      const implanteActualizado = await obtenerImplantePorId(implanteSeleccionado._id);
      setImplanteSeleccionado(implanteActualizado);
    }
  };

  const handleCambiarEstado = async (nuevoEstado: 'En Espera' | 'En Progreso' | 'Osteointegrado' | 'Fallido') => {
    if (!implanteSeleccionado?._id) return;
    try {
      setLoading(true);
      const implanteActualizado = await actualizarEstadoImplante(implanteSeleccionado._id, nuevoEstado);
      setImplanteSeleccionado(implanteActualizado);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  if (implanteSeleccionado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setImplanteSeleccionado(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Activity size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Control de Osteointegración
                  </h1>
                  <p className="text-gray-600">
                    Implante: {implanteSeleccionado.marca} {implanteSeleccionado.modelo} - Pieza {implanteSeleccionado.piezaDental}
                  </p>
                </div>
                <IndicadorEstadoImplante estado={implanteSeleccionado.estadoOsteointegracion} size="lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información del implante */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Implante</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Pieza Dental:</span>
                    <span className="ml-2 font-medium text-gray-900">{implanteSeleccionado.piezaDental}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Marca:</span>
                    <span className="ml-2 font-medium text-gray-900">{implanteSeleccionado.marca}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Modelo:</span>
                    <span className="ml-2 font-medium text-gray-900">{implanteSeleccionado.modelo}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Dimensiones:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      Ø{implanteSeleccionado.diametro}mm × {implanteSeleccionado.longitud}mm
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Fecha de Colocación:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {new Date(implanteSeleccionado.fechaColocacion).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>

                {/* Cambio de estado */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Cambiar Estado</h4>
                  <div className="flex flex-wrap gap-2">
                    {(['En Espera', 'En Progreso', 'Osteointegrado', 'Fallido'] as const).map((estado) => (
                      <button
                        key={estado}
                        onClick={() => handleCambiarEstado(estado)}
                        disabled={loading || implanteSeleccionado.estadoOsteointegracion === estado}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                          implanteSeleccionado.estadoOsteointegracion === estado
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {estado}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
                <button
                  onClick={() => setMostrarModalMedicion(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                >
                  <Plus size={20} />
                  Registrar Nueva Medición
                </button>
              </div>
            </div>

            {/* Gráfico y Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GraficoEvolucionISQ mediciones={mediciones} />
              <TimelineOsteointegracion mediciones={mediciones} />
            </div>
          </div>
        </div>

        {/* Modal de registro de medición */}
        <ModalRegistroMedicion
          implanteId={implanteSeleccionado._id!}
          isOpen={mostrarModalMedicion}
          onClose={() => setMostrarModalMedicion(false)}
          onMedicionRegistrada={handleMedicionRegistrada}
        />
      </div>
    );
  }

  // Vista de lista de implantes
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onVolver}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Activity size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Control de Osteointegración
                </h1>
                <p className="text-gray-600">
                  Seguimiento del proceso de osteointegración de implantes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                if (pacienteId) {
                  handleVerDetalle({} as Implante);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Reintentar
            </button>
          </div>
        ) : pacienteId ? (
          <TablaImplantesPaciente
            pacienteId={pacienteId}
            onVerDetalle={handleVerDetalle}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Activity size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione un paciente</h3>
            <p className="text-gray-600 mb-4">
              Esta funcionalidad requiere un paciente específico para mostrar el historial de implantes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



