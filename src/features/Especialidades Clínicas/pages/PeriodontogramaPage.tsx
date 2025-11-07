import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Save, FileText, Activity } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  obtenerPeriodontogramasPorPaciente,
  obtenerPeriodontogramaPorId,
  crearPeriodontograma,
  actualizarPeriodontograma,
  Periodontograma,
  PeriodontogramaResumen,
  DatosDiente,
} from '../api/periodontogramaApi';
import PeriodontogramaGrafico from '../components/PeriodontogramaGrafico';
import PanelDatosDiente from '../components/PanelDatosDiente';
import SelectorHistorialPeriodontograma from '../components/SelectorHistorialPeriodontograma';
import ResumenIndicesPeriodontales from '../components/ResumenIndicesPeriodontales';

interface PeriodontogramaPageProps {
  pacienteId?: string;
  onVolver: () => void;
}

export default function PeriodontogramaPage({ pacienteId: pacienteIdProp, onVolver }: PeriodontogramaPageProps) {
  const { user } = useAuth();
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [periodontogramaActual, setPeriodontogramaActual] = useState<Periodontograma | null>(null);
  const [periodontogramasHistoricos, setPeriodontogramasHistoricos] = useState<PeriodontogramaResumen[]>([]);
  const [dienteSeleccionado, setDienteSeleccionado] = useState<string | null>(null);
  const [periodontogramaComparacion, setPeriodontogramaComparacion] = useState<Periodontograma | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    if (pacienteId) {
      cargarHistorial();
    }
  }, [pacienteId]);

  const cargarHistorial = async () => {
    if (!pacienteId) return;
    try {
      setLoading(true);
      const historial = await obtenerPeriodontogramasPorPaciente(pacienteId);
      setPeriodontogramasHistoricos(historial);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const crearNuevoPeriodontograma = () => {
    if (!pacienteId || !user?._id) {
      setError('Debe seleccionar un paciente');
      return;
    }

    const nuevo: Periodontograma = {
      pacienteId,
      profesionalId: user._id,
      fecha: new Date(),
      datosDientes: new Map<string, DatosDiente>(),
    };
    setPeriodontogramaActual(nuevo);
    setModoEdicion(true);
    setPeriodontogramaComparacion(null);
  };

  const cargarPeriodontograma = async (id: string) => {
    try {
      setLoading(true);
      const data = await obtenerPeriodontogramaPorId(id);
      setPeriodontogramaActual(data);
      setModoEdicion(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el periodontograma');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarParaComparacion = async (id: string) => {
    try {
      const data = await obtenerPeriodontogramaPorId(id);
      setPeriodontogramaComparacion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el periodontograma para comparación');
    }
  };

  const guardarPeriodontograma = async () => {
    if (!periodontogramaActual || !pacienteId) return;

    try {
      setLoading(true);
      if (periodontogramaActual._id) {
        await actualizarPeriodontograma(periodontogramaActual._id, periodontogramaActual);
      } else {
        const creado = await crearPeriodontograma(pacienteId, periodontogramaActual);
        setPeriodontogramaActual(creado);
      }
      setModoEdicion(false);
      await cargarHistorial();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el periodontograma');
    } finally {
      setLoading(false);
    }
  };

  const actualizarDatosDiente = (numeroDiente: string, datos: DatosDiente) => {
    if (!periodontogramaActual) return;

    const nuevosDatos = new Map(periodontogramaActual.datosDientes);
    nuevosDatos.set(numeroDiente, datos);

    setPeriodontogramaActual({
      ...periodontogramaActual,
      datosDientes: nuevosDatos,
    });
  };

  const calcularIndices = () => {
    if (!periodontogramaActual) return null;

    let totalSitios = 0;
    let sitiosConSangrado = 0;
    let sitiosConPlaca = 0;

    periodontogramaActual.datosDientes.forEach((datos) => {
      datos.sangrado.forEach((sangrado) => {
        totalSitios++;
        if (sangrado) sitiosConSangrado++;
      });
      datos.placa.forEach((placa) => {
        if (placa) sitiosConPlaca++;
      });
    });

    return {
      porcentajeSangrado: totalSitios > 0 ? (sitiosConSangrado / totalSitios) * 100 : 0,
      porcentajePlaca: totalSitios > 0 ? (sitiosConPlaca / totalSitios) * 100 : 0,
      totalSitios,
    };
  };

  const numerosDientes = [
    '18', '17', '16', '15', '14', '13', '12', '11',
    '21', '22', '23', '24', '25', '26', '27', '28',
    '48', '47', '46', '45', '44', '43', '42', '41',
    '31', '32', '33', '34', '35', '36', '37', '38',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Activity size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Periodontograma Avanzado
                  </h1>
                  <p className="text-gray-600">
                    Diagnóstico y seguimiento periodontal
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!modoEdicion && periodontogramaActual && (
                  <button
                    onClick={() => setModoEdicion(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
                  >
                    Editar
                  </button>
                )}
                {modoEdicion && periodontogramaActual && (
                  <button
                    onClick={guardarPeriodontograma}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all shadow-sm disabled:opacity-50"
                  >
                    <Save size={20} />
                    Guardar
                  </button>
                )}
                {!periodontogramaActual && (
                  <button
                    onClick={crearNuevoPeriodontograma}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
                  >
                    <Plus size={20} />
                    Crear Nuevo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <FileText size={20} className="text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo - Historial y Selector */}
          <div className="lg:col-span-1 space-y-6">
            <SelectorHistorialPeriodontograma
              historial={periodontogramasHistoricos}
              periodontogramaActualId={periodontogramaActual?._id}
              onSeleccionar={cargarPeriodontograma}
              onComparar={seleccionarParaComparacion}
              onCrearNuevo={crearNuevoPeriodontograma}
              loading={loading}
            />

            {periodontogramaActual && (
              <ResumenIndicesPeriodontales indices={calcularIndices()} />
            )}
          </div>

          {/* Panel central - Periodontograma Gráfico */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {periodontogramaActual ? (
                <>
                  <PeriodontogramaGrafico
                    periodontograma={periodontogramaActual}
                    periodontogramaComparacion={periodontogramaComparacion}
                    dienteSeleccionado={dienteSeleccionado}
                    onSeleccionarDiente={setDienteSeleccionado}
                    modoEdicion={modoEdicion}
                  />
                  {dienteSeleccionado && modoEdicion && (
                    <PanelDatosDiente
                      numeroDiente={dienteSeleccionado}
                      datos={
                        periodontogramaActual.datosDientes instanceof Map
                          ? periodontogramaActual.datosDientes.get(dienteSeleccionado)
                          : periodontogramaActual.datosDientes[dienteSeleccionado]
                      }
                      onGuardar={(datos) => {
                        actualizarDatosDiente(dienteSeleccionado, datos);
                        setDienteSeleccionado(null);
                      }}
                      onCancelar={() => setDienteSeleccionado(null)}
                    />
                  )}
                </>
              ) : (
                <div className="p-8 text-center bg-white shadow-sm">
                  <Activity size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay periodontograma activo</h3>
                  <p className="text-gray-600 mb-4">Seleccione uno del historial o cree uno nuevo</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



