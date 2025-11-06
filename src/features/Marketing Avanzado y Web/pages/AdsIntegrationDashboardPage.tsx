import { useState, useEffect } from 'react';
import { Settings, TrendingUp, DollarSign, Users, MousePointerClick } from 'lucide-react';
import { getConnectionsStatus, getCampaignPerformance, PlatformConnection, CampaignPerformanceSummary } from '../api/adsIntegrationApi';
import AdPlatformConnectionCard from '../components/AdPlatformConnectionCard';
import CampaignPerformanceTable from '../components/CampaignPerformanceTable';
import AdsIntegrationSetupPage from './AdsIntegrationSetupPage';

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integración con Google Ads / Meta Ads</h1>
          <p className="text-gray-600 mt-2">
            Conecta tus cuentas publicitarias y mide el ROI real de tus campañas
          </p>
        </div>
        <button
          onClick={() => setShowSetup(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Configuración de Eventos</span>
        </button>
      </div>

      {/* Conexiones de Plataformas */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Conexiones de Plataformas</h2>
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
            <h2 className="text-xl font-semibold text-gray-900">Rendimiento de Campañas</h2>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="last_7_days">Últimos 7 días</option>
              <option value="last_30_days">Últimos 30 días</option>
              <option value="last_90_days">Últimos 90 días</option>
              <option value="last_year">Último año</option>
            </select>
          </div>

          {/* Tarjetas de Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Impresiones</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('es-ES').format(performance.totalImpressions)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Clics</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('es-ES').format(performance.totalClicks)}
                  </p>
                </div>
                <MousePointerClick className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Coste Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(performance.totalCost)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversiones</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('es-ES').format(performance.totalConversions)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            {performance.totalRevenue !== undefined && (
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ROI Promedio</p>
                    <p className={`text-2xl font-bold ${
                      (performance.averageROI || 0) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {performance.averageROI !== undefined
                        ? `${performance.averageROI > 0 ? '+' : ''}${performance.averageROI.toFixed(1)}%`
                        : '-'}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
            )}
          </div>

          {/* Tabla de Campañas */}
          <CampaignPerformanceTable
            campaigns={performance.campaigns}
            isLoading={isLoading}
          />
        </div>
      )}

      {!performance && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-center py-8">
            No hay datos de rendimiento disponibles. Conecta una plataforma publicitaria para comenzar.
          </p>
        </div>
      )}
    </div>
  );
}


