import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Settings, Bell, CheckCircle, XCircle, Filter, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
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

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'advertencia':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeveridadIcon = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'advertencia':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Bell className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-600 to-red-600 p-3 rounded-xl shadow-lg">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Alertas Inteligentes KPI</h1>
                <p className="text-gray-600 mt-1">Configura umbrales y recibe alertas automáticas cuando los KPIs superen los límites</p>
              </div>
            </div>
            <button
              onClick={handleNuevoThreshold}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Threshold</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Resumen de Alertas */}
          <ResumenAlertas resumen={resumen} />
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
            </h2>
            <button
              onClick={cargarDatos}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filtros.estado || ''}
                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value as any || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="activa">Activas</option>
                <option value="revisada">Revisadas</option>
                <option value="resuelta">Resueltas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severidad</label>
              <select
                value={filtros.severidad || ''}
                onChange={(e) => setFiltros({ ...filtros, severidad: e.target.value as any || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                <option value="critica">Crítica</option>
                <option value="advertencia">Advertencia</option>
                <option value="info">Info</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Métrica</label>
              <select
                value={filtros.metrica || ''}
                onChange={(e) => setFiltros({ ...filtros, metrica: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
              <input
                type="date"
                value={filtros.fechaInicio || ''}
                onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                className="py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600"
              >
                Alertas ({resumen.activas})
              </button>
              <button
                className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                onClick={() => {
                  // Cambiar a vista de thresholds
                  const thresholdsSection = document.getElementById('thresholds-section');
                  const alertasSection = document.getElementById('alertas-section');
                  if (thresholdsSection && alertasSection) {
                    alertasSection.style.display = 'none';
                    thresholdsSection.style.display = 'block';
                  }
                }}
              >
                Thresholds ({thresholds.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Sección de Alertas */}
            <div id="alertas-section">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600">Cargando alertas...</span>
                </div>
              ) : (
                <ListaAlertas
                  alertas={alertas}
                  onMarcarRevisada={handleMarcarRevisada}
                  onMarcarResuelta={handleMarcarResuelta}
                />
              )}
            </div>

            {/* Sección de Thresholds */}
            <div id="thresholds-section" style={{ display: 'none' }}>
              <ListaThresholds
                thresholds={thresholds}
                onEditar={handleEditarThreshold}
                onEliminar={handleEliminarThreshold}
                onToggleActivo={async (thresholdId, activa) => {
                  await handleActualizarThreshold(thresholdId, { activa });
                }}
              />
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
    </div>
  );
}


