import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calendar, Mail, Loader2 } from 'lucide-react';
import {
  EmailCampaign,
  EmailTemplate,
  crearCampana,
  actualizarCampana,
  programarCampana,
  obtenerCampanaPorId,
} from '../api/campaignsApi';
import EmailTemplateSelector from '../components/EmailTemplateSelector';
import PatientSegmentBuilder from '../components/PatientSegmentBuilder';
import CampaignEditor from '../components/CampaignEditor';
import CampaignSchedulerModal from '../components/CampaignSchedulerModal';
import { SegmentCriteria } from '../api/campaignsApi';

interface CreateEditCampaignPageProps {
  campaign?: EmailCampaign;
  onVolver: () => void;
  onGuardado: () => void;
}

export default function CreateEditCampaignPage({
  campaign,
  onVolver,
  onGuardado,
}: CreateEditCampaignPageProps) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [segmentCriteria, setSegmentCriteria] = useState<SegmentCriteria>({});
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);

  const isEditMode = !!campaign?._id;

  useEffect(() => {
    if (campaign?._id) {
      cargarCampana();
    }
  }, [campaign?._id]);

  const cargarCampana = async () => {
    if (!campaign?._id) return;

    try {
      setLoading(true);
      const campanaCompleta = await obtenerCampanaPorId(campaign._id);
      setName(campanaCompleta.name);
      setSubject(campanaCompleta.subject);
      setHtmlContent(campanaCompleta.htmlContent);
      setSegmentCriteria(campanaCompleta.segmentCriteria || {});
    } catch (err) {
      setError('Error al cargar la campaña');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarBorrador = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isEditMode && campaign?._id) {
        await actualizarCampana(campaign._id, {
          name,
          subject,
          htmlContent,
          segmentCriteria,
        });
      } else {
        await crearCampana({
          name,
          subject,
          templateId: selectedTemplate?._id,
          segmentCriteria,
        });
      }

      onGuardado();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la campaña');
    } finally {
      setLoading(false);
    }
  };

  const handleProgramar = async (scheduledAt: string) => {
    try {
      setLoading(true);
      setError(null);

      let campaignId = campaign?._id;

      if (!campaignId) {
        // Crear primero si no existe
        const nuevaCampana = await crearCampana({
          name,
          subject,
          templateId: selectedTemplate?._id,
          segmentCriteria,
        });
        campaignId = nuevaCampana._id!;
      } else {
        // Actualizar si existe
        await actualizarCampana(campaignId, {
          name,
          subject,
          htmlContent,
          segmentCriteria,
        });
      }

      // Programar
      await programarCampana(campaignId, scheduledAt);
      setShowScheduler(false);
      onGuardado();
    } catch (err: any) {
      setError(err.message || 'Error al programar la campaña');
    } finally {
      setLoading(false);
    }
  };

  const handleSegmentChange = (criteria: SegmentCriteria) => {
    setSegmentCriteria(criteria);
    // Actualizar conteo de pacientes
    // Esto se hará automáticamente en PatientSegmentBuilder
  };

  if (loading && !name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-2xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <button
                onClick={onVolver}
                className="p-2 bg-slate-100 rounded-xl mr-4 ring-1 ring-slate-200/70 hover:bg-slate-200 transition-all"
              >
                <ArrowLeft size={24} className="text-slate-600" />
              </button>
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Mail size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {isEditMode ? 'Editar Campaña' : 'Nueva Campaña'}
                </h1>
                <p className="text-gray-600">
                  {isEditMode
                    ? 'Modifica los detalles de tu campaña'
                    : 'Crea una nueva campaña de email para tus pacientes'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {error && (
            <div className="bg-white shadow-sm rounded-2xl p-4 ring-1 ring-red-200 bg-red-50">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="bg-white shadow-sm rounded-2xl p-6 space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la Campaña *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                  placeholder="Ej: Recordatorio de Higiene Dental"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Asunto del Email *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                  placeholder="Ej: Recordatorio: Tu cita de revisión"
                />
              </div>
            </div>

            {/* Selector de plantilla */}
            {!isEditMode && (
              <div>
                <EmailTemplateSelector
                  selectedTemplateId={selectedTemplate?._id}
                  onSelectTemplate={(template) => {
                    setSelectedTemplate(template);
                    if (template?.htmlContent) {
                      setHtmlContent(template.htmlContent);
                    }
                  }}
                />
              </div>
            )}

            {/* Segmentación de pacientes */}
            <div>
              <PatientSegmentBuilder
                segmentCriteria={segmentCriteria}
                onChange={handleSegmentChange}
              />
            </div>

            {/* Editor de contenido */}
            <div>
              <CampaignEditor
                campaign={campaign}
                template={selectedTemplate}
                onSave={(content) => setHtmlContent(content)}
              />
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={onVolver}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarBorrador}
                disabled={!name || !subject || loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-xl hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
              >
                <Save size={20} />
                Guardar como Borrador
              </button>
              <button
                onClick={() => setShowScheduler(true)}
                disabled={!name || !subject || loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
              >
                <Calendar size={20} />
                Programar Envío
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de programación */}
      <CampaignSchedulerModal
        isOpen={showScheduler}
        onClose={() => setShowScheduler(false)}
        onSchedule={handleProgramar}
        campaignName={name}
        recipientCount={recipientCount || undefined}
      />
    </div>
  );
}



