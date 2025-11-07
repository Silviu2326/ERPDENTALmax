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
        <h3 className="text-lg font-semibold text-gray-900">Editor de Contenido</h3>
        <div className="flex items-center gap-2">
          {onPreview && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
            >
              <Eye size={20} />
              {showPreview ? 'Editar' : 'Vista Previa'}
            </button>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all"
          >
            <Save size={20} />
            Guardar
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 p-6">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="font-semibold text-gray-900">Vista Previa</h4>
            <button
              onClick={() => setShowPreview(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 overflow-hidden">
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="w-full h-96 p-4 border-0 focus:ring-0 focus:outline-none resize-none font-mono text-sm text-slate-900 bg-white"
            placeholder="Escribe o pega el contenido HTML del email aquí..."
          />
        </div>
      )}

      <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200">
        <p className="font-medium mb-2 text-slate-700">Consejos:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Puedes usar HTML para formatear el contenido</li>
          <li>Incluye siempre un enlace de baja en el pie del email</li>
          <li>Usa estilos inline para mejor compatibilidad con clientes de email</li>
        </ul>
      </div>
    </div>
  );
}



