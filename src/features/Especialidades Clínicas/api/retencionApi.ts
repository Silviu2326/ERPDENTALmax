// API para gestión de planes de retención de ortodoncia
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Retenedor {
  tipo: string; // 'Fijo', 'Hawley', 'Essix', 'Otro'
  arcada: string; // 'Superior', 'Inferior', 'Ambas'
  material: string;
  fechaColocacion: string;
  instrucciones: string;
}

export interface SeguimientoRetencion {
  _id?: string;
  fechaCita: string;
  estado: 'Programada' | 'Realizada' | 'Cancelada';
  observaciones: string;
  fotos: string[]; // URLs de las fotos
}

export interface PlanRetencion {
  _id?: string;
  paciente: string; // ObjectId del paciente
  tratamientoOrtodoncia: string; // ObjectId del tratamiento
  fechaInicio: string;
  estado: 'Activo' | 'Finalizado';
  retenedores: Retenedor[];
  seguimientos: SeguimientoRetencion[];
  notasGenerales?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearPlanRetencionRequest {
  pacienteId: string;
  tratamientoId: string;
  fechaInicio: string;
  retenedores: Retenedor[];
  notasGenerales?: string;
}

export interface ActualizarPlanRetencionRequest {
  estado?: 'Activo' | 'Finalizado';
  notasGenerales?: string;
  retenedores?: Retenedor[];
}

export interface CrearSeguimientoRequest {
  planId: string;
  fechaCita: string;
  observaciones?: string;
}

export interface ActualizarSeguimientoRequest {
  estado?: 'Programada' | 'Realizada' | 'Cancelada';
  observaciones?: string;
  fotos?: string[];
}

/**
 * Obtiene el plan de retención activo o el historial de planes para un paciente específico
 */
export async function obtenerPlanRetencion(
  pacienteId: string
): Promise<PlanRetencion | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/pacientes/${pacienteId}/ortodoncia/retencion`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No hay plan de retención
      }
      throw new Error('Error al obtener el plan de retención');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener plan de retención:', error);
    throw error;
  }
}

/**
 * Crea un nuevo plan de retención para un paciente al finalizar su tratamiento activo de ortodoncia
 */
export async function crearPlanRetencion(
  datos: CrearPlanRetencionRequest
): Promise<PlanRetencion> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/pacientes/${datos.pacienteId}/ortodoncia/retencion`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          tratamientoId: datos.tratamientoId,
          fechaInicio: datos.fechaInicio,
          retenedores: datos.retenedores,
          notasGenerales: datos.notasGenerales,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al crear el plan de retención');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear plan de retención:', error);
    throw error;
  }
}

/**
 * Actualiza la información general de un plan de retención existente
 */
export async function actualizarPlanRetencion(
  planId: string,
  datos: ActualizarPlanRetencionRequest
): Promise<PlanRetencion> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ortodoncia/retencion/${planId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(datos),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al actualizar el plan de retención');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar plan de retención:', error);
    throw error;
  }
}

/**
 * Añade una nueva cita de seguimiento al plan de retención
 */
export async function agregarSeguimiento(
  datos: CrearSeguimientoRequest
): Promise<PlanRetencion> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ortodoncia/retencion/${datos.planId}/seguimientos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fechaCita: datos.fechaCita,
          observaciones: datos.observaciones,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al agregar seguimiento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al agregar seguimiento:', error);
    throw error;
  }
}

/**
 * Actualiza los detalles de una cita de seguimiento específica
 */
export async function actualizarSeguimiento(
  seguimientoId: string,
  datos: ActualizarSeguimientoRequest
): Promise<SeguimientoRetencion> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ortodoncia/seguimientos/${seguimientoId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(datos),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al actualizar seguimiento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar seguimiento:', error);
    throw error;
  }
}

/**
 * Sube una foto para un seguimiento de retención
 */
export async function subirFotoSeguimiento(
  seguimientoId: string,
  archivo: File
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('foto', archivo);

    const response = await fetch(
      `${API_BASE_URL}/ortodoncia/seguimientos/${seguimientoId}/fotos`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al subir foto');
    }

    const data = await response.json();
    return data.url; // URL de la foto subida
  } catch (error) {
    console.error('Error al subir foto:', error);
    throw error;
  }
}


