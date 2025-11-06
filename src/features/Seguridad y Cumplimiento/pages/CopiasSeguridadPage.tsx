import { useState, useEffect } from 'react';
import { Database, Download, RotateCcw, RefreshCw, Settings, AlertCircle, Plus } from 'lucide-react';
import BackupHistoryTable from '../components/BackupHistoryTable';
import BackupScheduleSettings from '../components/BackupScheduleSettings';
import RestoreBackupModal from '../components/RestoreBackupModal';
import {
  BackupLog,
  listBackups,
  createManualBackup,
  getBackupDownloadUrl,
  restoreBackup,
} from '../api/backupApi';

type VistaCopias = 'historial' | 'configuracion';

export default function CopiasSeguridadPage() {
  const [vistaActual, setVistaActual] = useState<VistaCopias>('historial');
  const [backups, setBackups] = useState<BackupLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [creandoBackup, setCreandoBackup] = useState(false);
  const [backupParaRestaurar, setBackupParaRestaurar] = useState<BackupLog | null>(null);
  const [restaurando, setRestaurando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filtroEstado, setFiltroEstado] = useState<'pending' | 'completed' | 'failed' | 'all'>('all');

  useEffect(() => {
    cargarBackups();
    // Polling para actualizar el estado de backups en progreso
    const interval = setInterval(() => {
      if (filtroEstado === 'all' || filtroEstado === 'pending') {
        cargarBackups();
      }
    }, 10000); // Actualizar cada 10 segundos

    return () => clearInterval(interval);
  }, [paginacion.page, filtroEstado]);

  const cargarBackups = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {
        page: paginacion.page,
        limit: paginacion.limit,
      };
      if (filtroEstado !== 'all') {
        params.status = filtroEstado;
      }
      const response = await listBackups(params);
      setBackups(response.backups);
      setPaginacion({
        ...paginacion,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      setError(err.message || 'Error al cargar el historial de copias de seguridad');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearBackupManual = async () => {
    try {
      setCreandoBackup(true);
      setError(null);
      setSuccess(null);
      await createManualBackup();
      setSuccess('Copia de seguridad iniciada. Se mostrará en el historial cuando esté completa.');
      // Esperar un poco antes de recargar para que el backend procese
      setTimeout(() => {
        cargarBackups();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al crear la copia de seguridad');
    } finally {
      setCreandoBackup(false);
    }
  };

  const handleDescargarBackup = async (backupId: string) => {
    try {
      setError(null);
      const response = await getBackupDownloadUrl(backupId);
      // Abrir la URL en una nueva pestaña para descargar
      window.open(response.url, '_blank');
      setSuccess('Descarga iniciada');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al obtener la URL de descarga');
    }
  };

  const handleIniciarRestauracion = async (confirmationToken: string) => {
    if (!backupParaRestaurar?._id) return;

    try {
      setRestaurando(true);
      setError(null);
      await restoreBackup(backupParaRestaurar._id, confirmationToken);
      setSuccess('Restauración iniciada. El sistema entrará en modo de mantenimiento.');
      setBackupParaRestaurar(null);
      // Recargar backups después de un momento
      setTimeout(() => {
        cargarBackups();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar la restauración');
      throw err; // Re-lanzar para que el modal maneje el error
    } finally {
      setRestaurando(false);
    }
  };

  const handleFiltroCambio = (estado: 'pending' | 'completed' | 'failed' | 'all') => {
    setFiltroEstado(estado);
    setPaginacion({ ...paginacion, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Copias de Seguridad</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gestiona y restaura copias de seguridad de la base de datos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={cargarBackups}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              <button
                onClick={handleCrearBackupManual}
                disabled={creandoBackup || loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {creandoBackup ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Copia Manual
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de pestañas */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-1">
            <button
              onClick={() => setVistaActual('historial')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'historial'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Database className="w-4 h-4 inline mr-2" />
              Historial de Copias
            </button>
            <button
              onClick={() => setVistaActual('configuracion')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                vistaActual === 'configuracion'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configuración
            </button>
          </nav>
        </div>
      </div>

      {/* Mensajes de estado */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        {vistaActual === 'historial' && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
                <div className="flex space-x-2">
                  {(['all', 'completed', 'pending', 'failed'] as const).map((estado) => (
                    <button
                      key={estado}
                      onClick={() => handleFiltroCambio(estado)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        filtroEstado === estado
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {estado === 'all'
                        ? 'Todos'
                        : estado === 'completed'
                        ? 'Completados'
                        : estado === 'pending'
                        ? 'En Progreso'
                        : 'Fallidos'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabla de historial */}
            <BackupHistoryTable
              backups={backups}
              loading={loading}
              onDownload={handleDescargarBackup}
              onRestore={setBackupParaRestaurar}
              onRefresh={cargarBackups}
            />

            {/* Paginación */}
            {paginacion.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {backups.length} de {paginacion.total} copias de seguridad
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPaginacion({ ...paginacion, page: paginacion.page - 1 })}
                    disabled={paginacion.page === 1 || loading}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-700">
                    Página {paginacion.page} de {paginacion.totalPages}
                  </span>
                  <button
                    onClick={() => setPaginacion({ ...paginacion, page: paginacion.page + 1 })}
                    disabled={paginacion.page >= paginacion.totalPages || loading}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {vistaActual === 'configuracion' && (
          <BackupScheduleSettings onSettingsUpdated={cargarBackups} />
        )}
      </div>

      {/* Modal de restauración */}
      <RestoreBackupModal
        backup={backupParaRestaurar}
        isOpen={!!backupParaRestaurar}
        onClose={() => setBackupParaRestaurar(null)}
        onConfirm={handleIniciarRestauracion}
        loading={restaurando}
      />
    </div>
  );
}


