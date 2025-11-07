import { useState, useEffect } from 'react';
import { Brain, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
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
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando análisis...</p>
      </div>
    );
  }

  if (error && !analisis) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-green-700 bg-green-100 border border-green-200">
            <CheckCircle2 size={12} />
            <span>Completado</span>
          </div>
        );
      case 'procesando':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-200">
            <RefreshCw size={12} className="animate-spin" />
            <span>Procesando</span>
          </div>
        );
      case 'en_cola':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-yellow-700 bg-yellow-100 border border-yellow-200">
            <RefreshCw size={12} />
            <span>En cola</span>
          </div>
        );
      case 'error':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-red-700 bg-red-100 border border-red-200">
            <AlertCircle size={12} />
            <span>Error</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Brain size={20} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Resultados del Análisis IA</h3>
        </div>
        {getStatusBadge()}
      </div>

      {analisis.status === 'procesando' || analisis.status === 'en_cola' ? (
        <div className="text-center py-8">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 font-medium mb-2">
            {analisis.status === 'procesando' ? 'Analizando radiografía...' : 'Esperando en cola...'}
          </p>
          <p className="text-sm text-gray-500">
            Esto puede tomar unos momentos. Los resultados aparecerán automáticamente.
          </p>
        </div>
      ) : analisis.status === 'error' ? (
        <div className="text-center py-8">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error en el análisis</h3>
          <p className="text-gray-600 mb-4">
            No se pudo completar el análisis. Por favor, intente nuevamente.
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      ) : analisis.status === 'completado' && analisis.hallazgos ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Se encontraron <span className="font-bold text-gray-900">{analisis.hallazgos.length}</span> hallazgos
            </p>
            <button
              onClick={handleRefresh}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={16} />
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
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron anomalías</h3>
                <p className="text-gray-600">
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



