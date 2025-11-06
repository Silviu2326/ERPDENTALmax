// API para el Panel Global de Centros del módulo Multi-sede y Franquicias
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface DashboardSummary {
  totalRevenue: number;
  totalNewPatients: number;
  averageOccupancyRate: number;
  centersData: Array<{
    id: string;
    nombre: string;
    facturacion: number;
    pacientesNuevos: number;
  }>;
}

export interface PerformanceRankingItem {
  id: string;
  nombre: string;
  valor: number;
  metrica: 'revenue' | 'newPatients' | 'occupancy';
}

export interface PerformanceRankingFilters {
  metric: 'revenue' | 'newPatients' | 'occupancy';
  order: 'asc' | 'desc';
  limit?: number;
}

/**
 * Obtiene un resumen agregado de los KPIs y datos financieros de todos los centros
 * gestionados por el usuario para un rango de fechas específico.
 */
export async function getDashboardSummary(
  startDate: string,
  endDate: string
): Promise<DashboardSummary> {
  try {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    const response = await fetch(
      `${API_BASE_URL}/multi-sede/dashboard/summary?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener datos del dashboard: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getDashboardSummary:', error);
    throw error;
  }
}

/**
 * Devuelve una lista de centros clasificados según una métrica específica
 * (facturación, pacientes nuevos, ocupación) en orden ascendente o descendente.
 */
export async function getPerformanceRanking(
  filters: PerformanceRankingFilters
): Promise<PerformanceRankingItem[]> {
  try {
    const params = new URLSearchParams({
      metric: filters.metric,
      order: filters.order,
    });

    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const response = await fetch(
      `${API_BASE_URL}/multi-sede/dashboard/ranking?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener ranking de centros: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getPerformanceRanking:', error);
    throw error;
  }
}


