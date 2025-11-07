// API para la Agenda Mobile (Vista Recepción)
// Portal de Cita Online y Móvil

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Tipos de datos
export interface CitaAgenda {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    telefono?: string;
    email?: string;
  };
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
    especialidad?: string;
  };
  sucursal: {
    _id: string;
    nombre: string;
  };
  fechaHoraInicio: string; // ISO Date
  fechaHoraFin: string; // ISO Date
  estado: 'Pendiente' | 'Confirmado' | 'En Sala de Espera' | 'Atendido' | 'Cancelado' | 'No se presentó';
  tratamiento?: {
    _id: string;
    nombre: string;
  };
  notasRecepcion?: string;
}

export interface ProfesionalAgenda {
  _id: string;
  nombre: string;
  apellidos: string;
  nombreCompleto: string;
  especialidad?: string;
  colorAgenda?: string;
}

export interface AgendaDiariaPorSucursal {
  [profesionalId: string]: CitaAgenda[];
}

// Obtener agenda diaria agrupada por profesional
export async function obtenerAgendaDiariaPorSucursal(
  fecha: string, // YYYY-MM-DD
  idSucursal: string
): Promise<AgendaDiariaPorSucursal> {
  const params = new URLSearchParams({
    fecha,
    idSucursal,
  });

  const response = await fetch(`${API_BASE_URL}/citas/agenda-diaria?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener la agenda diaria');
  }

  return response.json();
}

// Actualizar estado de una cita
export async function actualizarEstadoCitaRecepcion(
  idCita: string,
  estado: CitaAgenda['estado']
): Promise<CitaAgenda> {
  const response = await fetch(`${API_BASE_URL}/citas/${idCita}/estado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ estado }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el estado de la cita');
  }

  return response.json();
}

// Obtener profesionales por sucursal
export async function obtenerProfesionalesPorSucursal(
  idSucursal: string
): Promise<ProfesionalAgenda[]> {
  const response = await fetch(`${API_BASE_URL}/profesionales/sucursal/${idSucursal}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los profesionales de la sucursal');
  }

  return response.json();
}



