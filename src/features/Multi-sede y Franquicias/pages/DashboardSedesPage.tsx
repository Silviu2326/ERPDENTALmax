import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, BarChart3, Loader2, Package } from 'lucide-react';
import {
  getSedesSummary,
  getAllSedes,
  SedeSummary,
  Sede,
  DashboardSedesFilters,
} from '../api/dashboardSedesApi';
import SelectorSedesPeriodo from '../components/SelectorSedesPeriodo';
import KPICardSede from '../components/KPICardSede';
import ComparativaSedesChart from '../components/ComparativaSedesChart';
import TablaRendimientoSedes from '../components/TablaRendimientoSedes';

export default function DashboardSedesPage() {
  const [datos, setDatos] = useState<SedeSummary[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Inicializar fechas con el mes en curso
  const [fechaInicio, setFechaInicio] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setDate(1); // Primer día del mes
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  });

  const [fechaFin, setFechaFin] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setHours(23, 59, 59, 999);
    return fecha;
  });

  const [sedesSeleccionadas, setSedesSeleccionadas] = useState<string[]>([]);
  const [metricaGrafico, setMetricaGrafico] = useState<
    'ingresos' | 'pacientes' | 'citas' | 'ocupacion'
  >('ingresos');

  // Cargar lista de sedes al montar
  useEffect(() => {
    const cargarSedes = async () => {
      try {
        const sedesData = await getAllSedes();
        setSedes(sedesData);
        // Por defecto, seleccionar todas las sedes
        setSedesSeleccionadas(sedesData.map((s) => s._id));
      } catch (err) {
        console.error('Error al cargar sedes:', err);
        // En caso de error, usar datos mock para desarrollo
        const sedesMock: Sede[] = [
          { _id: '1', nombre: 'Sede Central' },
          { _id: '2', nombre: 'Sede Norte' },
          { _id: '3', nombre: 'Sede Sur' },
        ];
        setSedes(sedesMock);
        setSedesSeleccionadas(sedesMock.map((s) => s._id));
      }
    };

    cargarSedes();
  }, []);

  // Cargar datos cuando cambian los filtros
  useEffect(() => {
    if (sedes.length > 0) {
      cargarDatos();
    }
  }, [fechaInicio, fechaFin, sedesSeleccionadas]);

  const cargarDatos = async () => {
    try {
      setError(null);
      setRefreshing(true);

      const filters: DashboardSedesFilters = {
        startDate: fechaInicio.toISOString().split('T')[0],
        endDate: fechaFin.toISOString().split('T')[0],
        sedeIds: sedesSeleccionadas.length > 0 ? sedesSeleccionadas : undefined,
      };

      const datosObtenidos = await getSedesSummary(filters);
      setDatos(datosObtenidos);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar los datos del cuadro de mandos'
      );

      // Datos mock para desarrollo
      const datosMock: SedeSummary[] = [
        {
          sedeId: '1',
          nombreSede: 'Sede Central',
          totalIngresos: 50000,
          nuevosPacientes: 45,
          citasAtendidas: 250,
          tasaOcupacion: 0.85,
          ticketPromedio: 200,
          citasCanceladas: 15,
          tasaCancelacion: 0.06,
        },
        {
          sedeId: '2',
          nombreSede: 'Sede Norte',
          totalIngresos: 35000,
          nuevosPacientes: 32,
          citasAtendidas: 180,
          tasaOcupacion: 0.72,
          ticketPromedio: 194,
          citasCanceladas: 12,
          tasaCancelacion: 0.067,
        },
        {
          sedeId: '3',
          nombreSede: 'Sede Sur',
          totalIngresos: 42000,
          nuevosPacientes: 38,
          citasAtendidas: 210,
          tasaOcupacion: 0.78,
          ticketPromedio: 200,
          citasCanceladas: 10,
          tasaCancelacion: 0.048,
        },
      ];
      setDatos(datosMock);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  const handlePeriodoChange = (inicio: Date, fin: Date) => {
    setFechaInicio(inicio);
    setFechaFin(fin);
  };

  const handleSedesChange = (sedeIds: string[]) => {
    setSedesSeleccionadas(sedeIds);
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-xl p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando cuadro de mandos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <BarChart3 size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Cuadro de Mandos por Sede
                  </h1>
                  <p className="text-gray-600">
                    Vista panorámica y comparativa del rendimiento de todas las sedes
                  </p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Selector de Sedes y Período */}
          <SelectorSedesPeriodo
            sedes={sedes}
            sedesSeleccionadas={sedesSeleccionadas}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            onSedesChange={handleSedesChange}
            onPeriodoChange={handlePeriodoChange}
            loading={refreshing}
          />

          {/* Mensaje de error */}
          {error && (
            <div className="bg-white shadow-sm rounded-xl p-4 border-l-4 border-yellow-400">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  {error}. Mostrando datos de ejemplo para desarrollo.
                </p>
              </div>
            </div>
          )}

          {/* KPIs por Sede */}
          {datos.length > 0 && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">KPIs por Sede</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {datos.map((sede) => (
                    <KPICardSede key={sede.sedeId} sede={sede} />
                  ))}
                </div>
              </div>

              {/* Selector de Métrica para el Gráfico */}
              <div className="bg-white shadow-sm rounded-xl p-4 ring-1 ring-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Métrica a comparar:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setMetricaGrafico('ingresos')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      metricaGrafico === 'ingresos'
                        ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Ingresos
                  </button>
                  <button
                    onClick={() => setMetricaGrafico('pacientes')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      metricaGrafico === 'pacientes'
                        ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Nuevos Pacientes
                  </button>
                  <button
                    onClick={() => setMetricaGrafico('citas')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      metricaGrafico === 'citas'
                        ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Citas Atendidas
                  </button>
                  <button
                    onClick={() => setMetricaGrafico('ocupacion')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      metricaGrafico === 'ocupacion'
                        ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Tasa de Ocupación
                  </button>
                </div>
              </div>

              {/* Gráfico Comparativo */}
              <ComparativaSedesChart
                datos={datos}
                metrica={metricaGrafico}
                loading={refreshing}
              />

              {/* Tabla de Rendimiento */}
              <TablaRendimientoSedes datos={datos} loading={refreshing} />
            </>
          )}

          {/* Mensaje cuando no hay datos */}
          {!loading && datos.length === 0 && (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center ring-1 ring-slate-200">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay datos disponibles
              </h3>
              <p className="text-gray-600 mb-4">
                Selecciona un período diferente o verifica que haya sedes seleccionadas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



