import { useState, useEffect } from 'react';
import {
  obtenerResultadosEncuesta,
  ResultadosEncuesta,
} from '../api/encuestasApi';
import DashboardResultadosEncuesta from '../components/DashboardResultadosEncuesta';
import { ArrowLeft, Calendar, Filter, Download } from 'lucide-react';

interface ResultadosEncuestaPageProps {
  plantillaId?: string;
  onVolver?: () => void;
}

export default function ResultadosEncuestaPage({
  plantillaId: propPlantillaId,
  onVolver,
}: ResultadosEncuestaPageProps) {
  const [resultados, setResultados] = useState<ResultadosEncuesta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    profesionalId: '',
  });
  const [showFiltros, setShowFiltros] = useState(false);

  useEffect(() => {
    if (propPlantillaId) {
      cargarResultados();
    }
  }, [propPlantillaId, filtros]);

  const cargarResultados = async () => {
    if (!propPlantillaId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await obtenerResultadosEncuesta(propPlantillaId, filtros);
      setResultados(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los resultados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAplicarFiltros = () => {
    cargarResultados();
    setShowFiltros(false);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      profesionalId: '',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
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
    );
  }

  if (!resultados) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {onVolver && (
              <button
                onClick={onVolver}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">Resultados de Encuesta</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFiltros(!showFiltros)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span>Filtros</span>
            </button>
            <button
              onClick={() => {
                // TODO: Implementar exportación
                alert('Funcionalidad de exportación próximamente');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {showFiltros && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Filtros de Fecha</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleAplicarFiltros}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aplicar
                </button>
                <button
                  onClick={handleLimpiarFiltros}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        )}

        <DashboardResultadosEncuesta resultados={resultados} />
      </div>
    </div>
  );
}


