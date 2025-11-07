import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, History, Loader2, AlertCircle } from 'lucide-react';
import {
  obtenerAuditoriasPorPaciente,
  obtenerInstanciaAuditoriaPorId,
  AuditInstance,
  AuditTemplate,
} from '../api/auditTemplatesApi';
import AuditHistoryList from '../components/AuditHistoryList';
import ChecklistRunnerForm from '../components/ChecklistRunnerForm';

interface HistorialAuditoriasPacientePageProps {
  patientId: string;
  onVolver?: () => void;
}

export default function HistorialAuditoriasPacientePage({
  patientId,
  onVolver,
}: HistorialAuditoriasPacientePageProps) {
  const [audits, setAudits] = useState<AuditInstance[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<AuditInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarAuditorias();
  }, [patientId]);

  const cargarAuditorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const auditorias = await obtenerAuditoriasPorPaciente(patientId);
      setAudits(auditorias);
    } catch (err: any) {
      setError(err.message || 'Error al cargar auditorías');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (audit: AuditInstance) => {
    try {
      // Cargar la instancia completa con la plantilla
      const instanciaCompleta = await obtenerInstanciaAuditoriaPorId(audit._id!);
      setSelectedAudit(instanciaCompleta);
    } catch (err: any) {
      alert(err.message || 'Error al cargar detalles de la auditoría');
    }
  };

  const handleVolver = () => {
    setSelectedAudit(null);
  };

  // Si hay una auditoría seleccionada, mostrar el detalle
  if (selectedAudit && selectedAudit.template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <button
                  onClick={handleVolver}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                >
                  <ArrowLeft size={20} />
                </button>
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <History size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Detalle de Auditoría
                  </h1>
                  <p className="text-gray-600">
                    Revisión completa de la auditoría clínica
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <ChecklistRunnerForm
              template={selectedAudit.template}
              auditInstance={selectedAudit}
              onSave={async () => {
                // No se puede editar auditorías completadas
              }}
              disabled={true}
            />
          </div>
        </div>
      </div>
    );
  }

  // Mostrar historial
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <History size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Historial de Auditorías
                  </h1>
                  <p className="text-gray-600">
                    Auditorías clínicas completadas para este paciente
                  </p>
                </div>
              </div>
              <button
                onClick={cargarAuditorias}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <RefreshCw size={20} />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={cargarAuditorias}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </div>
          ) : (
            <AuditHistoryList audits={audits} onViewDetail={handleViewDetail} />
          )}
        </div>
      </div>
    </div>
  );
}



