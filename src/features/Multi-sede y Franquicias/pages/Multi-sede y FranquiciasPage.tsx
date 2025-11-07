import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, ArrowRight, Users, Building2, BarChart3, Shield, Loader2 } from 'lucide-react';
import {
  getDashboardSummary,
  getPerformanceRanking,
  DashboardSummary,
  PerformanceRankingItem,
  PerformanceRankingFilters,
} from '../api/dashboardAPI';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando datos del panel global...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !datos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Building2 size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Multi-sede y Franquicias
                  </h1>
                  <p className="text-gray-600">
                    Panel global de {datos?.centersData.length || 0} {datos?.centersData.length === 1 ? 'centro' : 'centros'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <DateRangePicker
                  fechaInicio={fechaInicio}
                  fechaFin={fechaFin}
                  onCambio={handleDateRangeChange}
                />
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    size={20}
                    className={refreshing ? 'animate-spin' : ''}
                  />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Accesos rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onCuadroMandosSedes && (
              <button
                onClick={onCuadroMandosSedes}
                className="bg-white shadow-sm rounded-xl p-6 ring-1 ring-gray-200 hover:ring-blue-300 hover:shadow-md transition-all text-left group h-full flex flex-col"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors ring-1 ring-blue-200/70">
                    <BarChart3 size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Cuadro de Mandos por Sede
                    </h3>
                    <p className="text-sm text-gray-600">
                      Visualiza y compara el rendimiento de todas las sedes
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </button>
            )}
            {onTransferenciaPacientes && (
              <button
                onClick={onTransferenciaPacientes}
                className="bg-white shadow-sm rounded-xl p-6 ring-1 ring-gray-200 hover:ring-blue-300 hover:shadow-md transition-all text-left group h-full flex flex-col"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors ring-1 ring-blue-200/70">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Transferencia de Pacientes
                    </h3>
                    <p className="text-sm text-gray-600">
                      Transfiere pacientes entre sedes
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </button>
            )}
            {onPermisosRoles && (
              <button
                onClick={onPermisosRoles}
                className="bg-white shadow-sm rounded-xl p-6 ring-1 ring-gray-200 hover:ring-blue-300 hover:shadow-md transition-all text-left group h-full flex flex-col"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors ring-1 ring-blue-200/70">
                    <Shield size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Permisos y Roles por Sede
                    </h3>
                    <p className="text-sm text-gray-600">
                      Gestiona roles y permisos de acceso por sede
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </button>
            )}
          </div>

          {error && (
            <div className="bg-yellow-50 ring-1 ring-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-yellow-600" />
                <p className="text-sm text-yellow-800">{error}</p>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueComparisonChart centersData={datos.centersData} />
                <PerformanceRankingList
                  ranking={ranking}
                  metric={rankingMetric}
                  onMetricChange={handleMetricChange}
                  onOrderChange={handleOrderChange}
                  currentOrder={rankingOrder}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
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
    </div>
  );
}

