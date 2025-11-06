// API para la Agenda Mobile (Vista Profesional)
// Portal de Cita Online y Móvil

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Tipos de datos
export interface CitaProfesional {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    telefono?: string;
    email?: string;
    alertasMedicas?: string;
  };
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
    colorAgenda?: string;
  };
  tratamiento: {
    _id: string;
    nombre: string;
  };
  fechaHoraInicio: string; // ISO Date
  fechaHoraFin: string; // ISO Date
  estado: 'Pendiente' | 'Confirmada' | 'Paciente en espera' | 'En box' | 'Finalizada' | 'Cancelada';
  notas?: string;
  clinica: {
    _id: string;
    nombre: string;
  };
}

export interface DetallesCitaMovil extends CitaProfesional {
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    email?: string;
    alertasMedicas?: string;
  };
  notasImportantes?: string;
}

export interface Profesional {
  _id: string;
  nombre: string;
  apellidos: string;
  nombreCompleto: string;
  especialidad?: string;
  colorAgenda?: string;
}

export interface FiltrosAgendaProfesional {
  profesionalId?: string;
  fechaInicio: string; // ISO Date
  fechaFin: string; // ISO Date
}

// Obtener agenda de profesionales
export async function obtenerAgendaProfesional(
  filtros: FiltrosAgendaProfesional
): Promise<CitaProfesional[]> {
  const params = new URLSearchParams({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  if (filtros.profesionalId) {
    params.append('profesionalId', filtros.profesionalId);
  }

  const response = await fetch(`${API_BASE_URL}/agenda/profesional?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener la agenda del profesional');
  }

  return response.json();
}

// Obtener detalles de una cita para móvil
export async function obtenerDetallesCitaMovil(citaId: string): Promise<DetallesCitaMovil> {
  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/detalles-movil`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los detalles de la cita');
  }

  return response.json();
}

// Actualizar estado de una cita
export async function actualizarEstadoCita(
  citaId: string,
  estado: CitaProfesional['estado']
): Promise<CitaProfesional> {
  const response = await fetch(`${API_BASE_URL}/citas/${citaId}/estado`, {
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

// Obtener profesionales activos
export async function obtenerProfesionalesActivos(): Promise<Profesional[]> {
  const response = await fetch(`${API_BASE_URL}/profesionales/activos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los profesionales activos');
  }

  return response.json();
}

