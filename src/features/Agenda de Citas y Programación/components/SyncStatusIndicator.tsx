import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, RefreshCw, Loader2, X } from 'lucide-react';

export type SyncStatus = 'idle' | 'sincronizando' | 'guardado' | 'error';

export interface SyncOperation {
  id: string;
  type: 'crear' | 'actualizar' | 'mover' | 'cancelar' | 'eliminar' | 'resize';
  status: SyncStatus;
  error?: Error;
  timestamp: number;
  retryCount?: number;
  retryFn?: () => Promise<any>;
}

interface SyncStatusIndicatorProps {
  operations: SyncOperation[];
  onRetry?: (operationId: string) => void;
  onDismiss?: (operationId: string) => void;
  maxVisible?: number;
  autoHideDelay?: number; // ms para ocultar automáticamente después de guardado
}

// Emitir evento de analítica
function emitAnalyticsEvent(event: {
  type: string;
  operationType: string;
  status: SyncStatus;
  error?: string;
  retryCount?: number;
  duration?: number;
}) {
  // Emitir evento personalizado para analítica
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(
      new CustomEvent('sync-analytics', {
        detail: {
          ...event,
          timestamp: Date.now(),
        },
      })
    );
  }

  // También enviar a console para debugging (en producción se puede enviar a un servicio de analítica)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Sync Analytics]', event);
  }
}

