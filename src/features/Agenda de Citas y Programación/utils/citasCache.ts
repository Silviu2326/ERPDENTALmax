// Utilidad para cachear citas en IndexedDB
import { Cita, FiltrosCalendario } from '../api/citasApi';

const DB_NAME = 'AgendaCitasDB';
const DB_VERSION = 1;
const STORE_NAME = 'citas';
const CACHE_METADATA_STORE = 'cacheMetadata';

interface CacheMetadata {
  key: string;
  lastUpdated: string;
  filters: FiltrosCalendario;
}

class CitasCache {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  private async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Error al abrir IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Crear object store para citas
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const citasStore = db.createObjectStore(STORE_NAME, { keyPath: '_id' });
          citasStore.createIndex('fecha_hora_inicio', 'fecha_hora_inicio', { unique: false });
          citasStore.createIndex('profesional_id', 'profesional._id', { unique: false });
          citasStore.createIndex('sede_id', 'sede._id', { unique: false });
        }

        // Crear object store para metadatos de cache
        if (!db.objectStoreNames.contains(CACHE_METADATA_STORE)) {
          db.createObjectStore(CACHE_METADATA_STORE, { keyPath: 'key' });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Genera una clave única para los filtros de cache
   */
  private getCacheKey(filtros: FiltrosCalendario): string {
    const parts = [
      filtros.fecha_inicio,
      filtros.fecha_fin,
      filtros.profesional_id || '',
      filtros.sede_id || '',
      filtros.estado || '',
      filtros.box_id || '',
    ];
    return `citas_${parts.join('_')}`;
  }

  /**
   * Guarda citas en el cache
   */
  async saveCitas(citas: Cita[], filtros: FiltrosCalendario): Promise<void> {
    await this.init();

    if (!this.db) {
      throw new Error('IndexedDB no está disponible');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME, CACHE_METADATA_STORE], 'readwrite');
      const citasStore = transaction.objectStore(STORE_NAME);
      const metadataStore = transaction.objectStore(CACHE_METADATA_STORE);

      // Guardar cada cita
      let completed = 0;
      let hasError = false;

      if (citas.length === 0) {
        // Si no hay citas, solo actualizar metadata
        const cacheKey = this.getCacheKey(filtros);
        const metadata: CacheMetadata = {
          key: cacheKey,
          lastUpdated: new Date().toISOString(),
          filters: filtros,
        };
        metadataStore.put(metadata);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        return;
      }

      citas.forEach((cita) => {
        const request = citasStore.put(cita);
        request.onsuccess = () => {
          completed++;
          if (completed === citas.length && !hasError) {
            // Guardar metadata
            const cacheKey = this.getCacheKey(filtros);
            const metadata: CacheMetadata = {
              key: cacheKey,
              lastUpdated: new Date().toISOString(),
              filters: filtros,
            };
            metadataStore.put(metadata);
          }
        };
        request.onerror = () => {
          hasError = true;
          reject(request.error);
        };
      });

      transaction.oncomplete = () => {
        if (!hasError) resolve();
      };
      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  /**
   * Obtiene citas del cache basado en filtros
   */
  async getCitas(filtros: FiltrosCalendario): Promise<Cita[] | null> {
    await this.init();

    if (!this.db) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME, CACHE_METADATA_STORE], 'readonly');
      const citasStore = transaction.objectStore(STORE_NAME);
      const metadataStore = transaction.objectStore(CACHE_METADATA_STORE);

      // Verificar si hay cache para estos filtros
      const cacheKey = this.getCacheKey(filtros);
      const metadataRequest = metadataStore.get(cacheKey);

      metadataRequest.onsuccess = () => {
        const metadata = metadataRequest.result as CacheMetadata | undefined;

        if (!metadata) {
          // No hay cache para estos filtros
          resolve(null);
          return;
        }

        // Verificar si el cache es reciente (menos de 24 horas)
        const lastUpdated = new Date(metadata.lastUpdated);
        const now = new Date();
        const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

        if (hoursSinceUpdate > 24) {
          // Cache expirado
          resolve(null);
          return;
        }

        // Obtener todas las citas y filtrarlas
        const allCitasRequest = citasStore.getAll();

        allCitasRequest.onsuccess = () => {
          let citas = allCitasRequest.result as Cita[];

          // Filtrar citas según los filtros
          const fechaInicio = new Date(filtros.fecha_inicio);
          const fechaFin = new Date(filtros.fecha_fin);

          citas = citas.filter((cita) => {
            const fechaCita = new Date(cita.fecha_hora_inicio);

            // Filtrar por rango de fechas
            if (fechaCita < fechaInicio || fechaCita > fechaFin) {
              return false;
            }

            // Filtrar por profesional
            if (filtros.profesional_id && cita.profesional._id !== filtros.profesional_id) {
              return false;
            }

            // Filtrar por sede
            if (filtros.sede_id && cita.sede._id !== filtros.sede_id) {
              return false;
            }

            // Filtrar por estado
            if (filtros.estado && cita.estado !== filtros.estado) {
              return false;
            }

            // Filtrar por box (si está disponible)
            if (filtros.box_id && cita.box_asignado !== filtros.box_id) {
              return false;
            }

            return true;
          });

          resolve(citas);
        };

        allCitasRequest.onerror = () => {
          reject(allCitasRequest.error);
        };
      };

      metadataRequest.onerror = () => {
        reject(metadataRequest.error);
      };
    });
  }

  /**
   * Limpia el cache (útil para testing o cuando se necesita forzar recarga)
   */
  async clearCache(): Promise<void> {
    await this.init();

    if (!this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME, CACHE_METADATA_STORE], 'readwrite');
      const citasStore = transaction.objectStore(STORE_NAME);
      const metadataStore = transaction.objectStore(CACHE_METADATA_STORE);

      citasStore.clear();
      metadataStore.clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Obtiene la fecha de última actualización del cache
   */
  async getLastUpdated(filtros: FiltrosCalendario): Promise<Date | null> {
    await this.init();

    if (!this.db) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CACHE_METADATA_STORE], 'readonly');
      const metadataStore = transaction.objectStore(CACHE_METADATA_STORE);
      const cacheKey = this.getCacheKey(filtros);
      const request = metadataStore.get(cacheKey);

      request.onsuccess = () => {
        const metadata = request.result as CacheMetadata | undefined;
        if (metadata) {
          resolve(new Date(metadata.lastUpdated));
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}

// Exportar instancia singleton
export const citasCache = new CitasCache();

