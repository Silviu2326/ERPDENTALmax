import { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle, Baby, Loader2, FileText, Stethoscope, AlertTriangle, History } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FichaPediatrica,
  obtenerFichaPorPacienteId,
  crearFichaPediatrica,
  actualizarFichaCompleta,
  actualizarOdontograma,
  agregarNotaEvolucion,
  registrarTraumatismo,
  AnamnesisPediatrica,
  Habito,
  Odontograma,
  RiesgoCaries,
  NotaEvolucion,
  Traumatismo,
} from '../api/fichasPediatricasAPI';
import FormularioAnamnesisPediatrica from '../components/FormularioAnamnesisPediatrica';
import OdontogramaMixto from '../components/OdontogramaMixto';
import SeccionHabitosYControl from '../components/SeccionHabitosYControl';
import EvaluacionRiesgoCaries from '../components/EvaluacionRiesgoCaries';
import RegistroEvolucionPediatrica from '../components/RegistroEvolucionPediatrica';

interface FichaPediatricaPageProps {
  pacienteId: string;
  onVolver?: () => void;
}

export default function FichaPediatricaPage({
  pacienteId,
  onVolver,
}: FichaPediatricaPageProps) {
  const { user } = useAuth();
  const [ficha, setFicha] = useState<FichaPediatrica | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'anamnesis' | 'odontograma' | 'habitos' | 'riesgo' | 'evolucion'>('anamnesis');
  const [fichaExiste, setFichaExiste] = useState(false);

  useEffect(() => {
    cargarFicha();
  }, [pacienteId]);

  const cargarFicha = async () => {
    if (!pacienteId) {
      setError('ID de paciente no proporcionado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fichaExistente = await obtenerFichaPorPacienteId(pacienteId);
      if (fichaExistente) {
        setFicha(fichaExistente);
        setFichaExiste(true);
      } else {
        // Inicializar ficha vacía
        setFicha({
          pacienteId,
          anamnesisPediatrica: {},
          habitos: [],
          odontograma: { dientes: [] },
          traumatismos: [],
          evolucion: [],
        });
        setFichaExiste(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la ficha pediátrica');
    } finally {
      setLoading(false);
    }
  };

  const crearOActualizarFicha = async () => {
    if (!ficha || !user) {
      setError('Datos incompletos');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (fichaExiste && ficha._id) {
        // Actualizar ficha existente
        await actualizarFichaCompleta(ficha._id, {
          anamnesisPediatrica: ficha.anamnesisPediatrica,
          habitos: ficha.habitos,
          riesgoCaries: ficha.riesgoCaries,
        });
        setSuccess(true);
        setFichaExiste(true);
      } else {
        // Crear nueva ficha
        const nuevaFicha = await crearFichaPediatrica({
          pacienteId: ficha.pacienteId,
          anamnesisPediatrica: ficha.anamnesisPediatrica,
          habitos: ficha.habitos,
          odontograma: ficha.odontograma,
          riesgoCaries: ficha.riesgoCaries,
          traumatismos: ficha.traumatismos,
          evolucion: ficha.evolucion,
        });
        setFicha(nuevaFicha);
        setFichaExiste(true);
        setSuccess(true);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la ficha pediátrica');
    } finally {
      setSaving(false);
    }
  };

  const handleGuardarOdontograma = async (odontograma: Odontograma) => {
    if (!ficha || !ficha._id) {
      setError('Debe guardar la ficha primero antes de actualizar el odontograma');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const fichaActualizada = await actualizarOdontograma(ficha._id, odontograma);
      setFicha(fichaActualizada);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el odontograma');
    } finally {
      setSaving(false);
    }
  };

  const handleAgregarNotaEvolucion = async (nota: Omit<NotaEvolucion, '_id'>) => {
    if (!ficha || !ficha._id) {
      setError('Debe guardar la ficha primero antes de agregar notas de evolución');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const evolucionActualizada = await agregarNotaEvolucion(ficha._id, nota);
      setFicha({ ...ficha, evolucion: evolucionActualizada });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar nota de evolución');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-lg p-8 text-center max-w-md w-full">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando ficha pediátrica...</p>
        </div>
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-lg p-8 text-center max-w-md w-full">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error || 'No se pudo cargar la ficha pediátrica'}</p>
          {onVolver && (
            <button
              onClick={onVolver}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver
            </button>
          )}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'anamnesis' as const, label: 'Anamnesis Pediátrica', icon: FileText },
    { id: 'odontograma' as const, label: 'Odontograma Mixto', icon: Stethoscope },
    { id: 'habitos' as const, label: 'Hábitos Bucales', icon: Baby },
    { id: 'riesgo' as const, label: 'Riesgo de Caries', icon: AlertTriangle },
    { id: 'evolucion' as const, label: 'Evolución', icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>
                )}
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <Baby size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Ficha Pediátrica
                    </h1>
                    <p className="text-gray-600">
                      Gestión completa de la historia clínica pediátrica
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={crearOActualizarFicha}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
              >
                {saving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Guardar Ficha
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de éxito/error */}
      {(error || success) && (
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              Ficha guardada exitosamente
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-4">
        <div className="bg-white shadow-sm rounded-lg p-0">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de las tabs */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="mt-6">
          {activeTab === 'anamnesis' && (
          <FormularioAnamnesisPediatrica
            anamnesis={ficha.anamnesisPediatrica}
            onChange={(anamnesis) => setFicha({ ...ficha, anamnesisPediatrica: anamnesis })}
          />
        )}

        {activeTab === 'odontograma' && (
          <OdontogramaMixto
            odontograma={ficha.odontograma}
            onChange={(odontograma) => {
              setFicha({ ...ficha, odontograma });
              if (ficha._id) {
                handleGuardarOdontograma(odontograma);
              }
            }}
          />
        )}

        {activeTab === 'habitos' && (
          <SeccionHabitosYControl
            habitos={ficha.habitos}
            onChange={(habitos) => setFicha({ ...ficha, habitos })}
          />
        )}

        {activeTab === 'riesgo' && (
          <EvaluacionRiesgoCaries
            riesgoCaries={ficha.riesgoCaries}
            onChange={(riesgoCaries) => setFicha({ ...ficha, riesgoCaries })}
          />
        )}

        {activeTab === 'evolucion' && (
          <RegistroEvolucionPediatrica
            evolucion={ficha.evolucion}
            profesionalId={user?._id || ''}
            profesionalNombre={user?.name}
            onAgregarNota={handleAgregarNotaEvolucion}
          />
          )}
        </div>
      </div>
    </div>
  );
}



