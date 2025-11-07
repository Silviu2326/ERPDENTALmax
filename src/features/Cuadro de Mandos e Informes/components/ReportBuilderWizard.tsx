import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Save, Play, X } from 'lucide-react';
import DataSourceSelector from './DataSourceSelector';
import ColumnPicker from './ColumnPicker';
import FilterBuilderUI from './FilterBuilderUI';
import GroupingAndAggregationControls from './GroupingAndAggregationControls';
import VisualizationSelector, { VisualizationType } from './VisualizationSelector';
import ReportDataTable from './ReportDataTable';
import ReportChartRenderer from './ReportChartRenderer';
import {
  getReportMetadata,
  generateReport,
  createSavedReport,
  DataSourceMetadata,
  ReportConfiguration,
  ReportData,
  FilterGroup,
  GroupingConfig,
  AggregationConfig,
} from '../api/informesConfigurablesApi';

interface ReportBuilderWizardProps {
  onSave?: (reportId: string) => void;
  initialConfig?: ReportConfiguration;
}

type WizardStep = 'dataSource' | 'columns' | 'filters' | 'grouping' | 'visualization' | 'results';

export default function ReportBuilderWizard({
  onSave,
  initialConfig,
}: ReportBuilderWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('dataSource');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<DataSourceMetadata[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(
    initialConfig?.dataSource || null
  );
  const [columns, setColumns] = useState<string[]>(initialConfig?.columns || []);
  const [filters, setFilters] = useState<FilterGroup[]>(initialConfig?.filters || []);
  const [grouping, setGrouping] = useState<GroupingConfig[]>(initialConfig?.grouping || []);
  const [aggregation, setAggregation] = useState<AggregationConfig[]>(
    initialConfig?.aggregation || []
  );
  const [visualizationType, setVisualizationType] = useState<VisualizationType>(
    initialConfig?.visualizationType || 'table'
  );
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    setLoading(true);
    try {
      const data = await getReportMetadata();
      setMetadata(data);
    } catch (error) {
      console.error('Error al cargar metadatos:', error);
      alert('Error al cargar las fuentes de datos disponibles');
    } finally {
      setLoading(false);
    }
  };

  const selectedDataSourceMetadata = metadata.find((m) => m.dataSource === selectedDataSource);
  const availableFields = selectedDataSourceMetadata?.fields || [];

  const steps: Array<{ id: WizardStep; label: string }> = [
    { id: 'dataSource', label: 'Fuente de Datos' },
    { id: 'columns', label: 'Columnas' },
    { id: 'filters', label: 'Filtros' },
    { id: 'grouping', label: 'Agrupación' },
    { id: 'visualization', label: 'Visualización' },
    { id: 'results', label: 'Resultados' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const canGoNext = () => {
    switch (currentStep) {
      case 'dataSource':
        return selectedDataSource !== null;
      case 'columns':
        return columns.length > 0;
      case 'filters':
        return true; // Los filtros son opcionales
      case 'grouping':
        return true; // La agrupación es opcional
      case 'visualization':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 'visualization') {
      handleGenerateReport();
    } else {
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < steps.length) {
        setCurrentStep(steps[nextStepIndex].id);
      }
    }
  };

  const handlePrevious = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedDataSource) return;

    setLoading(true);
    try {
      const config: ReportConfiguration = {
        dataSource: selectedDataSource,
        columns,
        filters: filters.length > 0 ? filters : undefined,
        grouping: grouping.length > 0 ? grouping : undefined,
        aggregation: aggregation.length > 0 ? aggregation : undefined,
        visualizationType,
      };

      const data = await generateReport(config);
      setReportData(data);
      setCurrentStep('results');
    } catch (error: any) {
      console.error('Error al generar informe:', error);
      alert(error.message || 'Error al generar el informe');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!reportName.trim()) {
      alert('Por favor, ingresa un nombre para el informe');
      return;
    }

    setSaving(true);
    try {
      const config: ReportConfiguration = {
        dataSource: selectedDataSource!,
        columns,
        filters: filters.length > 0 ? filters : undefined,
        grouping: grouping.length > 0 ? grouping : undefined,
        aggregation: aggregation.length > 0 ? aggregation : undefined,
        visualizationType,
      };

      const savedReport = await createSavedReport({
        nombre: reportName,
        descripcion: reportDescription || undefined,
        configuracion: config,
      });

      setSaveModalOpen(false);
      setReportName('');
      setReportDescription('');
      if (onSave) {
        onSave(savedReport._id);
      }
      alert('Informe guardado exitosamente');
    } catch (error: any) {
      console.error('Error al guardar informe:', error);
      alert(error.message || 'Error al guardar el informe');
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'dataSource':
        return (
          <DataSourceSelector
            dataSources={metadata}
            selectedDataSource={selectedDataSource}
            onSelect={setSelectedDataSource}
            loading={loading}
          />
        );

      case 'columns':
        return (
          <ColumnPicker
            fields={availableFields}
            selectedColumns={columns}
            onColumnsChange={setColumns}
          />
        );

      case 'filters':
        return (
          <FilterBuilderUI
            fields={availableFields}
            filters={filters}
            onFiltersChange={setFilters}
          />
        );

      case 'grouping':
        return (
          <GroupingAndAggregationControls
            fields={availableFields}
            grouping={grouping}
            aggregation={aggregation}
            onGroupingChange={setGrouping}
            onAggregationChange={setAggregation}
          />
        );

      case 'visualization':
        return (
          <VisualizationSelector
            selectedType={visualizationType}
            onSelect={setVisualizationType}
            hasGrouping={grouping.length > 0}
            hasAggregation={aggregation.length > 0}
          />
        );

      case 'results':
        if (!reportData) {
          return (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <p className="text-gray-600">No hay datos para mostrar</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            {visualizationType === 'table' ? (
              <ReportDataTable
                data={reportData.data}
                columns={reportData.columns}
                totalRecords={reportData.totalRecords}
              />
            ) : (
              <ReportChartRenderer
                data={reportData.data}
                visualizationType={visualizationType}
                grouping={grouping.map((g) => g.field)}
                aggregation={aggregation}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de progreso */}
      <div className="bg-white shadow-sm rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Constructor de Informes</h2>
          {currentStep === 'results' && (
            <button
              onClick={() => setSaveModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={20} />
              <span>Guardar Informe</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => {
                    if (index <= currentStepIndex) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                    ${
                      index < currentStepIndex
                        ? 'bg-green-600 text-white'
                        : index === currentStepIndex
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {index + 1}
                </button>
                <span
                  className={`mt-2 text-xs font-medium ${
                    index === currentStepIndex ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    index < currentStepIndex ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="min-h-[400px]">{renderStepContent()}</div>

      {/* Navegación */}
      {currentStep !== 'results' && (
        <div className="flex items-center justify-between bg-white shadow-sm rounded-xl p-4">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            <span>Anterior</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext() || loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 'visualization' ? (
              <>
                <Play size={20} />
                <span>{loading ? 'Generando...' : 'Generar Informe'}</span>
              </>
            ) : (
              <>
                <span>Siguiente</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      )}

      {/* Modal para guardar informe */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Guardar Informe</h3>
              <button
                onClick={() => setSaveModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del Informe *
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Ej: Ingresos Mensuales por Tratamiento"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Descripción del informe..."
                  rows={3}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveReport}
                disabled={saving || !reportName.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



