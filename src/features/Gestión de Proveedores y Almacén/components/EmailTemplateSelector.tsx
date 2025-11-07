import { useState, useEffect } from 'react';
import { FileText, Check, Loader2, AlertCircle } from 'lucide-react';
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
      <div className="bg-white shadow-sm rounded-2xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando plantillas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-2xl p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Seleccionar Plantilla</h3>
        <button
          onClick={() => onSelectTemplate(null)}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-all"
        >
          Sin plantilla
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <button
            key={template._id}
            onClick={() => onSelectTemplate(template)}
            className={`relative h-full flex flex-col p-4 bg-white shadow-sm rounded-2xl text-left transition-all overflow-hidden hover:shadow-md ${
              selectedTemplateId === template._id
                ? 'ring-2 ring-blue-600 bg-blue-50'
                : 'ring-1 ring-slate-200 hover:ring-slate-300'
            }`}
          >
            {selectedTemplateId === template._id && (
              <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1.5 shadow-sm">
                <Check size={16} className="text-white" />
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {template.thumbnailUrl ? (
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center ring-1 ring-slate-200">
                    <FileText size={32} className="text-slate-400" />
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
        <div className="bg-white shadow-sm rounded-2xl p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay plantillas disponibles</h3>
          <p className="text-gray-600">No se encontraron plantillas de email en el sistema.</p>
        </div>
      )}
    </div>
  );
}



