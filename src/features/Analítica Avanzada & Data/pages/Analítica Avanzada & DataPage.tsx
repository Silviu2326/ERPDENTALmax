import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Filter, RefreshCw, AlertCircle, Box, DollarSign, Bell, Loader2, Package } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Analítica Avanzada & Data
                </h1>
                <p className="text-gray-600">
                  Análisis profundo de datos e inteligencia de negocio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <div className="bg-white shadow-sm rounded-lg p-0 mb-6">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
            >
              <button
                onClick={() => setActiveView('dashboard')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeView === 'dashboard'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <TrendingUp size={18} className={activeView === 'dashboard' ? 'opacity-100' : 'opacity-70'} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveView('cohortes-retencion')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeView === 'cohortes-retencion'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Users size={18} className={activeView === 'cohortes-retencion' ? 'opacity-100' : 'opacity-70'} />
                <span>Cohortes de Retención</span>
              </button>
              <button
                onClick={() => setActiveView('embudo-conversion')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeView === 'embudo-conversion'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Filter size={18} className={activeView === 'embudo-conversion' ? 'opacity-100' : 'opacity-70'} />
                <span>Embudo de Conversión</span>
              </button>
              <button
                onClick={() => setActiveView('analisis-ausencias')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeView === 'analisis-ausencias'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <AlertCircle size={18} className={activeView === 'analisis-ausencias' ? 'opacity-100' : 'opacity-70'} />
                <span>Análisis de Ausencias</span>
              </button>
              <button
                onClick={() => setActiveView('produccion-box')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeView === 'produccion-box'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Box size={18} className={activeView === 'produccion-box' ? 'opacity-100' : 'opacity-70'} />
                <span>Producción por Box</span>
              </button>
              <button
                onClick={() => setActiveView('coste-tratamiento-margen')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeView === 'coste-tratamiento-margen'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <DollarSign size={18} className={activeView === 'coste-tratamiento-margen' ? 'opacity-100' : 'opacity-70'} />
                <span>Coste y Margen</span>
              </button>
              <button
                onClick={() => setActiveView('alertas-inteligentes')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeView === 'alertas-inteligentes'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Bell size={18} className={activeView === 'alertas-inteligentes' ? 'opacity-100' : 'opacity-70'} />
                <span>Alertas Inteligentes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido según la vista activa */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard de Analítica</h2>
              <p className="text-gray-600">
                Esta sección mostrará un dashboard con múltiples análisis y visualizaciones de datos.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div 
                className="bg-white shadow-sm rounded-lg p-4 h-full flex flex-col transition-shadow overflow-hidden hover:shadow-md cursor-pointer"
                onClick={() => setActiveView('embudo-conversion')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                    <Filter className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Embudo de Conversión</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  Visualiza el viaje de tus leads desde el contacto inicial hasta convertirse en pacientes activos
                </p>
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView('embudo-conversion');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                  >
                    <span>Ver análisis</span>
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div 
                className="bg-white shadow-sm rounded-lg p-4 h-full flex flex-col transition-shadow overflow-hidden hover:shadow-md cursor-pointer"
                onClick={() => setActiveView('cohortes-retencion')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-indigo-100 rounded-xl ring-1 ring-indigo-200/70">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis de Cohortes</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  Análisis de retención de pacientes agrupados por cohortes
                </p>
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView('cohortes-retencion');
                    }}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
                  >
                    <span>Ver análisis</span>
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div 
                className="bg-white shadow-sm rounded-lg p-4 h-full flex flex-col transition-shadow overflow-hidden hover:shadow-md cursor-pointer"
                onClick={() => setActiveView('coste-tratamiento-margen')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-xl ring-1 ring-green-200/70">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Coste por Tratamiento y Margen</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  Análisis detallado de costes y márgenes por tratamiento para optimizar la rentabilidad
                </p>
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView('coste-tratamiento-margen');
                    }}
                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                  >
                    <span>Ver análisis</span>
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-lg p-4 h-full flex flex-col transition-shadow overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-xl ring-1 ring-purple-200/70">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis Predictivo</h3>
                <p className="text-sm text-gray-600 flex-grow">
                  Próximamente: Modelos predictivos y análisis avanzados
                </p>
              </div>
              <div 
                className="bg-white shadow-sm rounded-lg p-4 h-full flex flex-col transition-shadow overflow-hidden hover:shadow-md cursor-pointer"
                onClick={() => setActiveView('analisis-ausencias')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-100 rounded-xl ring-1 ring-red-200/70">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis de Ausencias</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  Visualiza el impacto de las inasistencias (no-shows) y toma decisiones estratégicas
                </p>
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView('analisis-ausencias');
                    }}
                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                  >
                    <span>Ver análisis</span>
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div 
                className="bg-white shadow-sm rounded-lg p-4 h-full flex flex-col transition-shadow overflow-hidden hover:shadow-md cursor-pointer"
                onClick={() => setActiveView('produccion-box')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                    <Box className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Producción por Box</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  Análisis detallado de producción por profesional y utilización de boxes
                </p>
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView('produccion-box');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                  >
                    <span>Ver análisis</span>
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div 
                className="bg-white shadow-sm rounded-lg p-4 h-full flex flex-col transition-shadow overflow-hidden hover:shadow-md cursor-pointer"
                onClick={() => setActiveView('alertas-inteligentes')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-xl ring-1 ring-orange-200/70">
                    <Bell className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Alertas Inteligentes KPI</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  Configura umbrales y recibe alertas automáticas cuando los KPIs superen los límites establecidos
                </p>
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView('alertas-inteligentes');
                    }}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
                  >
                    <span>Ver alertas</span>
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'cohortes-retencion' && (
          <div className="space-y-6">
            {/* Panel de Filtros */}
            <div className="bg-white shadow-sm rounded-lg mb-6">
              <div className="space-y-4 p-6">
                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                  <div className="flex gap-4 flex-col md:flex-row">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            <Calendar size={16} className="inline mr-1" />
                            Fecha Inicio
                          </label>
                          <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            <Calendar size={16} className="inline mr-1" />
                            Fecha Fin
                          </label>
                          <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Agrupación
                          </label>
                          <select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value as 'monthly' | 'quarterly')}
                            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                          >
                            <option value="monthly">Mensual</option>
                            <option value="quarterly">Trimestral</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Sede (Opcional)
                          </label>
                          <input
                            type="text"
                            value={clinicId || ''}
                            onChange={(e) => setClinicId(e.target.value || undefined)}
                            placeholder="ID de Sede"
                            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={cargarDatosCohortes}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        <span>Actualizar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                <span>Análisis de Cohortes de Retención</span>
              </h2>

              {loading && (
                <div className="p-8 text-center bg-white">
                  <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-600">Cargando...</p>
                </div>
              )}

              {error && (
                <div className="p-8 text-center bg-white">
                  <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={cargarDatosCohortes}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {!loading && !error && cohortData && (
                <div className="space-y-4">
                  {cohortData.cohorts.length === 0 ? (
                    <div className="p-8 text-center bg-white">
                      <Users size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
                      <p className="text-gray-600 mb-4">No se encontraron datos de cohortes para el período seleccionado</p>
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
                <div className="p-8 text-center bg-white">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos</h3>
                  <p className="text-gray-600 mb-4">Selecciona los filtros y haz clic en "Actualizar" para ver los datos</p>
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

