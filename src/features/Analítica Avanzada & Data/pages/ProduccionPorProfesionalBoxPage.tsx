import { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import FiltrosProduccionBoxComponent from '../components/FiltrosProduccionBox';
import IndicadoresProduccionBox from '../components/IndicadoresProduccionBox';
import GraficoComparativoProfesionales from '../components/GraficoComparativoProfesionales';
import GraficoProduccionPorBox from '../components/GraficoProduccionPorBox';
import TablaDetalleProduccionBox from '../components/TablaDetalleProduccionBox';
import MapaCalorUtilizacionBox from '../components/MapaCalorUtilizacionBox';
import {
  FiltrosProduccionBox,
  obtenerProduccionBoxKPIs,
  obtenerProduccionProfesionales,
  obtenerProduccionBoxes,
  obtenerComparativaProduccion,
  obtenerUtilizacionCalor,
  ProduccionBoxKPIs,
  ProduccionProfesional,
  ProduccionBox,
  ComparativaItem,
  UtilizacionCalor,
} from '../api/analiticaApi';

export default function ProduccionPorProfesionalBoxPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado de los datos
  const [kpis, setKpis] = useState<ProduccionBoxKPIs | null>(null);
  const [profesionales, setProfesionales] = useState<ProduccionProfesional[]>([]);
  const [boxes, setBoxes] = useState<ProduccionBox[]>([]);
  const [comparativa, setComparativa] = useState<ComparativaItem[]>([]);
  const [utilizacionCalor, setUtilizacionCalor] = useState<UtilizacionCalor[]>([]);

  // Filtros iniciales (último mes por defecto)
  const [filtros, setFiltros] = useState<FiltrosProduccionBox>(() => {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    return {
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
    };
  });

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar todos los datos en paralelo
      const [kpisData, profesionalesData, boxesData, comparativaData, utilizacionData] = await Promise.all([
        obtenerProduccionBoxKPIs(filtros),
        obtenerProduccionProfesionales(filtros),
        obtenerProduccionBoxes(filtros),
        obtenerComparativaProduccion(filtros, 'profesionales', 10),
        obtenerUtilizacionCalor(filtros),
      ]);

      setKpis(kpisData);
      setProfesionales(profesionalesData);
      setBoxes(boxesData);
      setComparativa(comparativaData);
      setUtilizacionCalor(utilizacionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos de producción');
      console.error('Error cargando datos de producción:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAplicarFiltros = () => {
    cargarDatos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Producción por Profesional (Box)</h1>
              <p className="text-gray-600 mt-1">
                Análisis detallado de producción por profesional y utilización de boxes
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <FiltrosProduccionBoxComponent
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onAplicarFiltros={handleAplicarFiltros}
          loading={loading}
        />

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={cargarDatos}
              className="ml-auto flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reintentar</span>
            </button>
          </div>
        )}

        {/* Indicadores KPIs */}
        <IndicadoresProduccionBox kpis={kpis} loading={loading} />

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GraficoComparativoProfesionales datos={comparativa} loading={loading} />
          <GraficoProduccionPorBox datos={boxes} loading={loading} />
        </div>

        {/* Tabla de Detalle */}
        <TablaDetalleProduccionBox datos={profesionales} loading={loading} />

        {/* Mapa de Calor */}
        <MapaCalorUtilizacionBox datos={utilizacionCalor} loading={loading} />
      </div>
    </div>
  );
}


