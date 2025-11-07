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
      className={`bg-white rounded-xl shadow-sm ring-1 ring-slate-200 transition-shadow h-full flex flex-col overflow-hidden ${
        selectable
          ? 'cursor-pointer hover:shadow-md hover:ring-2 hover:ring-blue-400'
          : ''
      } ${template.isActive ? '' : 'opacity-60'}`}
      onClick={handleSelect}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              {template.isActive ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{template.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="font-medium">{template.items.length} ítems</span>
              {template.createdAt && (
                <span>
                  Creado: {new Date(template.createdAt).toLocaleDateString('es-ES')}
                </span>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(template);
                }}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <Edit2 size={16} />
                <span>Editar</span>
              </button>
            )}
            {onArchive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(template._id!);
                }}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
              >
                <Archive size={16} />
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
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all ml-auto"
              >
                <Trash2 size={16} />
                <span>Eliminar</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



