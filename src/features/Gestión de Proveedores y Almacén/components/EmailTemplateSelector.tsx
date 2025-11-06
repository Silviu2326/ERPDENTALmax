import { useState, useEffect } from 'react';
import { FileText, Check } from 'lucide-react';
import { EmailTemplate, obtenerPlantillas } from '../api/campaignsApi';

interface EmailTemplateSelectorProps {
  selectedTemplateId?: string;
  onSelectTemplate: (template: EmailTemplate | null) => void;
}

export default function EmailTemplateSelector({
  selectedTemplateId,
  onSelectTemplate,
}: EmailTemplateSelectorProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    try {
      setLoading(true);
      const plantillas = await obtenerPlantillas();
      setTemplates(plantillas);
    } catch (err) {
      setError('Error al cargar las plantillas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Seleccionar Plantilla</h3>
        <button
          onClick={() => onSelectTemplate(null)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Sin plantilla
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template._id}
            onClick={() => onSelectTemplate(template)}
            className={`relative p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
              selectedTemplateId === template._id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedTemplateId === template._id && (
              <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {template.thumbnailUrl ? (
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {template.name}
                </h4>
              </div>
            </div>
          </button>
        ))}
      </div>
      {templates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No hay plantillas disponibles</p>
        </div>
      )}
    </div>
  );
}


