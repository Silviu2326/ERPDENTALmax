import { useState, useEffect } from 'react';
import { FileText, Plus, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import ReportBuilderWizard from '../components/ReportBuilderWizard';
import SavedReportsList from '../components/SavedReportsList';
import {
  getSavedReports,
  deleteSavedReport,
  getSavedReportById,
  SavedReport,
} from '../api/informesConfigurablesApi';

type ViewMode = 'list' | 'builder' | 'view';

export default function InformesConfigurablesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    if (viewMode === 'list') {
      loadSavedReports();
    }
  }, [viewMode]);

  const loadSavedReports = async () => {
    setLoading(true);
    try {
      const reports = await getSavedReports();
      setSavedReports(reports);
    } catch (error) {
      console.error('Error al cargar informes guardados:', error);
      alert('Error al cargar los informes guardados');
    } finally {
      setLoading(false);
    }
  };

  const handleNewReport = () => {
    setSelectedReportId(null);
    setViewMode('builder');
  };

  const handleRunReport = async (reportId: string) => {
    setSelectedReportId(reportId);
    setViewMode('view');
  };

  const handleEditReport = async (reportId: string) => {
    setSelectedReportId(reportId);
    setViewMode('builder');
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteSavedReport(reportId);
      await loadSavedReports();
      alert('Informe eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar informe:', error);
      alert('Error al eliminar el informe');
    }
  };

  const handleReportSaved = () => {
    setViewMode('list');
    loadSavedReports();
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedReportId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {(viewMode === 'list' || viewMode === 'builder') && (
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      {viewMode === 'list'
                        ? 'Informes Configurables'
                        : selectedReportId
                        ? 'Editar Informe'
                        : 'Nuevo Informe'}
                    </h1>
                    <p className="text-gray-600">
                      {viewMode === 'list'
                        ? 'Crea y gestiona informes personalizados para analizar los datos de tu clínica'
                        : 'Utiliza el asistente para crear un informe personalizado'}
                    </p>
                  </div>
                </div>
                {viewMode === 'list' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={loadSavedReports}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                      <span>Actualizar</span>
                    </button>
                    <button
                      onClick={handleNewReport}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={20} />
                      <span>Nuevo Informe</span>
                    </button>
                  </div>
                )}
                {viewMode === 'builder' && (
                  <button
                    onClick={handleBackToList}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <span>Volver a Lista</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {viewMode === 'list' && (
          <div className="space-y-6">
            <SavedReportsList
              reports={savedReports}
              loading={loading}
              onRunReport={handleRunReport}
              onEditReport={handleEditReport}
              onDeleteReport={handleDeleteReport}
            />
          </div>
        )}

        {viewMode === 'builder' && (
          <ReportBuilderWizard
            onSave={handleReportSaved}
            initialConfig={
              selectedReportId
                ? savedReports.find((r) => r._id === selectedReportId)?.configuracion
                : undefined
            }
          />
        )}

        {viewMode === 'view' && selectedReportId && (
          <ViewReportPage reportId={selectedReportId} onBack={handleBackToList} />
        )}
      </div>
    </div>
  );
}

// Componente para ver un informe guardado
function ViewReportPage({
  reportId,
  onBack,
}: {
  reportId: string;
  onBack: () => void;
}) {
  const [report, setReport] = useState<SavedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const savedReport = await getSavedReportById(reportId);
      setReport(savedReport);
      // Generar el informe automáticamente
      await generateReportData(savedReport.configuracion);
    } catch (error) {
      console.error('Error al cargar informe:', error);
      alert('Error al cargar el informe');
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = async (config: any) => {
    setGenerating(true);
    try {
      const { generateReport } = await import('../api/informesConfigurablesApi');
      const data = await generateReport(config);
      setReportData(data);
    } catch (error: any) {
      console.error('Error al generar informe:', error);
      alert(error.message || 'Error al generar el informe');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando informe...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">No se pudo cargar el informe</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {report.nombre}
                  </h1>
                  {report.descripcion && (
                    <p className="text-gray-600">{report.descripcion}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateReportData(report.configuracion)}
                  disabled={generating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={20} className={generating ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <span>Volver</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {generating ? (
        <div className="bg-white shadow-sm rounded-xl p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Generando informe...</p>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {report.configuracion.visualizationType === 'table' ? (
            <div>
              {(() => {
                const { default: ReportDataTable } = require('../components/ReportDataTable');
                return (
                  <ReportDataTable
                    data={reportData.data}
                    columns={reportData.columns}
                    totalRecords={reportData.totalRecords}
                  />
                );
              })()}
            </div>
          ) : (
            <div>
              {(() => {
                const { default: ReportChartRenderer } = require('../components/ReportChartRenderer');
                return (
                  <ReportChartRenderer
                    data={reportData.data}
                    visualizationType={report.configuracion.visualizationType || 'table'}
                    grouping={report.configuracion.grouping?.map((g: any) => g.field) || []}
                    aggregation={report.configuracion.aggregation || []}
                  />
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos</h3>
          <p className="text-gray-600 mb-4">No hay datos para mostrar</p>
          <button
            onClick={() => generateReportData(report.configuracion)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generar Informe
          </button>
        </div>
      )}
    </div>
  );
}



