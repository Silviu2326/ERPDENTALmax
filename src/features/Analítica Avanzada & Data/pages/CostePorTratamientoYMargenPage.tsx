import { useState, useEffect } from 'react';
import { RefreshCw, DollarSign } from 'lucide-react';
import {
  obtenerCosteTratamientoKPIs,
  obtenerCostePorTratamiento,
  obtenerEvolucionCosteMargen,
  FiltrosCosteTratamiento,
  CosteTratamientoKPIs,
  CostePorTratamiento as CostePorTratamientoType,
  EvolucionCosteMargen,
} from '../api/analiticaApi';
import IndicadoresCosteTratamiento from '../components/IndicadoresCosteTratamiento';
import GraficoCosteMargen from '../components/GraficoCosteMargen';
import TablaDetalleCosteTratamiento from '../components/TablaDetalleCosteTratamiento';
import GraficoEvolucionCosteMargen from '../components/GraficoEvolucionCosteMargen';
import FiltrosCosteTratamientoComponent from '../components/FiltrosCosteTratamiento';

export default function CostePorTratamientoYMargenPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<CosteTratamientoKPIs | null>(null);
  const [datosTratamientos, setDatosTratamientos] = useState<CostePorTratamientoType[]>([]);
  const [evolucion, setEvolucion] = useState<EvolucionCosteMargen[]>([]);
  const [agrupacion, setAgrupacion] = useState<'dia' | 'semana' | 'mes'>('semana');

  const [filtros, setFiltros] = useState<FiltrosCosteTratamiento>(() => {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 3);
    return {
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
    };
  });

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpisData, tratamientosData, evolucionData] = await Promise.all([
        obtenerCosteTratamientoKPIs(filtros),
        obtenerCostePorTratamiento(filtros),
        obtenerEvolucionCosteMargen(filtros, agrupacion),
      ]);

      setKpis(kpisData);
      setDatosTratamientos(tratamientosData);
      setEvolucion(evolucionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros, agrupacion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coste por Tratamiento y Margen</h1>
              <p className="text-gray-600 mt-1">Análisis detallado de costes y rentabilidad por tratamiento</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <FiltrosCosteTratamientoComponent
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onActualizar={cargarDatos}
          loading={loading}
        />

        {/* Selector de agrupación para evolución */}
        <div className="mb-6 flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Agrupación temporal:</label>
          <select
            value={agrupacion}
            onChange={(e) => setAgrupacion(e.target.value as 'dia' | 'semana' | 'mes')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="dia">Diaria</option>
            <option value="semana">Semanal</option>
            <option value="mes">Mensual</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* KPIs */}
        <IndicadoresCosteTratamiento kpis={kpis} loading={loading} />

        {/* Gráfico de Coste y Margen */}
        <div className="mb-6">
          <GraficoCosteMargen datos={datosTratamientos} loading={loading} />
        </div>

        {/* Evolución temporal */}
        <div className="mb-6">
          <GraficoEvolucionCosteMargen datos={evolucion} loading={loading} agrupacion={agrupacion} />
        </div>

        {/* Tabla detallada */}
        <div className="mb-6">
          <TablaDetalleCosteTratamiento datos={datosTratamientos} loading={loading} />
        </div>
      </div>
    </div>
  );
}


