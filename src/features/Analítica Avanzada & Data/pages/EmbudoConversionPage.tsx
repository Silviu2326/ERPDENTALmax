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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Embudo de Conversión (Lead → Paciente)
                </h1>
                <p className="text-gray-600">
                  Visualiza el viaje de tus leads desde el contacto inicial hasta
                  convertirse en pacientes activos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
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
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error al cargar datos
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={cargarDatosEmbudo}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm"
              >
                <RefreshCw size={20} className="mr-2" />
                Intentar de nuevo
              </button>
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
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay datos disponibles
              </h3>
              <p className="text-gray-600 mb-4">
                Ajusta los filtros y haz clic en "Aplicar Filtros" para ver los
                datos del embudo de conversión
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



