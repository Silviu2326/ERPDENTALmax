import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calendar, Mail } from 'lucide-react';
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onVolver}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Campaña' : 'Nueva Campaña'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {isEditMode
                ? 'Modifica los detalles de tu campaña'
                : 'Crea una nueva campaña de email para tus pacientes'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Información básica */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Campaña *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Recordatorio de Higiene Dental"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asunto del Email *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onVolver}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardarBorrador}
            disabled={!name || !subject || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 inline mr-2" />
            Guardar como Borrador
          </button>
          <button
            onClick={() => setShowScheduler(true)}
            disabled={!name || !subject || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Programar Envío
          </button>
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


