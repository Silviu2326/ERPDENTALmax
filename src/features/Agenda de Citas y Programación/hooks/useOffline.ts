// Hook para gestionar estado online/offline
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOfflineOptions {
  onOnline?: () => void;
  onOffline?: () => void;
  checkInterval?: number; // Intervalo en ms para verificar conexión
}

interface UseOfflineReturn {
  isOnline: boolean;
  isOffline: boolean;
  wasOffline: boolean; // Si estuvo offline y ahora está online (útil para resincronizar)
  lastOnlineTime: Date | null;
  checkConnection: () => Promise<boolean>;
}

/**
 * Hook para gestionar el estado de conexión online/offline
 * Detecta cambios en la conectividad y permite verificar manualmente
 */
export function useOffline(options: UseOfflineOptions = {}): UseOfflineReturn {
  const { onOnline, onOffline, checkInterval = 5000 } = options;

  const [isOnline, setIsOnline] = useState(() => {
    // Verificar estado inicial
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    return true; // Asumir online por defecto
  });

  const [wasOffline, setWasOffline] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(() => {
    return isOnline ? new Date() : null;
  });

  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasOfflineRef = useRef(false);

  /**
   * Verifica la conexión haciendo una petición HEAD a un recurso pequeño
   */
  const checkConnection = useCallback(async (): Promise<boolean> => {
    // Primero verificar el estado del navegador
    if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
      return false;
    }

    // Intentar hacer una petición para verificar conectividad real
    try {
      // Usar un endpoint pequeño o un favicon
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout de 3 segundos

      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      // Si falla, asumir offline
      return false;
    }
  }, []);

  /**
   * Actualiza el estado de conexión
   */
  const updateConnectionStatus = useCallback(
    async (forceCheck = false) => {
      let newStatus: boolean;

      if (forceCheck) {
        newStatus = await checkConnection();
      } else {
        // Usar el estado del navegador si está disponible
        if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
          newStatus = navigator.onLine;
        } else {
          newStatus = true;
        }
      }

      const previousStatus = isOnline;

      if (newStatus !== previousStatus) {
        setIsOnline(newStatus);

        if (newStatus) {
          // Pasó de offline a online
          setLastOnlineTime(new Date());
          if (wasOfflineRef.current) {
            setWasOffline(true);
            wasOfflineRef.current = false;
            // Resetear después de un momento
            setTimeout(() => setWasOffline(false), 1000);
          }
          onOnline?.();
        } else {
          // Pasó de online a offline
          wasOfflineRef.current = true;
          onOffline?.();
        }
      } else if (newStatus) {
        // Si sigue online, actualizar última vez online
        setLastOnlineTime(new Date());
      }
    },
    [isOnline, checkConnection, onOnline, onOffline]
  );

  // Escuchar eventos de online/offline del navegador
  useEffect(() => {
    const handleOnline = () => {
      updateConnectionStatus(true); // Forzar verificación cuando el navegador dice que está online
    };

    const handleOffline = () => {
      updateConnectionStatus(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificación periódica (útil si los eventos del navegador no son confiables)
    if (checkInterval > 0) {
      checkIntervalRef.current = setInterval(() => {
        updateConnectionStatus(true);
      }, checkInterval);
    }

    // Verificación inicial
    updateConnectionStatus(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [updateConnectionStatus, checkInterval]);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    lastOnlineTime,
    checkConnection,
  };
}

