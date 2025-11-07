import { useState, useEffect } from 'react';
import { RefreshCw, DollarSign, Calendar } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <DollarSign size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Coste por Tratamiento y Margen
                </h1>
                <p className="text-gray-600">
                  Análisis detallado de costes y rentabilidad por tratamiento
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
          <FiltrosCosteTratamientoComponent
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onActualizar={cargarDatos}
            loading={loading}
          />

          {/* Selector de agrupación para evolución */}
          <div className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-700" />
              <label className="text-sm font-medium text-slate-700">Agrupación temporal:</label>
              <select
                value={agrupacion}
                onChange={(e) => setAgrupacion(e.target.value as 'dia' | 'semana' | 'mes')}
                className="ml-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
              >
                <option value="dia">Diaria</option>
                <option value="semana">Semanal</option>
                <option value="mes">Mensual</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-red-500">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* KPIs */}
          <IndicadoresCosteTratamiento kpis={kpis} loading={loading} />

          {/* Gráfico de Coste y Margen */}
          <GraficoCosteMargen datos={datosTratamientos} loading={loading} />

          {/* Evolución temporal */}
          <GraficoEvolucionCosteMargen datos={evolucion} loading={loading} agrupacion={agrupacion} />

          {/* Tabla detallada */}
          <TablaDetalleCosteTratamiento datos={datosTratamientos} loading={loading} />
        </div>
      </div>
    </div>
  );
}



