import { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle, Baby, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando ficha pediátrica...</p>
        </div>
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-lg max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-800">Error</h2>
          </div>
          <p className="text-gray-600 mb-6">{error || 'No se pudo cargar la ficha pediátrica'}</p>
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
    );
  }

  const tabs = [
    { id: 'anamnesis' as const, label: 'Anamnesis Pediátrica', icon: '📋' },
    { id: 'odontograma' as const, label: 'Odontograma Mixto', icon: '🦷' },
    { id: 'habitos' as const, label: 'Hábitos Bucales', icon: '👶' },
    { id: 'riesgo' as const, label: 'Riesgo de Caries', icon: '⚠️' },
    { id: 'evolucion' as const, label: 'Evolución', icon: '📝' },
  ];

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
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <Baby className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Ficha Pediátrica</h1>
                  <p className="text-sm text-gray-600">Paciente ID: {pacienteId}</p>
                </div>
              </div>
            </div>
            <button
              onClick={crearOActualizarFicha}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Ficha
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mensajes de éxito/error */}
      {(error || success) && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
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
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de las tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8">
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
  );
}


