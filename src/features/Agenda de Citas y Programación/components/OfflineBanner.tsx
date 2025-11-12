// Componente para mostrar banner de modo offline
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
  isReconnecting?: boolean;
  lastSyncTime?: Date | null;
  onRetry?: () => void;
}

export default function OfflineBanner({
  isOffline,
  isReconnecting = false,
  lastSyncTime,
  onRetry,
}: OfflineBannerProps) {
  if (!isOffline && !isReconnecting) {
    return null;
  }

  const formatLastSync = (date: Date | null | undefined): string => {
    if (!date) return 'Nunca';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Hace menos de un minuto';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 shadow-md transition-all duration-300 ${
        isOffline
          ? 'bg-amber-500 text-white'
          : isReconnecting
          ? 'bg-blue-500 text-white'
          : ''
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isOffline ? (
            <WifiOff className="h-5 w-5 animate-pulse" />
          ) : (
            <Wifi className="h-5 w-5 animate-spin" />
          )}
          <div>
            <p className="font-semibold">
              {isOffline
                ? 'Modo offline - Solo lectura'
                : isReconnecting
                ? 'Reconectando...'
                : ''}
            </p>
            <p className="text-sm opacity-90">
              {isOffline
                ? 'No se pueden realizar ediciones hasta recuperar la conexión.'
                : 'Sincronizando datos con el servidor...'}
              {lastSyncTime && (
                <span className="ml-2">Última sincronización: {formatLastSync(lastSyncTime)}</span>
              )}
            </p>
          </div>
        </div>
        {isOffline && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors font-medium"
            title="Intentar reconectar"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reintentar</span>
          </button>
        )}
      </div>
    </div>
  );
}

