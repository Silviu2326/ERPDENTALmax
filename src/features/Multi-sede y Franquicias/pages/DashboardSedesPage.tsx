import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, BarChart3 } from 'lucide-react';
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando cuadro de mandos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Cuadro de Mandos por Sede</h1>
              <p className="text-sm text-gray-600 mt-1">
                Vista panorámica y comparativa del rendimiento de todas las sedes
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

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
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800">
                {error}. Mostrando datos de ejemplo para desarrollo.
              </p>
            </div>
          </div>
        )}

        {/* KPIs por Sede */}
        {datos.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">KPIs por Sede</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datos.map((sede) => (
                  <KPICardSede key={sede.sedeId} sede={sede} />
                ))}
              </div>
            </div>

            {/* Selector de Métrica para el Gráfico */}
            <div className="mb-6 bg-white rounded-xl shadow-md border-2 border-gray-200 p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Métrica a comparar:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setMetricaGrafico('ingresos')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    metricaGrafico === 'ingresos'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ingresos
                </button>
                <button
                  onClick={() => setMetricaGrafico('pacientes')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    metricaGrafico === 'pacientes'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Nuevos Pacientes
                </button>
                <button
                  onClick={() => setMetricaGrafico('citas')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    metricaGrafico === 'citas'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Citas Atendidas
                </button>
                <button
                  onClick={() => setMetricaGrafico('ocupacion')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    metricaGrafico === 'ocupacion'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tasa de Ocupación
                </button>
              </div>
            </div>

            {/* Gráfico Comparativo */}
            <div className="mb-6">
              <ComparativaSedesChart
                datos={datos}
                metrica={metricaGrafico}
                loading={refreshing}
              />
            </div>

            {/* Tabla de Rendimiento */}
            <div className="mb-6">
              <TablaRendimientoSedes datos={datos} loading={refreshing} />
            </div>
          </>
        )}

        {/* Mensaje cuando no hay datos */}
        {!loading && datos.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border-2 border-gray-200">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay datos disponibles
            </h3>
            <p className="text-gray-500">
              Selecciona un período diferente o verifica que haya sedes seleccionadas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


