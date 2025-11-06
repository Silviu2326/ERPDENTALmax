// API para el Dashboard Principal del módulo Cuadro de Mandos e Informes
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface DashboardSummary {
  kpis: {
    totalRevenue: number;
    newPatients: number;
    completedAppointments: number;
    showRate: number;
  };
  chartsData: {
    revenueTimeline: Array<{
      fecha: string;
      ingresos: number;
    }>;
    appointmentStatus: Array<{
      estado: string;
      cantidad: number;
      porcentaje: number;
    }>;
  };
  lists: {
    topPerformingTreatments: Array<{
      _id: string;
      nombre: string;
      cantidad: number;
      ingresos: number;
    }>;
    topProfessionals: Array<{
      _id: string;
      nombre: string;
      apellidos: string;
      citasCompletadas: number;
      ingresos: number;
    }>;
  };
}

export interface DashboardFilters {
  startDate: string; // Formato ISO 8601
  endDate: string; // Formato ISO 8601
  clinicId?: string; // Opcional. Si no se proporciona, se agregan los datos de todas las clínicas
}

/**
 * Obtiene todos los datos agregados necesarios para el Dashboard Principal
 * para un rango de fechas y una clínica específica (o todas).
 * Consolida KPIs, datos para gráficos y listas en una única llamada.
 */
export async function getDashboardSummary(filtros: DashboardFilters): Promise<DashboardSummary> {
  try {
    const params = new URLSearchParams({
      startDate: filtros.startDate,
      endDate: filtros.endDate,
    });

    if (filtros.clinicId) {
      params.append('clinicId', filtros.clinicId);
    }

    const response = await fetch(`${API_BASE_URL}/dashboard/summary?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

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


