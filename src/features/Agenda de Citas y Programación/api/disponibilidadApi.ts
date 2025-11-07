// API para gestión de disponibilidad de profesionales
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface HorarioRecurrente {
  _id?: string;
  profesional: string;
  sede: string;
  diaSemana: number; // 0=Domingo, 6=Sábado
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  activo: boolean;
}

export interface ExcepcionDisponibilidad {
  _id?: string;
  profesional: string;
  sede?: string;
  fechaInicio: string; // ISO Date
  fechaFin: string; // ISO Date
  motivo: string;
  diaCompleto: boolean;
  creadoPor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DisponibilidadCompleta {
  horariosRecurrentes: HorarioRecurrente[];
  excepciones: ExcepcionDisponibilidad[];
}

export interface CrearHorarioRecurrente {
  profesionalId: string;
  sedeId: string;
  horarios: Array<{
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
  }>;
}

export interface CrearExcepcion {
  profesionalId: string;
  sedeId?: string;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
  diaCompleto: boolean;
}

// Obtener disponibilidad completa de un profesional
export async function obtenerDisponibilidadCompleta(
  profesionalId: string,
  sedeId?: string,
  fechaInicio?: string,
  fechaFin?: string
): Promise<DisponibilidadCompleta> {
  const params = new URLSearchParams();
  if (sedeId) {
    params.append('sedeId', sedeId);
  }
  if (fechaInicio) {
    params.append('fechaInicio', fechaInicio);
  }
  if (fechaFin) {
    params.append('fechaFin', fechaFin);
  }

  const url = `${API_BASE_URL}/disponibilidad/profesional/${profesionalId}${params.toString() ? `?${params.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la disponibilidad del profesional');
  }

  return response.json();
}

// Crear o actualizar horarios recurrentes
export async function guardarHorarioRecurrente(
  datos: CrearHorarioRecurrente
): Promise<{ profesional: any; horarios: HorarioRecurrente[] }> {
  const response = await fetch(`${API_BASE_URL}/disponibilidad/horario-recurrente`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al guardar el horario recurrente');
  }

  return response.json();
}

// Crear una nueva excepción
export async function crearExcepcion(
  datos: CrearExcepcion
): Promise<ExcepcionDisponibilidad> {
  const response = await fetch(`${API_BASE_URL}/disponibilidad/excepcion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la excepción');
  }

  return response.json();
}

// Eliminar una excepción
export async function eliminarExcepcion(excepcionId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/disponibilidad/excepcion/${excepcionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la excepción');
  }
}

// Actualizar una excepción existente
export async function actualizarExcepcion(
  excepcionId: string,
  datos: Partial<CrearExcepcion>
): Promise<ExcepcionDisponibilidad> {
  const response = await fetch(`${API_BASE_URL}/disponibilidad/excepcion/${excepcionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la excepción');
  }

  return response.json();
}



