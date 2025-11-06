// API para la funcionalidad de Revisión por la Dirección

export interface KPIsResponse {
  totalRevenue: number;
  newPatients: number;
  appointmentOccupancy: number;
  averageSatisfactionScore: number;
}

export interface FiltrosKPIs {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  clinicId?: string;
}

export interface PuntoTendenciaFinanciera {
  date: string; // ISO date string
  revenue: number;
  expenses: number;
  profit: number;
}

export interface FiltrosTendencias {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  clinicId?: string;
  groupBy: 'day' | 'week' | 'month';
}

export interface RendimientoProfesional {
  professionalId: string;
  professionalName: string;
  revenueGenerated: number;
  proceduresCount: number;
  patientRating: number;
}

export interface PlanDeAccion {
  _id?: string;
  title: string;
  description: string;
  responsibleUserId: string;
  responsibleUserName?: string;
  dueDate: string; // ISO date string
  status: 'Pendiente' | 'En Progreso' | 'Completado';
  clinicId: string;
  createdBy: string;
  createdByUserName?: string;
  createdAt?: string;
  notes?: Array<{
    note: string;
    author: string;
    authorName?: string;
    date: string;
  }>;
}

export interface FiltrosPlanesAccion {
  clinicId?: string;
  status?: 'Pendiente' | 'En Progreso' | 'Completado';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Obtiene los KPIs principales (ingresos, pacientes nuevos, ocupación, satisfacción)
 * para un período y sede específicos.
 */
export async function obtenerKPIs(filtros: FiltrosKPIs): Promise<KPIsResponse> {
  try {
    const params = new URLSearchParams({
      startDate: filtros.startDate,
      endDate: filtros.endDate,
    });

    if (filtros.clinicId) {
      params.append('clinicId', filtros.clinicId);
    }

    const response = await fetch(`${API_BASE_URL}/revision-direccion/kpis?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener KPIs: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerKPIs:', error);
    throw error;
  }
}

/**
 * Obtiene datos agregados para graficar tendencias de ingresos, gastos y beneficios
 * a lo largo del tiempo.
 */
export async function obtenerTendenciasFinancieras(
  filtros: FiltrosTendencias
): Promise<PuntoTendenciaFinanciera[]> {
  try {
    const params = new URLSearchParams({
      startDate: filtros.startDate,
      endDate: filtros.endDate,
      groupBy: filtros.groupBy,
    });

    if (filtros.clinicId) {
      params.append('clinicId', filtros.clinicId);
    }

    const response = await fetch(
      `${API_BASE_URL}/revision-direccion/tendencias-financieras?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener tendencias financieras: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerTendenciasFinancieras:', error);
    throw error;
  }
}

/**
 * Obtiene un resumen del rendimiento por profesional (odontólogo).
 */
export async function obtenerRendimientoProfesionales(
  filtros: Omit<FiltrosKPIs, 'clinicId'> & { clinicId?: string }
): Promise<RendimientoProfesional[]> {
  try {
    const params = new URLSearchParams({
      startDate: filtros.startDate,
      endDate: filtros.endDate,
    });

    if (filtros.clinicId) {
      params.append('clinicId', filtros.clinicId);
    }

    const response = await fetch(
      `${API_BASE_URL}/revision-direccion/rendimiento-profesionales?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener rendimiento de profesionales: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerRendimientoProfesionales:', error);
    throw error;
  }
}

/**
 * Recupera todos los planes de acción creados durante las revisiones.
 */
export async function obtenerPlanesAccion(
  filtros?: FiltrosPlanesAccion
): Promise<PlanDeAccion[]> {
  try {
    const params = new URLSearchParams();

    if (filtros?.clinicId) {
      params.append('clinicId', filtros.clinicId);
    }

    if (filtros?.status) {
      params.append('status', filtros.status);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/revision-direccion/planes-accion${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener planes de acción: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerPlanesAccion:', error);
    throw error;
  }
}

/**
 * Crea un nuevo plan de acción como resultado de la revisión.
 */
export async function crearPlanAccion(
  plan: Omit<PlanDeAccion, '_id' | 'createdAt' | 'status'> & { status?: PlanDeAccion['status'] }
): Promise<PlanDeAccion> {
  try {
    const response = await fetch(`${API_BASE_URL}/revision-direccion/planes-accion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        title: plan.title,
        description: plan.description,
        responsibleUserId: plan.responsibleUserId,
        dueDate: plan.dueDate,
        clinicId: plan.clinicId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al crear plan de acción: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en crearPlanAccion:', error);
    throw error;
  }
}

/**
 * Actualiza el estado o añade notas a un plan de acción existente.
 */
export async function actualizarPlanAccion(
  planId: string,
  actualizacion: {
    status?: PlanDeAccion['status'];
    notes?: Array<{
      note: string;
      author: string;
      date: string;
    }>;
  }
): Promise<PlanDeAccion> {
  try {
    const response = await fetch(`${API_BASE_URL}/revision-direccion/planes-accion/${planId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(actualizacion),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar plan de acción: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en actualizarPlanAccion:', error);
    throw error;
  }
}


