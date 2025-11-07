import { SavedReport } from '../api/informesConfigurablesApi';
import { FileText, Play, Edit, Trash2, Calendar, Loader2 } from 'lucide-react';

interface SavedReportsListProps {
  reports: SavedReport[];
  loading?: boolean;
  onRunReport: (reportId: string) => void;
  onEditReport?: (reportId: string) => void;
  onDeleteReport?: (reportId: string) => void;
}

export default function SavedReportsList({
  reports,
  loading = false,
  onRunReport,
  onEditReport,
  onDeleteReport,
}: SavedReportsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay informes guardados</h3>
        <p className="text-gray-600 mb-4">
          Crea y guarda informes para acceder rápidamente a ellos
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Informes Guardados</h3>
        <p className="text-sm text-gray-600">
          {reports.length} {reports.length === 1 ? 'informe guardado' : 'informes guardados'}
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report._id}
            className="rounded-xl ring-1 ring-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={18} className="text-blue-600" />
                  <h4 className="text-base font-semibold text-gray-900">{report.nombre}</h4>
                </div>
                {report.descripcion && (
                  <p className="text-sm text-gray-600 mb-3">{report.descripcion}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Creado: {formatDate(report.fechaCreacion)}</span>
                  </div>
                  <span>•</span>
                  <span>Fuente: {report.configuracion.dataSource}</span>
                  <span>•</span>
                  <span>
                    {report.configuracion.columns.length}{' '}
                    {report.configuracion.columns.length === 1 ? 'columna' : 'columnas'}
                  </span>
                  {report.configuracion.visualizationType && (
                    <>
                      <span>•</span>
                      <span>
                        Visualización:{' '}
                        {report.configuracion.visualizationType === 'table'
                          ? 'Tabla'
                          : report.configuracion.visualizationType === 'bar'
                          ? 'Barras'
                          : report.configuracion.visualizationType === 'line'
                          ? 'Líneas'
                          : 'Circular'}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onRunReport(report._id)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Ejecutar informe"
                >
                  <Play size={18} />
                </button>
                {onEditReport && (
                  <button
                    onClick={() => onEditReport(report._id)}
                    className="p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    title="Editar informe"
                  >
                    <Edit size={18} />
                  </button>
                )}
                {onDeleteReport && (
                  <button
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de que deseas eliminar este informe?')) {
                        onDeleteReport(report._id);
                      }
                    }}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    title="Eliminar informe"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



