import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Eye } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleVolver}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-white rounded-lg transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al historial
            </button>
          </div>
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
    );
  }

  // Mostrar historial
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Historial de Auditorías
                </h1>
                <p className="text-gray-600 text-lg">
                  Auditorías clínicas completadas para este paciente
                </p>
              </div>
            </div>
            <button
              onClick={cargarAuditorias}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Actualizar
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : (
          <AuditHistoryList audits={audits} onViewDetail={handleViewDetail} />
        )}
      </div>
    </div>
  );
}


