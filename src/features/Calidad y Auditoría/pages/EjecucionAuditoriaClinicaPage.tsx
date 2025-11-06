import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import {
  obtenerPlantillasAuditoria,
  crearInstanciaAuditoria,
  actualizarInstanciaAuditoria,
  obtenerInstanciaAuditoriaPorId,
  AuditTemplate,
  AuditInstance,
} from '../api/auditTemplatesApi';
import AuditTemplateCard from '../components/AuditTemplateCard';
import ChecklistRunnerForm from '../components/ChecklistRunnerForm';

interface EjecucionAuditoriaClinicaPageProps {
  patientId?: string;
  onVolver?: () => void;
}

export default function EjecucionAuditoriaClinicaPage({
  patientId,
  onVolver,
}: EjecucionAuditoriaClinicaPageProps) {
  const [templates, setTemplates] = useState<AuditTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<AuditTemplate | null>(null);
  const [auditInstance, setAuditInstance] = useState<AuditInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    try {
      setLoading(true);
      setError(null);
      const plantillas = await obtenerPlantillasAuditoria();
      // Solo mostrar plantillas activas
      setTemplates(plantillas.filter((t) => t.isActive));
    } catch (err: any) {
      setError(err.message || 'Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = async (template: AuditTemplate) => {
    if (!patientId) {
      alert('Debe seleccionar un paciente primero');
      return;
    }

    try {
      // TODO: Obtener odontologistId del usuario actual
      const odontologistId = 'current-user-id'; // Temporal
      const clinicId = 'current-clinic-id'; // Temporal

      // Crear nueva instancia de auditoría
      const nuevaInstancia = await crearInstanciaAuditoria({
        templateId: template._id!,
        patientId,
        odontologistId,
      });

      // Cargar la instancia completa con la plantilla
      const instanciaCompleta = await obtenerInstanciaAuditoriaPorId(nuevaInstancia._id!);
      setAuditInstance(instanciaCompleta);
      setSelectedTemplate(template);
    } catch (err: any) {
      alert(err.message || 'Error al iniciar auditoría');
    }
  };

  const handleSave = async (
    answers: any[],
    status: 'in-progress' | 'completed'
  ): Promise<void> => {
    if (!auditInstance?._id) return;

    try {
      const instanciaActualizada = await actualizarInstanciaAuditoria(
        auditInstance._id,
        {
          answers,
          status,
        }
      );

      setAuditInstance(instanciaActualizada);

      if (status === 'completed') {
        alert('Auditoría completada exitosamente');
        // Opcional: volver a la lista o cerrar
        if (onVolver) {
          onVolver();
        }
      }
    } catch (err: any) {
      throw new Error(err.message || 'Error al guardar auditoría');
    }
  };

  const handleVolver = () => {
    setSelectedTemplate(null);
    setAuditInstance(null);
  };

  // Si hay una plantilla seleccionada, mostrar el formulario
  if (selectedTemplate && auditInstance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            {onVolver && (
              <button
                onClick={handleVolver}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-white rounded-lg transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver a plantillas
              </button>
            )}
          </div>
          <ChecklistRunnerForm
            template={selectedTemplate}
            auditInstance={auditInstance}
            onSave={handleSave}
            disabled={auditInstance.status === 'completed'}
          />
        </div>
      </div>
    );
  }

  // Mostrar lista de plantillas
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
                  Ejecutar Auditoría Clínica
                </h1>
                <p className="text-gray-600 text-lg">
                  Selecciona una plantilla para iniciar una auditoría
                </p>
                {!patientId && (
                  <div className="mt-3 flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">
                      Advertencia: No se ha seleccionado un paciente
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={cargarPlantillas}
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
          /* Lista de plantillas */
          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">
                  No hay plantillas de auditoría disponibles
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <AuditTemplateCard
                    key={template._id}
                    template={template}
                    onSelect={handleSelectTemplate}
                    selectable={true}
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


