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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Producción por Profesional (Box)
                </h1>
                <p className="text-gray-600">
                  Análisis detallado de producción por profesional y utilización de boxes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Filtros */}
          <FiltrosProduccionBoxComponent
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onAplicarFiltros={handleAplicarFiltros}
            loading={loading}
          />

          {/* Error */}
          {error && (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={cargarDatos}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
    </div>
  );
}



