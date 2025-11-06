import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Filter, RefreshCw, FunnelChart as FunnelChartIcon, AlertCircle, Box, DollarSign, Bell } from 'lucide-react';
import { getCohortRetention, CohortRetentionParams, CohortRetentionResponse } from '../api/analiticaApi';
import EmbudoConversionPage from './EmbudoConversionPage';
import AnalisisAusenciasPage from './AnalisisAusenciasPage';
import ProduccionPorProfesionalBoxPage from './ProduccionPorProfesionalBoxPage';
import CostePorTratamientoYMargenPage from './CostePorTratamientoYMargenPage';
import AlertasInteligentesPage from './AlertasInteligentesPage';

type ViewMode = 'cohortes-retencion' | 'dashboard' | 'embudo-conversion' | 'analisis-ausencias' | 'produccion-box' | 'coste-tratamiento-margen' | 'alertas-inteligentes';

export default function AnaliticaAvanzadaDataPage() {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cohortData, setCohortData] = useState<CohortRetentionResponse | null>(null);

  // Filtros para cohortes
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 12);
    return date.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [groupBy, setGroupBy] = useState<'monthly' | 'quarterly'>('monthly');
  const [clinicId, setClinicId] = useState<string | undefined>(undefined);

  const cargarDatosCohortes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: CohortRetentionParams = {
        startDate: fechaInicio,
        endDate: fechaFin,
        groupBy,
        clinicId,
      };
      const data = await getCohortRetention(params);
      setCohortData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos de cohortes');
      console.error('Error cargando datos de cohortes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'cohortes-retencion') {
      cargarDatosCohortes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, fechaInicio, fechaFin, groupBy, clinicId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analítica Avanzada & Data</h1>
              <p className="text-gray-600 mt-1">Análisis profundo de datos e inteligencia de negocio</p>
            </div>
          </div>

          {/* Tabs de navegación */}
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                activeView === 'dashboard'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('cohortes-retencion')}
              className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                activeView === 'cohortes-retencion'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Cohortes de Retención</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('embudo-conversion')}
              className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                activeView === 'embudo-conversion'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FunnelChartIcon className="w-4 h-4" />
                <span>Embudo de Conversión</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('analisis-ausencias')}
              className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                activeView === 'analisis-ausencias'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Análisis de Ausencias</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('produccion-box')}
              className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                activeView === 'produccion-box'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Box className="w-4 h-4" />
                <span>Producción por Box</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('coste-tratamiento-margen')}
              className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                activeView === 'coste-tratamiento-margen'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Coste y Margen</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('alertas-inteligentes')}
              className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                activeView === 'alertas-inteligentes'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Alertas Inteligentes</span>
              </div>
            </button>
          </div>
        </div>

        {/* Contenido según la vista activa */}
        {activeView === 'dashboard' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard de Analítica</h2>
            <p className="text-gray-600">
              Esta sección mostrará un dashboard con múltiples análisis y visualizaciones de datos.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                   onClick={() => setActiveView('embudo-conversion')}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Embudo de Conversión</h3>
                  <FunnelChartIcon className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Visualiza el viaje de tus leads desde el contacto inicial hasta convertirse en pacientes activos
                </p>
                <button
                  onClick={() => setActiveView('embudo-conversion')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>Ver análisis</span>
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                   onClick={() => setActiveView('cohortes-retencion')}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Análisis de Cohortes</h3>
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Análisis de retención de pacientes agrupados por cohortes
                </p>
                <button
                  onClick={() => setActiveView('cohortes-retencion')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>Ver análisis</span>
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                   onClick={() => setActiveView('coste-tratamiento-margen')}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Coste por Tratamiento y Margen</h3>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Análisis detallado de costes y márgenes por tratamiento para optimizar la rentabilidad
                </p>
                <button
                  onClick={() => setActiveView('coste-tratamiento-margen')}
                  className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>Ver análisis</span>
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Análisis Predictivo</h3>
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">
                  Próximamente: Modelos predictivos y análisis avanzados
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-6 border border-red-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                   onClick={() => setActiveView('analisis-ausencias')}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Análisis de Ausencias</h3>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Visualiza el impacto de las inasistencias (no-shows) y toma decisiones estratégicas
                </p>
                <button
                  onClick={() => setActiveView('analisis-ausencias')}
                  className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>Ver análisis</span>
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                   onClick={() => setActiveView('produccion-box')}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Producción por Box</h3>
                  <Box className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Análisis detallado de producción por profesional y utilización de boxes
                </p>
                <button
                  onClick={() => setActiveView('produccion-box')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>Ver análisis</span>
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                   onClick={() => setActiveView('alertas-inteligentes')}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Alertas Inteligentes KPI</h3>
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Configura umbrales y recibe alertas automáticas cuando los KPIs superen los límites establecidos
                </p>
                <button
                  onClick={() => setActiveView('alertas-inteligentes')}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>Ver alertas</span>
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'cohortes-retencion' && (
          <div className="space-y-6">
            {/* Panel de Filtros */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filtros de Análisis</span>
                </h2>
                <button
                  onClick={cargarDatosCohortes}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agrupación
                  </label>
                  <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value as 'monthly' | 'quarterly')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="monthly">Mensual</option>
                    <option value="quarterly">Trimestral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sede (Opcional)
                  </label>
                  <input
                    type="text"
                    value={clinicId || ''}
                    onChange={(e) => setClinicId(e.target.value || undefined)}
                    placeholder="ID de Sede"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Análisis de Cohortes de Retención</span>
              </h2>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600">Cargando datos...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {!loading && !error && cohortData && (
                <div className="space-y-4">
                  {cohortData.cohorts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No se encontraron datos de cohortes para el período seleccionado</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cohorte
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Pacientes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Retención por Período
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {cohortData.cohorts.map((cohort, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {cohort.cohortDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {cohort.totalPatients}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                <div className="flex space-x-2">
                                  {cohort.retention.map((ret, retIdx) => (
                                    <div
                                      key={retIdx}
                                      className="px-2 py-1 rounded text-xs font-medium"
                                      style={{
                                        backgroundColor: `rgba(59, 130, 246, ${ret / 100})`,
                                        color: ret > 50 ? 'white' : 'gray-900',
                                      }}
                                      title={`Período ${retIdx + 1}: ${ret.toFixed(1)}%`}
                                    >
                                      {ret.toFixed(0)}%
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {!loading && !error && !cohortData && (
                <div className="text-center py-12 text-gray-500">
                  <p>Selecciona los filtros y haz clic en "Actualizar" para ver los datos</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'embudo-conversion' && (
          <EmbudoConversionPage />
        )}

        {activeView === 'analisis-ausencias' && (
          <AnalisisAusenciasPage />
        )}

        {activeView === 'produccion-box' && (
          <ProduccionPorProfesionalBoxPage />
        )}

        {activeView === 'coste-tratamiento-margen' && (
          <CostePorTratamientoYMargenPage />
        )}

        {activeView === 'alertas-inteligentes' && (
          <AlertasInteligentesPage />
        )}
      </div>
    </div>
  );
}

