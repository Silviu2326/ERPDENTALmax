// API para el Cuadro de Mandos por Sede del módulo Multi-sede y Franquicias
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Sede {
  _id: string;
  nombre: string;
}

export interface SedeSummary {
  sedeId: string;
  nombreSede: string;
  totalIngresos: number;
  nuevosPacientes: number;
  citasAtendidas: number;
  tasaOcupacion: number;
  ticketPromedio: number;
  citasCanceladas: number;
  tasaCancelacion: number;
}

export interface DashboardSedesFilters {
  startDate: string; // formato YYYY-MM-DD
  endDate: string; // formato YYYY-MM-DD
  sedeIds?: string[]; // IDs de sedes separadas por coma (opcional)
}

/**
 * Obtiene los KPIs y datos agregados para una o varias sedes en un rango de fechas.
 * Es el endpoint principal que alimenta todo el cuadro de mandos.
 */
export async function getSedesSummary(
  filters: DashboardSedesFilters
): Promise<SedeSummary[]> {
  try {
    const params = new URLSearchParams({
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    if (filters.sedeIds && filters.sedeIds.length > 0) {
      params.append('sedeIds', filters.sedeIds.join(','));
    }

    const response = await fetch(
      `${API_BASE_URL}/dashboard/sedes/summary?${params.toString()}`,
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
    console.error('Error en getSedesSummary:', error);
    throw error;
  }
}

/**
 * Obtiene una lista de todas las sedes disponibles en el sistema para poblar los filtros de selección.
 */
export async function getAllSedes(): Promise<Sede[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sedes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener sedes: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getAllSedes:', error);
    throw error;
  }
}



