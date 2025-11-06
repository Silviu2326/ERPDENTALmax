import { SavedReport } from '../api/informesConfigurablesApi';
import { FileText, Play, Edit, Trash2, Calendar } from 'lucide-react';

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
      <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No hay informes guardados</p>
          <p className="text-sm text-gray-500 mt-2">
            Crea y guarda informes para acceder rápidamente a ellos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">Informes Guardados</h3>
        <p className="text-sm text-gray-500">
          {reports.length} {reports.length === 1 ? 'informe guardado' : 'informes guardados'}
        </p>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report._id}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-800">{report.nombre}</h4>
                </div>
                {report.descripcion && (
                  <p className="text-sm text-gray-600 mb-3">{report.descripcion}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
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
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onRunReport(report._id)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Ejecutar informe"
                >
                  <Play className="w-4 h-4" />
                </button>
                {onEditReport && (
                  <button
                    onClick={() => onEditReport(report._id)}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    title="Editar informe"
                  >
                    <Edit className="w-4 h-4" />
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
                    <Trash2 className="w-4 h-4" />
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


