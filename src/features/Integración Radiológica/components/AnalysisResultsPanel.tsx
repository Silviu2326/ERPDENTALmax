import { useState, useEffect } from 'react';
import { Brain, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { obtenerEstadoYResultadosAnalisis, AnalisisRadiograficoIA } from '../api/dentiaApi';
import AnalysisFindingItem from './AnalysisFindingItem';

interface AnalysisResultsPanelProps {
  analisisId: string;
  onCentrarVista?: (coordenadas: { x: number; y: number; w: number; h: number }) => void;
  autoRefresh?: boolean;
  refreshInterval?: number; // en milisegundos
}

export default function AnalysisResultsPanel({
  analisisId,
  onCentrarVista,
  autoRefresh = true,
  refreshInterval = 3000,
}: AnalysisResultsPanelProps) {
  const [analisis, setAnalisis] = useState<AnalisisRadiograficoIA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarAnalisis = async () => {
    try {
      setError(null);
      const datos = await obtenerEstadoYResultadosAnalisis(analisisId);
      setAnalisis(datos);
      
      // Si el análisis está completado o con error, detener el auto-refresh
      if (datos.status === 'completado' || datos.status === 'error') {
        setLoading(false);
        return false; // Indicar que se debe detener el refresh
      }
      
      setLoading(false);
      return true; // Continuar con el refresh
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar análisis');
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let shouldContinue = true;

    const startPolling = async () => {
      if (shouldContinue) {
        shouldContinue = await cargarAnalisis();
      }

      if (autoRefresh && shouldContinue && analisis?.status !== 'completado' && analisis?.status !== 'error') {
        intervalId = setInterval(async () => {
          if (shouldContinue) {
            shouldContinue = await cargarAnalisis();
          }
          if (!shouldContinue && intervalId) {
            clearInterval(intervalId);
          }
        }, refreshInterval);
      }
    };

    startPolling();

    return () => {
      shouldContinue = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [analisisId, autoRefresh]);

  const handleRefresh = async () => {
    setLoading(true);
    await cargarAnalisis();
  };

  if (loading && !analisis) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Cargando análisis...</span>
        </div>
      </div>
    );
  }

  if (error && !analisis) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">Error</span>
        </div>
        <p className="text-sm text-gray-700 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!analisis) {
    return null;
  }

  const getStatusBadge = () => {
    switch (analisis.status) {
      case 'completado':
        return (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-semibold">Completado</span>
          </div>
        );
      case 'procesando':
        return (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm font-semibold">Procesando</span>
          </div>
        );
      case 'en_cola':
        return (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-semibold">En cola</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Error</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-bold text-gray-800">Resultados del Análisis IA</h3>
        </div>
        {getStatusBadge()}
      </div>

      {analisis.status === 'procesando' || analisis.status === 'en_cola' ? (
        <div className="text-center py-8">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">
            {analisis.status === 'procesando' ? 'Analizando radiografía...' : 'Esperando en cola...'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esto puede tomar unos momentos. Los resultados aparecerán automáticamente.
          </p>
        </div>
      ) : analisis.status === 'error' ? (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <p className="text-gray-600 font-medium">Error en el análisis</p>
          <p className="text-sm text-gray-500 mt-2">
            No se pudo completar el análisis. Por favor, intente nuevamente.
          </p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : analisis.status === 'completado' && analisis.hallazgos ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Se encontraron <span className="font-bold text-gray-800">{analisis.hallazgos.length}</span> hallazgos
            </p>
            <button
              onClick={handleRefresh}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualizar</span>
            </button>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {analisis.hallazgos.length > 0 ? (
              analisis.hallazgos.map((hallazgo, index) => (
                <AnalysisFindingItem
                  key={index}
                  hallazgo={hallazgo}
                  onCentrarVista={onCentrarVista}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p className="font-medium">No se encontraron anomalías</p>
                <p className="text-sm mt-2">
                  La radiografía no presenta hallazgos detectados por la IA.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}


