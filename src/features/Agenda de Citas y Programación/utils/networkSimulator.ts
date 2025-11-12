// Utilidades para simular pérdida de red en desarrollo/testing
// Solo disponible en modo desarrollo

/**
 * Simula pérdida de conexión para pruebas
 * Solo funciona en modo desarrollo
 */
export function simulateNetworkLoss(duration: number = 10000): void {
  if (import.meta.env.MODE !== 'development') {
    console.warn('Network simulation solo está disponible en modo desarrollo');
    return;
  }

  // Desactivar la propiedad onLine del navegador
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    configurable: true,
    value: false,
  });

  // Disparar evento offline
  window.dispatchEvent(new Event('offline'));

  console.log(`🔴 Simulación de pérdida de red activada por ${duration}ms`);

  // Restaurar conexión después del tiempo especificado
  setTimeout(() => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });

    window.dispatchEvent(new Event('online'));
    console.log('🟢 Conexión restaurada');
  }, duration);
}

/**
 * Simula conexión intermitente (se conecta y desconecta varias veces)
 */
export function simulateIntermittentConnection(
  cycles: number = 3,
  offlineDuration: number = 5000,
  onlineDuration: number = 3000
): void {
  if (import.meta.env.MODE !== 'development') {
    console.warn('Network simulation solo está disponible en modo desarrollo');
    return;
  }

  let cycle = 0;

  const goOffline = () => {
    if (cycle >= cycles) {
      // Restaurar conexión final
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        configurable: true,
        value: true,
      });
      window.dispatchEvent(new Event('online'));
      console.log('🟢 Simulación de conexión intermitente finalizada');
      return;
    }

    cycle++;
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false,
    });
    window.dispatchEvent(new Event('offline'));
    console.log(`🔴 Ciclo ${cycle}/${cycles}: Offline`);

    setTimeout(goOnline, offlineDuration);
  };

  const goOnline = () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });
    window.dispatchEvent(new Event('online'));
    console.log(`🟢 Ciclo ${cycle}/${cycles}: Online`);

    setTimeout(goOffline, onlineDuration);
  };

  goOffline();
}

/**
 * Añade funciones de simulación al objeto window en desarrollo
 * Permite usar desde la consola del navegador:
 * - window.simulateNetworkLoss(10000)
 * - window.simulateIntermittentConnection(3, 5000, 3000)
 */
export function setupNetworkSimulatorInWindow(): void {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  if (typeof window !== 'undefined') {
    (window as any).simulateNetworkLoss = simulateNetworkLoss;
    (window as any).simulateIntermittentConnection = simulateIntermittentConnection;

    console.log(
      '%c🔧 Network Simulator disponible',
      'color: #10b981; font-weight: bold; font-size: 14px;'
    );
    console.log('Usa window.simulateNetworkLoss(duration) para simular pérdida de red');
    console.log(
      'Usa window.simulateIntermittentConnection(cycles, offlineDuration, onlineDuration) para simular conexión intermitente'
    );
  }
}

