import { useState, useEffect } from 'react';
import { Brain, ArrowLeft, RefreshCw } from 'lucide-react';
import { obtenerDetalleEstudio } from '../api/radiologiaApi';
import { solicitarAnalisisIA, listarAnalisisPorPaciente, AnalisisRadiograficoIA } from '../api/dentiaApi';
import RadiographViewerWithIA from '../components/RadiographViewerWithIA';
import AnalysisResultsPanel from '../components/AnalysisResultsPanel';
import SubmitToIAButton from '../components/SubmitToIAButton';

interface DentiaAnalysisPageProps {
  radiografiaId?: string;
  pacienteId?: string;
  onVolver?: () => void;
}

export default function DentiaAnalysisPage({
  radiografiaId: radiografiaIdProp,
  pacienteId: pacienteIdProp,
  onVolver,
}: DentiaAnalysisPageProps) {
  const [radiografiaId, setRadiografiaId] = useState<string>(radiografiaIdProp || '');
  const [pacienteId, setPacienteId] = useState<string>(pacienteIdProp || '');
  const [imagenUrl, setImagenUrl] = useState<string>('');
  const [analisisActual, setAnalisisActual] = useState<AnalisisRadiograficoIA | null>(null);
  const [historialAnalisis, setHistorialAnalisis] = useState<AnalisisRadiograficoIA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (radiografiaId) {
      cargarRadiografia();
    }
  }, [radiografiaId]);

  useEffect(() => {
    if (pacienteId) {
      cargarHistorialAnalisis();
    }
  }, [pacienteId]);

  const cargarRadiografia = async () => {
    if (!radiografiaId) return;

    setLoading(true);
    setError(null);

    try {
      const estudio = await obtenerDetalleEstudio(radiografiaId);
      
      // Obtener la primera imagen del estudio (en producción, esto dependería de la estructura real)
      if (estudio.series && estudio.series.length > 0 && estudio.series[0].imagenes && estudio.series[0].imagenes.length > 0) {
        const primeraImagen = estudio.series[0].imagenes[0];
        // En producción, esto sería una URL real del servidor
        setImagenUrl(primeraImagen.storagePath || '/placeholder-radiografia.jpg');
      }

      setPacienteId(estudio.paciente);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar radiografía');
      console.error('Error al cargar radiografía:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarHistorialAnalisis = async () => {
    if (!pacienteId) return;

    try {
      const historial = await listarAnalisisPorPaciente(pacienteId);
      setHistorialAnalisis(historial);

      // Buscar si hay un análisis para esta radiografía
      if (radiografiaId) {
        const analisisParaRadiografia = historial.find(
          (a) => a.radiografiaId === radiografiaId && a.status === 'completado'
        );
        if (analisisParaRadiografia) {
          setAnalisisActual(analisisParaRadiografia);
        }
      }
    } catch (err) {
      console.error('Error al cargar historial de análisis:', err);
    }
  };

  const handleAnalisisIniciado = (analisisId: string) => {
    // Recargar historial para obtener el nuevo análisis
    cargarHistorialAnalisis();
    
    // Buscar el análisis recién creado
    setTimeout(() => {
      const nuevoAnalisis = historialAnalisis.find((a) => a._id === analisisId);
      if (nuevoAnalisis) {
        setAnalisisActual(nuevoAnalisis);
      }
    }, 1000);
  };

  const handleCentrarVista = (coordenadas: { x: number; y: number; w: number; h: number }) => {
    // Esta función se pasará al visor para centrar la vista en un hallazgo
    // El visor ya maneja esto internamente
  };

  if (loading && !imagenUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Cargando radiografía...</p>
        </div>
      </div>
    );
  }

  if (error && !imagenUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            {onVolver && (
              <button
                onClick={onVolver}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Análisis DentIA</h1>
                <p className="text-sm text-gray-600">Análisis de radiografías con Inteligencia Artificial</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Panel izquierdo - Visor de radiografía */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {imagenUrl ? (
                <RadiographViewerWithIA
                  imagenUrl={imagenUrl}
                  hallazgos={analisisActual?.hallazgos || []}
                  onCentrarVista={handleCentrarVista}
                  className="h-[600px]"
                />
              ) : (
                <div className="h-[600px] flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No hay imagen disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de análisis */}
            {radiografiaId && pacienteId && (
              <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Análisis con IA</h3>
                    <p className="text-sm text-gray-600">
                      Solicite un análisis de IA para detectar posibles patologías en esta radiografía
                    </p>
                  </div>
                  <SubmitToIAButton
                    radiografiaId={radiografiaId}
                    pacienteId={pacienteId}
                    onAnalisisIniciado={handleAnalisisIniciado}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Panel derecho - Resultados del análisis */}
          <div className="col-span-4">
            {analisisActual ? (
              <AnalysisResultsPanel
                analisisId={analisisActual._id}
                onCentrarVista={handleCentrarVista}
                autoRefresh={analisisActual.status !== 'completado' && analisisActual.status !== 'error'}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center py-8">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No hay análisis disponible
                  </h3>
                  <p className="text-sm text-gray-600">
                    {radiografiaId && pacienteId
                      ? 'Utilice el botón "Analizar con DentIA" para iniciar un nuevo análisis.'
                      : 'Seleccione una radiografía para comenzar el análisis.'}
                  </p>
                </div>
              </div>
            )}

            {/* Historial de análisis */}
            {historialAnalisis.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Historial de Análisis</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {historialAnalisis.map((analisis) => (
                    <button
                      key={analisis._id}
                      onClick={() => {
                        setAnalisisActual(analisis);
                        if (analisis.radiografiaId !== radiografiaId) {
                          setRadiografiaId(analisis.radiografiaId);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        analisisActual?._id === analisis._id
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {new Date(analisis.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            analisis.status === 'completado'
                              ? 'bg-green-100 text-green-700'
                              : analisis.status === 'procesando'
                              ? 'bg-blue-100 text-blue-700'
                              : analisis.status === 'error'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {analisis.status}
                        </span>
                      </div>
                      {analisis.hallazgos && (
                        <p className="text-xs text-gray-600">
                          {analisis.hallazgos.length} hallazgos detectados
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

