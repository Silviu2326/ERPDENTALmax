// API para gestión de planes de tratamiento
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Tratamiento {
  _id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precioBase: number;
  categoria: string;
}

export interface Procedimiento {
  tratamiento: {
    _id: string;
    codigo?: string;
    nombre: string;
    precioBase?: number;
  };
  piezaDental?: string;
  cara?: string;
  precio: number;
  estadoProcedimiento: 'Pendiente' | 'En Curso' | 'Realizado';
}

export interface FaseTratamiento {
  _id?: string;
  nombre: string;
  descripcion?: string;
  procedimientos: Procedimiento[];
}

export interface PlanTratamiento {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    dni?: string;
  };
  odontologo: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  fechaCreacion: string;
  estado: 'Propuesto' | 'Aceptado' | 'En Curso' | 'Finalizado' | 'Rechazado';
  totalBruto: number;
  descuento: number;
  totalNeto: number;
  notas?: string;
  fases: FaseTratamiento[];
}

export interface NuevoPlanTratamiento {
  pacienteId: string;
  odontologoId: string;
  fases: Array<{
    nombre: string;
    descripcion?: string;
    procedimientos: Array<{
      tratamiento: string; // ID del tratamiento
      piezaDental?: string;
      cara?: string;
      precio: number;
      estadoProcedimiento?: 'Pendiente' | 'En Curso' | 'Realizado';
    }>;
  }>;
  total: number;
  descuento: number;
  notas?: string;
}

export interface PlanTratamientoActualizado {
  estado?: 'Propuesto' | 'Aceptado' | 'En Curso' | 'Finalizado' | 'Rechazado';
  fases?: FaseTratamiento[];
  totalBruto?: number;
  descuento?: number;
  totalNeto?: number;
  notas?: string;
}

// Crear un nuevo plan de tratamiento
export async function crearPlanTratamiento(plan: NuevoPlanTratamiento): Promise<PlanTratamiento> {
  const response = await fetch(`${API_BASE_URL}/planes-tratamiento`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el plan de tratamiento');
  }

  return response.json();
}

// Obtener planes de tratamiento de un paciente
export async function obtenerPlanesPorPaciente(pacienteId: string): Promise<PlanTratamiento[]> {
  const response = await fetch(`${API_BASE_URL}/planes-tratamiento/paciente/${pacienteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los planes de tratamiento del paciente');
  }

  return response.json();
}

// Obtener un plan de tratamiento por ID
export async function obtenerPlanPorId(id: string): Promise<PlanTratamiento> {
  const response = await fetch(`${API_BASE_URL}/planes-tratamiento/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el plan de tratamiento');
  }

  return response.json();
}

// Actualizar un plan de tratamiento
export async function actualizarPlanTratamiento(
  id: string,
  plan: PlanTratamientoActualizado
): Promise<PlanTratamiento> {
  const response = await fetch(`${API_BASE_URL}/planes-tratamiento/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el plan de tratamiento');
  }

  return response.json();
}

// Eliminar un plan de tratamiento
export async function eliminarPlanTratamiento(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/planes-tratamiento/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el plan de tratamiento');
  }
}

// Obtener catálogo de tratamientos
export async function obtenerTratamientos(): Promise<Tratamiento[]> {
  const response = await fetch(`${API_BASE_URL}/tratamientos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el catálogo de tratamientos');
  }

  return response.json();
}



