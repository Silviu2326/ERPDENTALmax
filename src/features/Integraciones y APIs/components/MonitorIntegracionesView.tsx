import { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Search,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  obtenerLogsIntegraciones,
  obtenerErroresIntegraciones,
  obtenerEstadisticasIntegraciones,
  LogIntegracion,
  ErrorIntegracion,
  EstadisticasIntegraciones,
  FiltrosLogsIntegraciones,
} from '../api/integracionesApi';

type VistaMonitor = 'logs' | 'errores' | 'estadisticas';

export default function MonitorIntegracionesView() {
  const [vistaActual, setVistaActual] = useState<VistaMonitor>('logs');
  const [logs, setLogs] = useState<LogIntegracion[]>([]);
  const [errores, setErrores] = useState<ErrorIntegracion[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasIntegraciones | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosLogsIntegraciones>({
    tipoIntegracion: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: '',
  });

  useEffect(() => {
    cargarDatos();
  }, [vistaActual, filtros]);

  const cargarDatos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      switch (vistaActual) {
        case 'logs':
          const logsData = await obtenerLogsIntegraciones(filtros);
          setLogs(logsData);
          break;
        case 'errores':
          const erroresData = await obtenerErroresIntegraciones(filtros);
          setErrores(erroresData);
          break;
        case 'estadisticas':
          const statsData = await obtenerEstadisticasIntegraciones();
          setEstadisticas(statsData);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleFiltroChange = (campo: keyof FiltrosLogsIntegraciones, valor: string) => {
    setFiltros({ ...filtros, [campo]: valor });
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipoIntegracion: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: '',
    });
  };

  const exportarLogs = () => {
    // TODO: Implementar exportación de logs
    alert('Funcionalidad de exportación próximamente disponible');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Monitor de Integraciones</h2>
          <p className="text-gray-600">
            Monitorea el estado, logs y errores de todas las integraciones del sistema
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={cargarDatos}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          {vistaActual === 'logs' && (
            <button
              onClick={exportarLogs}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Exportar
            </button>
          )}
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 px-6">
            <button
              onClick={() => setVistaActual('logs')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'logs'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Logs
            </button>
            <button
              onClick={() => setVistaActual('errores')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'errores'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <AlertCircle className="w-4 h-4 inline mr-2" />
              Errores
            </button>
            <button
              onClick={() => setVistaActual('estadisticas')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'estadisticas'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Estadísticas
            </button>
          </nav>
        </div>

        {/* Filtros */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Integración
              </label>
              <select
                value={filtros.tipoIntegracion}
                onChange={(e) => handleFiltroChange('tipoIntegracion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos</option>
                <option value="webhook">Webhook</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="laboratorio">Laboratorio</option>
                <option value="pasarela-pago">Pasarela de Pago</option>
                <option value="api-publica">API Pública</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos</option>
                <option value="exitoso">Exitoso</option>
                <option value="error">Error</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
              <input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
              <input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="mt-3">
            <button
              onClick={limpiarFiltros}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {vistaActual === 'logs' && <VistaLogs logs={logs} formatFecha={formatFecha} />}
              {vistaActual === 'errores' && (
                <VistaErrores errores={errores} formatFecha={formatFecha} />
              )}
              {vistaActual === 'estadisticas' && estadisticas && (
                <VistaEstadisticas estadisticas={estadisticas} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Vista de Logs
function VistaLogs({
  logs,
  formatFecha,
}: {
  logs: LogIntegracion[];
  formatFecha: (fecha: string) => string;
}) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay logs disponibles</h3>
        <p className="text-gray-600">No se encontraron logs con los filtros aplicados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha y Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Integración
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Evento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Detalles
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  {formatFecha(log.fecha)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {log.tipoIntegracion}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.nombreIntegracion}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.evento}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {log.estado === 'exitoso' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Exitoso
                  </span>
                ) : log.estado === 'error' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    Error
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Pendiente
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                {log.detalles ? (
                  <details className="cursor-pointer">
                    <summary className="text-blue-600 hover:text-blue-800 text-sm">
                      Ver detalles
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.detalles, null, 2)}
                    </pre>
                  </details>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Vista de Errores
function VistaErrores({
  errores,
  formatFecha,
}: {
  errores: ErrorIntegracion[];
  formatFecha: (fecha: string) => string;
}) {
  if (errores.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay errores</h3>
        <p className="text-gray-600">Todas las integraciones están funcionando correctamente</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errores.map((error) => (
        <div
          key={error.id}
          className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="font-semibold text-red-900">{error.titulo}</h4>
                <span className="ml-3 px-2 py-1 text-xs font-medium bg-red-200 text-red-800 rounded-full">
                  {error.tipoIntegracion}
                </span>
              </div>
              <p className="text-sm text-red-800 mb-2">{error.mensaje}</p>
              <div className="flex items-center text-xs text-red-600 space-x-4">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatFecha(error.fecha)}
                </span>
                <span>Integración: {error.nombreIntegracion}</span>
                {error.intentos && <span>Intentos: {error.intentos}</span>}
              </div>
              {error.detalles && (
                <details className="mt-2">
                  <summary className="text-sm text-red-700 cursor-pointer hover:text-red-900">
                    Ver detalles técnicos
                  </summary>
                  <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-x-auto">
                    {JSON.stringify(error.detalles, null, 2)}
                  </pre>
                </details>
              )}
            </div>
            {error.resuelto ? (
              <span className="ml-4 px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Resuelto
              </span>
            ) : (
              <span className="ml-4 px-3 py-1 text-xs font-medium bg-red-200 text-red-800 rounded-full">
                Activo
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Vista de Estadísticas
function VistaEstadisticas({ estadisticas }: { estadisticas: EstadisticasIntegraciones }) {
  return (
    <div className="space-y-6">
      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Integraciones</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.totalIntegraciones}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Integraciones Activas</p>
              <p className="text-2xl font-bold text-green-600">{estadisticas.integracionesActivas}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Errores (24h)</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.errores24h}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-indigo-600">
                {estadisticas.tasaExito.toFixed(1)}%
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas por Tipo */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas por Tipo</h3>
        <div className="space-y-3">
          {estadisticas.porTipo.map((stat) => (
            <div key={stat.tipo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mr-3">
                  {stat.tipo}
                </span>
                <span className="text-sm text-gray-700">{stat.nombre}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{stat.total}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{stat.exitosos}</p>
                  <p className="text-xs text-gray-500">Exitosos</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">{stat.errores}</p>
                  <p className="text-xs text-gray-500">Errores</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-indigo-600">
                    {stat.tasaExito.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">Éxito</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



