import { useState, useEffect } from 'react';
import { Settings, BarChart3, Loader2 } from 'lucide-react';
import { getConnectionsStatus, getCampaignPerformance, PlatformConnection, CampaignPerformanceSummary } from '../api/adsIntegrationApi';
import AdPlatformConnectionCard from '../components/AdPlatformConnectionCard';
import CampaignPerformanceTable from '../components/CampaignPerformanceTable';
import AdsIntegrationSetupPage from './AdsIntegrationSetupPage';
import MetricCards from '../components/MetricCards';

export default function AdsIntegrationDashboardPage() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [performance, setPerformance] = useState<CampaignPerformanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [dateRange, setDateRange] = useState('last_30_days');

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [connectionsData, performanceData] = await Promise.all([
        getConnectionsStatus(),
        getCampaignPerformance(dateRange),
      ]);
      setConnections(connectionsData);
      setPerformance(performanceData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectionChange = () => {
    loadData();
  };

  if (showSetup) {
    return (
      <AdsIntegrationSetupPage
        onVolver={() => setShowSetup(false)}
        onSave={() => {
          setShowSetup(false);
          loadData();
        }}
      />
    );
  }

  const googleConnection = connections.find((c) => c.platform === 'google') || {
    platform: 'google' as const,
    connected: false,
  };
  const metaConnection = connections.find((c) => c.platform === 'meta') || {
    platform: 'meta' as const,
    connected: false,
  };

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
                    Integración con Google Ads / Meta Ads
                  </h1>
                  <p className="text-gray-600">
                    Conecta tus cuentas publicitarias y mide el ROI real de tus campañas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSetup(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
              >
                <Settings size={20} />
                Configuración de Eventos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Conexiones de Plataformas */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Conexiones de Plataformas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdPlatformConnectionCard
                connection={googleConnection}
                onConnectionChange={handleConnectionChange}
              />
              <AdPlatformConnectionCard
                connection={metaConnection}
                onConnectionChange={handleConnectionChange}
              />
            </div>
          </div>

          {/* Resumen de Rendimiento */}
          {performance && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Rendimiento de Campañas</h2>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 text-sm font-medium"
                >
                  <option value="last_7_days">Últimos 7 días</option>
                  <option value="last_30_days">Últimos 30 días</option>
                  <option value="last_90_days">Últimos 90 días</option>
                  <option value="last_year">Último año</option>
                </select>
              </div>

              {/* Tarjetas de Métricas */}
              <MetricCards
                data={[
                  {
                    id: 'impresiones',
                    title: 'Impresiones',
                    value: performance.totalImpressions,
                    color: 'info',
                  },
                  {
                    id: 'clics',
                    title: 'Clics',
                    value: performance.totalClicks,
                    color: 'success',
                  },
                  {
                    id: 'coste',
                    title: 'Coste Total',
                    value: new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(performance.totalCost),
                    color: 'warning',
                  },
                  {
                    id: 'conversiones',
                    title: 'Conversiones',
                    value: performance.totalConversions,
                    color: 'info',
                  },
                  ...(performance.totalRevenue !== undefined
                    ? [
                        {
                          id: 'roi',
                          title: 'ROI Promedio',
                          value:
                            performance.averageROI !== undefined
                              ? `${performance.averageROI > 0 ? '+' : ''}${performance.averageROI.toFixed(1)}%`
                              : '-',
                          color: (performance.averageROI || 0) > 0 ? ('success' as const) : ('danger' as const),
                        },
                      ]
                    : []),
                ]}
              />

              {/* Tabla de Campañas */}
              <div className="mt-6">
                <CampaignPerformanceTable
                  campaigns={performance.campaigns}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          {/* Estado Vacío */}
          {!performance && !isLoading && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay datos de rendimiento disponibles
              </h3>
              <p className="text-gray-600 mb-4">
                Conecta una plataforma publicitaria para comenzar a ver el rendimiento de tus campañas.
              </p>
            </div>
          )}

          {/* Estado de Carga */}
          {isLoading && !performance && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



