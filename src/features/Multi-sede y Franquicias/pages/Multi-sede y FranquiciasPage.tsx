import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, ArrowRight, Users, Building, BarChart3, Shield } from 'lucide-react';
import {
  getDashboardSummary,
  getPerformanceRanking,
  DashboardSummary,
  PerformanceRankingItem,
  PerformanceRankingFilters,
} from '../api/dashboardAPI';
import GlobalDashboardHeader from '../components/GlobalDashboardHeader';
import GlobalKPIGrid from '../components/GlobalKPIGrid';
import CenterSummaryCard from '../components/CenterSummaryCard';
import PerformanceRankingList from '../components/PerformanceRankingList';
import RevenueComparisonChart from '../components/RevenueComparisonChart';
import DateRangePicker from '../components/DateRangePicker';

interface MultiSedeYFranquiciasPageProps {
  onTransferenciaPacientes?: () => void;
  onCuadroMandosSedes?: () => void;
  onPermisosRoles?: () => void;
}

export default function MultiSedeYFranquiciasPage({
  onTransferenciaPacientes,
  onCuadroMandosSedes,
  onPermisosRoles,
}: MultiSedeYFranquiciasPageProps) {
  const [datos, setDatos] = useState<DashboardSummary | null>(null);
  const [ranking, setRanking] = useState<PerformanceRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Inicializar fechas con últimos 30 días
  const [fechaInicio, setFechaInicio] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 30);
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  });

  const [fechaFin, setFechaFin] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setHours(23, 59, 59, 999);
    return fecha;
  });

  const [rankingMetric, setRankingMetric] = useState<
    'revenue' | 'newPatients' | 'occupancy'
  >('revenue');
  const [rankingOrder, setRankingOrder] = useState<'asc' | 'desc'>('desc');

  const cargarDatos = async () => {
    try {
      setError(null);
      const startDate = fechaInicio.toISOString().split('T')[0];
      const endDate = fechaFin.toISOString().split('T')[0];

      const [summaryData, rankingData] = await Promise.all([
        getDashboardSummary(startDate, endDate),
        getPerformanceRanking({
          metric: rankingMetric,
          order: rankingOrder,
          limit: 10,
        }),
      ]);

      setDatos(summaryData);
      setRanking(rankingData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar los datos del panel global'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [fechaInicio, fechaFin, rankingMetric, rankingOrder]);

  const handleRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  const handleDateRangeChange = (inicio: Date, fin: Date) => {
    setFechaInicio(inicio);
    setFechaFin(fin);
  };

  const handleMetricChange = (metric: 'revenue' | 'newPatients' | 'occupancy') => {
    setRankingMetric(metric);
  };

  const handleOrderChange = (order: 'asc' | 'desc') => {
    setRankingOrder(order);
  };

  const handleCenterClick = (centerId: string) => {
    // TODO: Implementar navegación al panel detallado del centro
    console.log('Ver detalle del centro:', centerId);
  };

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos del panel global...</p>
        </div>
      </div>
    );
  }

  if (error && !datos) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <GlobalDashboardHeader
            totalCentros={datos?.centersData.length || 0}
          />
          <div className="flex items-center space-x-4">
            <DateRangePicker
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              onCambio={handleDateRangeChange}
            />
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <RefreshCw
                className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
              />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {onCuadroMandosSedes && (
            <button
              onClick={onCuadroMandosSedes}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Cuadro de Mandos por Sede
                  </h3>
                  <p className="text-sm text-gray-600">
                    Visualiza y compara el rendimiento de todas las sedes
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </button>
          )}
          {onTransferenciaPacientes && (
            <button
              onClick={onTransferenciaPacientes}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Transferencia de Pacientes
                  </h3>
                  <p className="text-sm text-gray-600">
                    Transfiere pacientes entre sedes
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </button>
          )}
          {onPermisosRoles && (
            <button
              onClick={onPermisosRoles}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Permisos y Roles por Sede
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gestiona roles y permisos de acceso por sede
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800">{error}</p>
            </div>
          </div>
        )}

        {datos && (
          <>
            <GlobalKPIGrid
              totalRevenue={datos.totalRevenue}
              totalNewPatients={datos.totalNewPatients}
              averageOccupancyRate={datos.averageOccupancyRate}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <RevenueComparisonChart centersData={datos.centersData} />
              <PerformanceRankingList
                ranking={ranking}
                metric={rankingMetric}
                onMetricChange={handleMetricChange}
                onOrderChange={handleOrderChange}
                currentOrder={rankingOrder}
              />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Resumen por Centro
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datos.centersData.map((center) => (
                  <CenterSummaryCard
                    key={center.id}
                    id={center.id}
                    nombre={center.nombre}
                    facturacion={center.facturacion}
                    pacientesNuevos={center.pacientesNuevos}
                    onVerDetalle={handleCenterClick}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

