import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { obtenerPerfilCompletoPaciente, PerfilCompletoPaciente } from '../api/pacienteApi';
import PacienteHeader from '../components/PacienteHeader';
import PacienteInfoGeneralTab from '../components/PacienteInfoGeneralTab';
import PacienteHistoriaClinicaTab from '../components/PacienteHistoriaClinicaTab';
import PacienteOdontogramaTab from '../components/PacienteOdontogramaTab';
import PacientePlanesTratamientoTab from '../components/PacientePlanesTratamientoTab';
import PacienteCitasTab from '../components/PacienteCitasTab';
import PacienteFinancieroTab from '../components/PacienteFinancieroTab';
import PacienteDocumentosTab from '../components/PacienteDocumentosTab';
import HistorialVisitasPage from './HistorialVisitasPage';

type TabType = 'info-general' | 'historia-clinica' | 'odontograma' | 'planes-tratamiento' | 'citas' | 'financiero' | 'documentos' | 'historial-visitas';

interface PacientePerfilPageProps {
  pacienteId: string;
  onVolver?: () => void;
}

export default function PacientePerfilPage({ pacienteId, onVolver }: PacientePerfilPageProps) {
  const [paciente, setPaciente] = useState<PerfilCompletoPaciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('info-general');

  useEffect(() => {
    const cargarPerfil = async () => {
      if (!pacienteId) {
        setError('ID de paciente no proporcionado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const perfil = await obtenerPerfilCompletoPaciente(pacienteId);
        setPaciente(perfil);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el perfil del paciente');
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [pacienteId]);

  const handleUpdate = (pacienteActualizado: PerfilCompletoPaciente) => {
    setPaciente(pacienteActualizado);
  };

  const tabs = [
    { id: 'info-general' as TabType, label: 'Información General', icon: '👤' },
    { id: 'historia-clinica' as TabType, label: 'Historia Clínica', icon: '📋' },
    { id: 'odontograma' as TabType, label: 'Odontograma', icon: '🦷' },
    { id: 'planes-tratamiento' as TabType, label: 'Planes de Tratamiento', icon: '📄' },
    { id: 'citas' as TabType, label: 'Citas', icon: '📅' },
    { id: 'historial-visitas' as TabType, label: 'Historial de Visitas', icon: '📝' },
    { id: 'financiero' as TabType, label: 'Financiero', icon: '💰' },
    { id: 'documentos' as TabType, label: 'Documentos', icon: '📎' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando perfil del paciente...</p>
        </div>
      </div>
    );
  }

  if (error || !paciente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          )}
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error al cargar el perfil</p>
            <p className="mt-1">{error || 'Paciente no encontrado'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Botón volver */}
        {onVolver && (
          <button
            onClick={onVolver}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al listado
          </button>
        )}

        {/* Header del paciente */}
        <PacienteHeader paciente={paciente} />

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Navegación de pestañas */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenido de las pestañas */}
          <div className="p-6">
            {activeTab === 'info-general' && (
              <PacienteInfoGeneralTab paciente={paciente} onUpdate={handleUpdate} />
            )}
            {activeTab === 'historia-clinica' && (
              <PacienteHistoriaClinicaTab paciente={paciente} />
            )}
            {activeTab === 'odontograma' && (
              <PacienteOdontogramaTab paciente={paciente} />
            )}
            {activeTab === 'planes-tratamiento' && (
              <PacientePlanesTratamientoTab paciente={paciente} />
            )}
            {activeTab === 'citas' && <PacienteCitasTab paciente={paciente} />}
            {activeTab === 'historial-visitas' && (
              <HistorialVisitasPage pacienteId={pacienteId} />
            )}
            {activeTab === 'financiero' && (
              <PacienteFinancieroTab paciente={paciente} />
            )}
            {activeTab === 'documentos' && (
              <PacienteDocumentosTab paciente={paciente} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

