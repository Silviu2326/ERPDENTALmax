import { useState, useEffect } from 'react';
import { Save, Eye, X } from 'lucide-react';
import { EmailCampaign, EmailTemplate } from '../api/campaignsApi';

interface CampaignEditorProps {
  campaign?: EmailCampaign;
  template?: EmailTemplate | null;
  onSave: (content: string) => void;
  onPreview?: () => void;
}

export default function CampaignEditor({
  campaign,
  template,
  onSave,
  onPreview,
}: CampaignEditorProps) {
  const [htmlContent, setHtmlContent] = useState(
    campaign?.htmlContent || template?.htmlContent || ''
  );
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (template?.htmlContent) {
      setHtmlContent(template.htmlContent);
    } else if (campaign?.htmlContent) {
      setHtmlContent(campaign.htmlContent);
    }
  }, [template, campaign]);

  const handleSave = () => {
    onSave(htmlContent);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Editor de Contenido</h3>
        <div className="flex items-center gap-2">
          {onPreview && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Editar' : 'Vista Previa'}
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="mb-4 flex items-center justify-between border-b pb-2">
            <h4 className="font-medium text-gray-900">Vista Previa</h4>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg">
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="w-full h-96 p-4 border-0 focus:ring-0 focus:outline-none resize-none font-mono text-sm"
            placeholder="Escribe o pega el contenido HTML del email aquí..."
          />
        </div>
      )}

      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Consejos:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Puedes usar HTML para formatear el contenido</li>
          <li>Incluye siempre un enlace de baja en el pie del email</li>
          <li>Usa estilos inline para mejor compatibilidad con clientes de email</li>
        </ul>
      </div>
    </div>
  );
}


