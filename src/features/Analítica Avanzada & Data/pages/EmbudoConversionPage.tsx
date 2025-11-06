import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import {
  getConversionFunnelData,
  ConversionFunnelParams,
} from '../api/funnelApi';
import FunnelChart from '../components/FunnelChart';
import LeadSourceBreakdownChart from '../components/LeadSourceBreakdownChart';
import FunnelFilters from '../components/FunnelFilters';

export default function EmbudoConversionPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [funnelData, setFunnelData] = useState<{
    stages: any[];
    sourceBreakdown: any[];
  } | null>(null);

  // Filtros con valores por defecto (último mes)
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [clinicId, setClinicId] = useState<string | undefined>(undefined);
  const [source, setSource] = useState<string | undefined>(undefined);

  const cargarDatosEmbudo = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ConversionFunnelParams = {
        startDate,
        endDate,
        clinicId,
        source,
      };
      const data = await getConversionFunnelData(params);
      setFunnelData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar datos del embudo de conversión'
      );
      console.error('Error cargando datos del embudo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosEmbudo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    cargarDatosEmbudo();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Embudo de Conversión (Lead → Paciente)
              </h1>
              <p className="text-gray-600 mt-1">
                Visualiza el viaje de tus leads desde el contacto inicial hasta
                convertirse en pacientes activos
              </p>
            </div>
          </div>
        </div>

        {/* Panel de Filtros */}
        <FunnelFilters
          startDate={startDate}
          endDate={endDate}
          clinicId={clinicId}
          source={source}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClinicIdChange={setClinicId}
          onSourceChange={setSource}
          onApplyFilters={handleApplyFilters}
          loading={loading}
        />

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Error al cargar datos
              </h3>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={cargarDatosEmbudo}
                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Intentar de nuevo</span>
              </button>
            </div>
          </div>
        )}

        {/* Gráfico del Embudo */}
        {funnelData && (
          <FunnelChart stages={funnelData.stages} loading={loading} />
        )}

        {/* Desglose por Origen */}
        {funnelData && funnelData.sourceBreakdown.length > 0 && (
          <LeadSourceBreakdownChart
            sourceBreakdown={funnelData.sourceBreakdown}
            loading={loading}
          />
        )}

        {/* Mensaje cuando no hay datos */}
        {!loading && !error && !funnelData && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">
              No hay datos disponibles
            </p>
            <p className="text-gray-500 text-sm">
              Ajusta los filtros y haz clic en "Aplicar Filtros" para ver los
              datos del embudo de conversión
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


