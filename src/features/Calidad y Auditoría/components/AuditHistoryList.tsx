import { Calendar, User, FileText, CheckCircle2, Clock, Eye } from 'lucide-react';
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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay auditorías registradas</h3>
        <p className="text-gray-600 mb-4">
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
          className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow ring-1 ring-gray-200/60"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {audit.template?.name || 'Plantilla de Auditoría'}
                </h3>
                {audit.status === 'completed' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium ring-1 ring-green-200/70">
                    <CheckCircle2 size={12} />
                    Completada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium ring-1 ring-yellow-200/70">
                    <Clock size={12} />
                    En progreso
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} className="text-slate-400" />
                  <span>
                    {audit.odontologist?.nombre} {audit.odontologist?.apellidos}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-slate-400" />
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
                  <FileText size={16} className="text-slate-400" />
                  <span>{audit.answers.length} respuestas</span>
                </div>
              </div>

              {audit.template?.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {audit.template.description}
                </p>
              )}
            </div>

            {onViewDetail && (
              <div className="flex gap-2 md:flex-col">
                <button
                  onClick={() => onViewDetail(audit)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  <Eye size={18} />
                  Ver Detalle
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}



