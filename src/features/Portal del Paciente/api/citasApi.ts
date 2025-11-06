// API para gestión de citas del Portal del Paciente
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface CitaPortal {
  _id: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: 'programada' | 'confirmada' | 'cancelada' | 'completada' | 'ausente';
  tratamiento?: {
    _id: string;
    nombre: string;
  };
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  clinica: {
    _id: string;
    nombre: string;
  };
  notasPaciente?: string;
}

export interface CitaPasada {
  _id: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: 'completada' | 'cancelada' | 'ausente';
  tratamiento?: {
    _id: string;
    nombre: string;
  };
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  clinica: {
    _id: string;
    nombre: string;
  };
  notasPaciente?: string;
}

export interface CitasPasadasResponse {
  citas: CitaPasada[];
  paginacion: {
    paginaActual: number;
    totalPaginas: number;
    totalCitas: number;
    limite: number;
  };
}

/**
 * Obtiene las citas próximas del paciente autenticado
 */
export async function obtenerCitasProximas(): Promise<CitaPortal[]> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/portal/citas/proximas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener las citas próximas' }));
    throw new Error(error.message || 'Error al obtener las citas próximas');
  }

  return response.json();
}

/**
 * Obtiene las citas pasadas del paciente autenticado con paginación
 */
export async function obtenerCitasPasadas(page: number = 1, limit: number = 10): Promise<CitasPasadasResponse> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/portal/citas/pasadas?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener las citas pasadas' }));
    throw new Error(error.message || 'Error al obtener las citas pasadas');
  }

  return response.json();
}

/**
 * Solicita la cancelación de una cita próxima
 */
export async function solicitarCancelacionCita(citaId: string): Promise<CitaPortal> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/portal/citas/${citaId}/cancelar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al cancelar la cita' }));
    throw new Error(error.message || 'Error al cancelar la cita');
  }

  return response.json();
}


