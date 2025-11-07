import { useState, useEffect } from 'react';
import { RefreshCw, FileText, AlertCircle, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <RefreshCw size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando informe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error || 'No se pudo cargar el informe'}</p>
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700"
              >
                <ArrowLeft size={18} />
                <span>Volver</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileText size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {report.nombre}
                  </h1>
                  {report.descripcion && (
                    <p className="text-gray-600">
                      {report.descripcion}
                    </p>
                  )}
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateReportData(report.configuracion)}
                  disabled={generating}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={20} className={generating ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>
                {onBack && (
                  <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-slate-600 text-white hover:bg-slate-700"
                  >
                    <ArrowLeft size={20} />
                    <span>Volver</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {generating ? (
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <RefreshCw size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Generando informe...</p>
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
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos para mostrar</h3>
            <p className="text-gray-600 mb-4">Genera el informe para ver los datos</p>
            <button
              onClick={() => generateReportData(report.configuracion)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700"
            >
              <RefreshCw size={20} />
              <span>Generar Informe</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



