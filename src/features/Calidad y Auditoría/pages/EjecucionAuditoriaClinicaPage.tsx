import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle, FileCheck, Loader2, Package } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={handleVolver}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <ArrowLeft size={24} className="text-gray-600" />
                  </button>
                )}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileCheck size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {selectedTemplate.name}
                  </h1>
                  <p className="text-gray-600">
                    {selectedTemplate.description || 'Completa la auditoría clínica'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
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
                    className="mr-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <ArrowLeft size={24} className="text-gray-600" />
                  </button>
                )}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileCheck size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Ejecutar Auditoría Clínica
                  </h1>
                  <p className="text-gray-600">
                    Selecciona una plantilla para iniciar una auditoría
                  </p>
                  {!patientId && (
                    <div className="mt-3 flex items-center gap-2 text-yellow-700 bg-yellow-100 border border-yellow-200 rounded-xl px-4 py-2">
                      <AlertCircle size={16} className="opacity-70" />
                      <span className="text-sm font-medium">
                        Advertencia: No se ha seleccionado un paciente
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={cargarPlantillas}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-xl ring-1 ring-slate-200 hover:bg-slate-50 transition-all"
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
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando plantillas...</p>
            </div>
          ) : (
            /* Lista de plantillas */
            <div className="space-y-6">
              {templates.length === 0 ? (
                <div className="bg-white shadow-sm rounded-xl p-8 text-center">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay plantillas disponibles
                  </h3>
                  <p className="text-gray-600 mb-4">
                    No se encontraron plantillas de auditoría activas
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
}