export default function SyncStatusIndicator({
  operations,
  onRetry,
  onDismiss,
  maxVisible = 3,
  autoHideDelay = 3000,
}: SyncStatusIndicatorProps) {
  const [visibleOperations, setVisibleOperations] = useState<SyncOperation[]>([]);

  // Filtrar y ordenar operaciones visibles
  useEffect(() => {
    const activeOps = operations
      .filter(op => op.status !== 'idle')
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxVisible);

    setVisibleOperations(activeOps);
  }, [operations, maxVisible]);

  // Auto-ocultar operaciones guardadas exitosamente
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    visibleOperations.forEach(op => {
      if (op.status === 'guardado') {
        const timer = setTimeout(() => {
          if (onDismiss) {
            onDismiss(op.id);
          }
        }, autoHideDelay);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [visibleOperations, autoHideDelay, onDismiss]);

  const handleRetry = useCallback(
    (operation: SyncOperation) => {
      if (onRetry && operation.retryFn) {
        emitAnalyticsEvent({
          type: 'retry_attempt',
          operationType: operation.type,
          status: 'sincronizando',
          retryCount: (operation.retryCount || 0) + 1,
        });
        onRetry(operation.id);
      }
    },
    [onRetry]
  );

  const handleDismiss = useCallback(
    (operationId: string) => {
      if (onDismiss) {
        onDismiss(operationId);
      }
    },
    [onDismiss]
  );

  if (visibleOperations.length === 0) {
    return null;
  }

  const getStatusConfig = (status: SyncStatus) => {
    switch (status) {
      case 'sincronizando':
        return {
          icon: Loader2,
          text: 'Sincronizando...',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
        };
      case 'guardado':
        return {
          icon: CheckCircle,
          text: 'Guardado',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Error',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
        };
      default:
        return {
          icon: CheckCircle,
          text: 'Listo',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
        };
    }
  };

  const getOperationLabel = (type: SyncOperation['type']) => {
    switch (type) {
      case 'crear':
        return 'Creando cita';
      case 'actualizar':
        return 'Actualizando cita';
      case 'mover':
        return 'Moviendo cita';
      case 'cancelar':
        return 'Cancelando cita';
      case 'eliminar':
        return 'Eliminando cita';
      case 'resize':
        return 'Redimensionando cita';
      default:
        return 'Operación';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {visibleOperations.map(operation => {
        const config = getStatusConfig(operation.status);
        const Icon = config.icon;
        const isAnimating = operation.status === 'sincronizando';

        return (
          <div
            key={operation.id}
            className={`${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-lg shadow-lg p-3 flex items-center gap-3 animate-in slide-in-from-right-5 duration-300`}
          >
            <Icon
              className={`${config.iconColor} ${isAnimating ? 'animate-spin' : ''} flex-shrink-0`}
              size={20}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{getOperationLabel(operation.type)}</div>
              <div className="text-xs opacity-75">{config.text}</div>
              {operation.error && (
                <div className="text-xs mt-1 opacity-90 truncate" title={operation.error.message}>
                  {operation.error.message}
                </div>
              )}
            </div>
            {operation.status === 'error' && operation.retryFn && (
              <button
                onClick={() => handleRetry(operation)}
                className="flex-shrink-0 p-1.5 hover:bg-red-100 rounded transition-colors"
                title="Reintentar"
              >
                <RefreshCw size={16} className="text-red-600" />
              </button>
            )}
            {(operation.status === 'guardado' || operation.status === 'error') && (
              <button
                onClick={() => handleDismiss(operation.id)}
                className="flex-shrink-0 p-1.5 hover:bg-black/5 rounded transition-colors"
                title="Cerrar"
              >
                <X size={16} className={config.iconColor} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Hook para gestionar operaciones de sincronización
export function useSyncOperations() {
  const [operations, setOperations] = useState<Map<string, SyncOperation>>(new Map());

  const addOperation = useCallback(
    (operation: Omit<SyncOperation, 'id' | 'timestamp'>) => {
      const id = `${operation.type}-${Date.now()}-${Math.random()}`;
      const newOp: SyncOperation = {
        ...operation,
        id,
        timestamp: Date.now(),
        retryCount: 0,
      };

      setOperations(prev => {
        const next = new Map(prev);
        next.set(id, newOp);
        return next;
      });

      // Emitir evento de inicio
      emitAnalyticsEvent({
        type: 'sync_start',
        operationType: operation.type,
        status: 'sincronizando',
      });

      return id;
    },
    []
  );

  const updateOperation = useCallback(
    (id: string, updates: Partial<SyncOperation>) => {
      setOperations(prev => {
        const next = new Map(prev);
        const existing = next.get(id);
        if (existing) {
          const updated = { ...existing, ...updates };
          next.set(id, updated);

          // Emitir evento de cambio de estado
          if (updates.status) {
            const startTime = existing.timestamp;
            const duration = Date.now() - startTime;

            emitAnalyticsEvent({
              type: 'sync_complete',
              operationType: existing.type,
              status: updates.status,
              error: updates.error?.message,
              retryCount: updated.retryCount,
              duration,
            });
          }
        }
        return next;
      });
    },
    []
  );

  const removeOperation = useCallback((id: string) => {
    setOperations(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const trackMutation = useCallback(
    async <T,>(
      type: SyncOperation['type'],
      mutationFn: () => Promise<T>,
      retryFn?: () => Promise<T>
    ): Promise<T> => {
      const operationId = addOperation({
        type,
        status: 'sincronizando',
        retryFn: retryFn ? async () => trackMutation(type, retryFn, retryFn) : undefined,
      });

      try {
        const result = await mutationFn();
        updateOperation(operationId, { status: 'guardado' });
        return result;
      } catch (error) {
        const existing = operations.get(operationId);
        const retryCount = (existing?.retryCount || 0) + 1;

        updateOperation(operationId, {
          status: 'error',
          error: error instanceof Error ? error : new Error('Error desconocido'),
          retryCount,
        });

        // Emitir evento de error
        emitAnalyticsEvent({
          type: 'sync_error',
          operationType: type,
          status: 'error',
          error: error instanceof Error ? error.message : 'Error desconocido',
          retryCount,
        });

        throw error;
      }
    },
    [addOperation, updateOperation, operations]
  );

  const retryOperation = useCallback(
    async (id: string) => {
      const operation = operations.get(id);
      if (!operation || !operation.retryFn) return;

      updateOperation(id, { status: 'sincronizando' });
      try {
        await operation.retryFn();
        updateOperation(id, { status: 'guardado' });
      } catch (error) {
        updateOperation(id, {
          status: 'error',
          error: error instanceof Error ? error : new Error('Error desconocido'),
          retryCount: (operation.retryCount || 0) + 1,
        });
      }
    },
    [operations, updateOperation]
  );

  return {
    operations: Array.from(operations.values()),
    addOperation,
    updateOperation,
    removeOperation,
    trackMutation,
    retryOperation,
  };
}

