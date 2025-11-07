import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, User, FileText, Stethoscope, ClipboardList, Calendar, History, DollarSign, Paperclip, AlertCircle } from 'lucide-react';
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
    { id: 'info-general' as TabType, label: 'Información General', icon: User },
    { id: 'historia-clinica' as TabType, label: 'Historia Clínica', icon: FileText },
    { id: 'odontograma' as TabType, label: 'Odontograma', icon: Stethoscope },
    { id: 'planes-tratamiento' as TabType, label: 'Planes de Tratamiento', icon: ClipboardList },
    { id: 'citas' as TabType, label: 'Citas', icon: Calendar },
    { id: 'historial-visitas' as TabType, label: 'Historial de Visitas', icon: History },
    { id: 'financiero' as TabType, label: 'Financiero', icon: DollarSign },
    { id: 'documentos' as TabType, label: 'Documentos', icon: Paperclip },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-2xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando perfil del paciente...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paciente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {onVolver && (
            <button
              onClick={onVolver}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          )}
          <div className="bg-white shadow-sm rounded-2xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar el perfil</h3>
            <p className="text-gray-600 mb-4">{error || 'Paciente no encontrado'}</p>
          </div>
        </div>
      </div>
    );
  }

  const nombreCompleto = `${paciente.nombre} ${paciente.apellidos}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header de la página */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <User size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {nombreCompleto}
                  </h1>
                  <p className="text-gray-600">
                    Perfil completo del paciente e historia clínica
                  </p>
                </div>
              </div>

              {/* Botón volver */}
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
                >
                  <ArrowLeft size={18} />
                  Volver
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Header del paciente */}
          <PacienteHeader paciente={paciente} />

          {/* Sistema de Tabs */}
          <div className="bg-white shadow-sm rounded-2xl p-0">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones del paciente"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                      role="tab"
                      aria-selected={isActive}
                    >
                      <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contenido de las pestañas */}
            <div className="px-4 pb-4">
              <div className="mt-6">
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
      </div>
    </div>
  );
}

