import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Settings, Bell, Filter, RefreshCw, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import {
  obtenerThresholds,
  obtenerAlertas,
  crearThreshold,
  actualizarThreshold,
  eliminarThreshold,
  marcarAlertaRevisada,
  marcarAlertaResuelta,
  obtenerMetricasDisponibles,
  KPIThreshold,
  AlertaKPI,
  FiltrosAlertas,
} from '../api/alertasApi';
import ModalGestionThreshold from '../components/ModalGestionThreshold';
import ListaAlertas from '../components/ListaAlertas';
import ListaThresholds from '../components/ListaThresholds';
import ResumenAlertas from '../components/ResumenAlertas';

export default function AlertasInteligentesPage() {
  const [thresholds, setThresholds] = useState<KPIThreshold[]>([]);
  const [alertas, setAlertas] = useState<AlertaKPI[]>([]);
  const [resumen, setResumen] = useState({
    activas: 0,
    revisadas: 0,
    resueltas: 0,
    porSeveridad: { info: 0, advertencia: 0, critica: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalThreshold, setMostrarModalThreshold] = useState(false);
  const [thresholdEditando, setThresholdEditando] = useState<KPIThreshold | null>(null);
  const [metricasDisponibles, setMetricasDisponibles] = useState<Array<{ valor: string; etiqueta: string; descripcion: string }>>([]);
  const [filtros, setFiltros] = useState<FiltrosAlertas>({
    estado: 'activa',
  });
  const [tabActivo, setTabActivo] = useState<'alertas' | 'thresholds'>('alertas');

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [thresholdsData, alertasData, metricasData] = await Promise.all([
        obtenerThresholds(),
        obtenerAlertas(filtros),
        obtenerMetricasDisponibles(),
      ]);

      setThresholds(thresholdsData.thresholds);
      setAlertas(alertasData.alertas);
      setResumen(alertasData.resumen);
      setMetricasDisponibles(metricasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearThreshold = async (threshold: Omit<KPIThreshold, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const nuevo = await crearThreshold(threshold);
      setThresholds([...thresholds, nuevo]);
      setMostrarModalThreshold(false);
      setThresholdEditando(null);
      // Recargar alertas para ver si se generan nuevas
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear threshold');
      throw err;
    }
  };

  const handleActualizarThreshold = async (thresholdId: string, threshold: Partial<KPIThreshold>) => {
    try {
      const actualizado = await actualizarThreshold(thresholdId, threshold);
      setThresholds(thresholds.map((t) => (t._id === thresholdId ? actualizado : t)));
      setMostrarModalThreshold(false);
      setThresholdEditando(null);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar threshold');
      throw err;
    }
  };

  const handleEliminarThreshold = async (thresholdId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este threshold?')) {
      return;
    }
    try {
      await eliminarThreshold(thresholdId);
      setThresholds(thresholds.filter((t) => t._id !== thresholdId));
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar threshold');
    }
  };

  const handleEditarThreshold = (threshold: KPIThreshold) => {
    setThresholdEditando(threshold);
    setMostrarModalThreshold(true);
  };

  const handleNuevoThreshold = () => {
    setThresholdEditando(null);
    setMostrarModalThreshold(true);
  };

  const handleMarcarRevisada = async (alertaId: string) => {
    try {
      await marcarAlertaRevisada(alertaId);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar alerta como revisada');
    }
  };

  const handleMarcarResuelta = async (alertaId: string, notas?: string) => {
    try {
      await marcarAlertaResuelta(alertaId, notas);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar alerta como resuelta');
    }
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
                  <Bell size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Alertas Inteligentes KPI
                  </h1>
                  <p className="text-gray-600">
                    Configura umbrales y recibe alertas automáticas cuando los KPIs superen los límites
                  </p>
                </div>
              </div>
              <button
                onClick={handleNuevoThreshold}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <Plus size={20} className="mr-2" />
                Nuevo Threshold
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Error */}
          {error && (
            <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Resumen de Alertas */}
          <ResumenAlertas resumen={resumen} />

          {/* Filtros */}
          <div className="bg-white shadow-sm rounded-2xl p-0">
            <div className="px-4 py-3 border-b border-gray-200/60">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Filter size={18} className="text-slate-600" />
                  <span>Filtros</span>
                </h2>
                <button
                  onClick={cargarDatos}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Filter size={16} className="inline mr-1" />
                      Estado
                    </label>
                    <select
                      value={filtros.estado || ''}
                      onChange={(e) => setFiltros({ ...filtros, estado: e.target.value as any || undefined })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    >
                      <option value="">Todos</option>
                      <option value="activa">Activas</option>
                      <option value="revisada">Revisadas</option>
                      <option value="resuelta">Resueltas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <AlertTriangle size={16} className="inline mr-1" />
                      Severidad
                    </label>
                    <select
                      value={filtros.severidad || ''}
                      onChange={(e) => setFiltros({ ...filtros, severidad: e.target.value as any || undefined })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    >
                      <option value="">Todas</option>
                      <option value="critica">Crítica</option>
                      <option value="advertencia">Advertencia</option>
                      <option value="info">Info</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <TrendingUp size={16} className="inline mr-1" />
                      Métrica
                    </label>
                    <select
                      value={filtros.metrica || ''}
                      onChange={(e) => setFiltros({ ...filtros, metrica: e.target.value || undefined })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    >
                      <option value="">Todas</option>
                      {metricasDisponibles.map((m) => (
                        <option key={m.valor} value={m.valor}>
                          {m.etiqueta}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Settings size={16} className="inline mr-1" />
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={filtros.fechaInicio || ''}
                      onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value || undefined })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow-sm rounded-2xl p-0">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                <button
                  onClick={() => setTabActivo('alertas')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    tabActivo === 'alertas'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Bell size={18} className={tabActivo === 'alertas' ? 'opacity-100' : 'opacity-70'} />
                  <span>Alertas ({resumen.activas})</span>
                </button>
                <button
                  onClick={() => setTabActivo('thresholds')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    tabActivo === 'thresholds'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Settings size={18} className={tabActivo === 'thresholds' ? 'opacity-100' : 'opacity-70'} />
                  <span>Thresholds ({thresholds.length})</span>
                </button>
              </div>
            </div>

            <div className="px-4 pb-4">
              {/* Sección de Alertas */}
              {tabActivo === 'alertas' && (
                <div className="mt-6">
                  {loading ? (
                    <div className="bg-white shadow-sm rounded-2xl p-8 text-center">
                      <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                      <p className="text-gray-600">Cargando alertas...</p>
                    </div>
                  ) : (
                    <ListaAlertas
                      alertas={alertas}
                      onMarcarRevisada={handleMarcarRevisada}
                      onMarcarResuelta={handleMarcarResuelta}
                    />
                  )}
                </div>
              )}

              {/* Sección de Thresholds */}
              {tabActivo === 'thresholds' && (
                <div className="mt-6">
                  <ListaThresholds
                    thresholds={thresholds}
                    onEditar={handleEditarThreshold}
                    onEliminar={handleEliminarThreshold}
                    onToggleActivo={async (thresholdId, activa) => {
                      await handleActualizarThreshold(thresholdId, { activa });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Gestión de Threshold */}
      {mostrarModalThreshold && (
        <ModalGestionThreshold
          threshold={thresholdEditando}
          metricasDisponibles={metricasDisponibles}
          onGuardar={thresholdEditando ? (data) => handleActualizarThreshold(thresholdEditando._id!, data) : handleCrearThreshold}
          onCerrar={() => {
            setMostrarModalThreshold(false);
            setThresholdEditando(null);
          }}
        />
      )}
    </div>
  );
}



