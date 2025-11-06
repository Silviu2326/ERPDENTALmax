// API para gestión de planes de endodoncia
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Conductometria {
  nombreCanal: string;
  longitudTentativa: number;
  limaReferencia: number;
  longitudRealTrabajo: number;
  instrumentoApicalMaestro: number;
}

export interface PlanEndodoncia {
  _id?: string;
  pacienteId: string;
  odontologoId: string;
  tratamientoId?: string;
  fechaCreacion?: Date | string;
  diente: number;
  diagnosticoPulpar?: string;
  diagnosticoPeriapical?: string;
  conductometria?: Conductometria[];
  tecnicaInstrumentacion?: string;
  tecnicaObturacion?: string;
  medicacionIntraconducto?: string;
  notas?: string;
  estado?: 'Planificado' | 'En Progreso' | 'Finalizado';
}

// Crear un nuevo plan de endodoncia
export async function crearPlanEndodoncia(plan: Omit<PlanEndodoncia, '_id' | 'fechaCreacion'>): Promise<PlanEndodoncia> {
  const response = await fetch(`${API_BASE_URL}/especialidades/endodoncia/planes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el plan de endodoncia' }));
    throw new Error(error.message || 'Error al crear el plan de endodoncia');
  }

  return response.json();
}

// Obtener planes de endodoncia por paciente
export async function obtenerPlanesPorPaciente(pacienteId: string): Promise<PlanEndodoncia[]> {
  const response = await fetch(`${API_BASE_URL}/especialidades/endodoncia/planes/paciente/${pacienteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener los planes de endodoncia' }));
    throw new Error(error.message || 'Error al obtener los planes de endodoncia');
  }

  return response.json();
}

// Obtener un plan de endodoncia por ID
export async function obtenerPlanPorId(planId: string): Promise<PlanEndodoncia> {
  const response = await fetch(`${API_BASE_URL}/especialidades/endodoncia/planes/${planId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener el plan de endodoncia' }));
    throw new Error(error.message || 'Error al obtener el plan de endodoncia');
  }

  return response.json();
}

// Actualizar un plan de endodoncia
export async function actualizarPlanEndodoncia(
  planId: string,
  plan: Partial<PlanEndodoncia>
): Promise<PlanEndodoncia> {
  const response = await fetch(`${API_BASE_URL}/especialidades/endodoncia/planes/${planId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el plan de endodoncia' }));
    throw new Error(error.message || 'Error al actualizar el plan de endodoncia');
  }

  return response.json();
}


