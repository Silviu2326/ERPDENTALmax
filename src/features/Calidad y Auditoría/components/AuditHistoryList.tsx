import { Calendar, User, FileText, CheckCircle2, Clock } from 'lucide-react';
import { AuditInstance } from '../api/auditTemplatesApi';

interface AuditHistoryListProps {
  audits: AuditInstance[];
  onViewDetail?: (audit: AuditInstance) => void;
}

export default function AuditHistoryList({
  audits,
  onViewDetail,
}: AuditHistoryListProps) {
  if (audits.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No hay auditorías registradas</p>
        <p className="text-gray-500 text-sm mt-2">
          Las auditorías completadas aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {audits.map((audit) => (
        <div
          key={audit._id}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {audit.template?.name || 'Plantilla de Auditoría'}
                </h3>
                {audit.status === 'completed' ? (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Completada
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    En progreso
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>
                    {audit.odontologist?.nombre} {audit.odontologist?.apellidos}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {audit.completionDate
                      ? new Date(audit.completionDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : audit.createdAt
                      ? new Date(audit.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Fecha no disponible'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{audit.answers.length} respuestas</span>
                </div>
              </div>

              {audit.template?.description && (
                <p className="text-sm text-gray-500 mb-4">
                  {audit.template.description}
                </p>
              )}
            </div>

            {onViewDetail && (
              <button
                onClick={() => onViewDetail(audit)}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Detalle
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


