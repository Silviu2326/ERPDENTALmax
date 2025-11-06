import { useState, useEffect } from 'react';
import { FileText, Plus, RefreshCw } from 'lucide-react';
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
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {viewMode === 'list' && (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Informes Configurables
                </h1>
                <p className="text-gray-600">
                  Crea y gestiona informes personalizados para analizar los datos de tu clínica
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={loadSavedReports}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>
                <button
                  onClick={handleNewReport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Informe</span>
                </button>
              </div>
            </div>
          </div>

          <SavedReportsList
            reports={savedReports}
            loading={loading}
            onRunReport={handleRunReport}
            onEditReport={handleEditReport}
            onDeleteReport={handleDeleteReport}
          />
        </>
      )}

      {viewMode === 'builder' && (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedReportId ? 'Editar Informe' : 'Nuevo Informe'}
                </h1>
                <p className="text-gray-600">
                  Utiliza el asistente para crear un informe personalizado
                </p>
              </div>
              <button
                onClick={handleBackToList}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Volver a Lista
              </button>
            </div>
          </div>

          <ReportBuilderWizard
            onSave={handleReportSaved}
            initialConfig={
              selectedReportId
                ? savedReports.find((r) => r._id === selectedReportId)?.configuracion
                : undefined
            }
          />
        </>
      )}

      {viewMode === 'view' && selectedReportId && (
        <ViewReportPage reportId={selectedReportId} onBack={handleBackToList} />
      )}
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando informe...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-800 font-semibold">No se pudo cargar el informe</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.nombre}</h1>
            {report.descripcion && (
              <p className="text-gray-600">{report.descripcion}</p>
            )}
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
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Volver
            </button>
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
    </>
  );
}


