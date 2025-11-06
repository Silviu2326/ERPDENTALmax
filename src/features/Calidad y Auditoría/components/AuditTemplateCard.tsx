import { Edit2, Trash2, Archive, CheckCircle2, XCircle } from 'lucide-react';
import { AuditTemplate } from '../api/auditTemplatesApi';

interface AuditTemplateCardProps {
  template: AuditTemplate;
  onEdit?: (template: AuditTemplate) => void;
  onDelete?: (templateId: string) => void;
  onArchive?: (templateId: string) => void;
  onSelect?: (template: AuditTemplate) => void;
  showActions?: boolean;
  selectable?: boolean;
}

export default function AuditTemplateCard({
  template,
  onEdit,
  onDelete,
  onArchive,
  onSelect,
  showActions = true,
  selectable = false,
}: AuditTemplateCardProps) {
  const handleSelect = () => {
    if (selectable && onSelect) {
      onSelect(template);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md border-2 transition-all duration-200 ${
        selectable
          ? 'cursor-pointer hover:border-blue-500 hover:shadow-lg'
          : 'border-gray-200'
      } ${template.isActive ? '' : 'opacity-60'}`}
      onClick={handleSelect}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
              {template.isActive ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3">{template.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{template.items.length} ítems</span>
              {template.createdAt && (
                <span>
                  Creado: {new Date(template.createdAt).toLocaleDateString('es-ES')}
                </span>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(template);
                }}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Editar</span>
              </button>
            )}
            {onArchive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(template._id!);
                }}
                className="flex items-center gap-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <Archive className="w-4 h-4" />
                <span>{template.isActive ? 'Archivar' : 'Activar'}</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('¿Está seguro de eliminar esta plantilla?')) {
                    onDelete(template._id!);
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


