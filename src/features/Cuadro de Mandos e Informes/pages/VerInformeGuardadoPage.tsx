import { useState, useEffect } from 'react';
import { RefreshCw, FileText } from 'lucide-react';
import { getSavedReportById, generateReport, SavedReport } from '../api/informesConfigurablesApi';
import ReportDataTable from '../components/ReportDataTable';
import ReportChartRenderer from '../components/ReportChartRenderer';

interface VerInformeGuardadoPageProps {
  reportId: string;
  onBack?: () => void;
}

export default function VerInformeGuardadoPage({
  reportId,
  onBack,
}: VerInformeGuardadoPageProps) {
  const [report, setReport] = useState<SavedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const savedReport = await getSavedReportById(reportId);
      setReport(savedReport);
      // Generar el informe automáticamente al cargar
      await generateReportData(savedReport.configuracion);
    } catch (err: any) {
      console.error('Error al cargar informe:', err);
      setError(err.message || 'Error al cargar el informe');
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = async (config: any) => {
    setGenerating(true);
    setError(null);
    try {
      const data = await generateReport(config);
      setReportData(data);
    } catch (err: any) {
      console.error('Error al generar informe:', err);
      setError(err.message || 'Error al generar el informe');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando informe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800 font-semibold">{error || 'No se pudo cargar el informe'}</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Volver
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.nombre}</h1>
            {report.descripcion && <p className="text-gray-600">{report.descripcion}</p>}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => generateReportData(report.configuracion)}
              disabled={generating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Volver
              </button>
            )}
          </div>
        </div>
      </div>

      {generating ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Generando informe...</p>
          </div>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {report.configuracion.visualizationType === 'table' ? (
            <ReportDataTable
              data={reportData.data}
              columns={reportData.columns}
              totalRecords={reportData.totalRecords}
            />
          ) : (
            <ReportChartRenderer
              data={reportData.data}
              visualizationType={report.configuracion.visualizationType || 'table'}
              grouping={report.configuracion.grouping?.map((g: any) => g.field) || []}
              aggregation={report.configuracion.aggregation || []}
            />
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay datos para mostrar</p>
          <button
            onClick={() => generateReportData(report.configuracion)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generar Informe
          </button>
        </div>
      )}
    </div>
  );
}


