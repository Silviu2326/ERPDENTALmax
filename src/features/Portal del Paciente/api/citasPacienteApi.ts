// API para gestión de citas del Portal del Paciente
// Endpoints: /api/portal/citas y /api/portal/disponibilidad
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface CitaPaciente {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  doctor: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  tratamiento?: {
    _id: string;
    nombre: string;
  };
  sucursal: {
    _id: string;
    nombre: string;
  };
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  estado: 'Programada' | 'Confirmada' | 'CanceladaPorPaciente' | 'CanceladaPorClinica' | 'Completada' | 'NoAsistio';
  notas_paciente?: string;
  creado_por_rol: 'Paciente' | 'Recepcionista' | 'Otro';
}

export interface DisponibilidadHorario {
  start: string; // ISO Date
  end: string; // ISO Date
}

export interface FiltrosDisponibilidad {
  doctor_id?: string;
  tratamiento_id: string;
  fecha_inicio: string; // ISO Date
  fecha_fin: string; // ISO Date
}

export interface NuevaCitaPaciente {
  doctor_id: string;
  tratamiento_id: string;
  fecha_hora_inicio: string; // ISO Date
  notas_paciente?: string;
}

export interface ModificarCitaPaciente {
  fecha_hora_inicio: string; // ISO Date
  notas_paciente?: string;
}

/**
 * Obtiene todas las citas del paciente autenticado
 * GET /api/portal/citas
 */
export async function obtenerMisCitas(estado?: string): Promise<CitaPaciente[]> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const params = new URLSearchParams();
  if (estado) {
    params.append('estado', estado);
  }

  const url = `${API_BASE_URL}/portal/citas${params.toString() ? `?${params.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener las citas' }));
    throw new Error(error.message || 'Error al obtener las citas');
  }

  return response.json();
}

/**
 * Consulta los horarios disponibles para una nueva cita
 * GET /api/portal/disponibilidad
 */
export async function consultarDisponibilidad(filtros: FiltrosDisponibilidad): Promise<DisponibilidadHorario[]> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const params = new URLSearchParams({
    tratamiento_id: filtros.tratamiento_id,
    fecha_inicio: filtros.fecha_inicio,
    fecha_fin: filtros.fecha_fin,
  });

  if (filtros.doctor_id) {
    params.append('doctor_id', filtros.doctor_id);
  }

  const response = await fetch(`${API_BASE_URL}/portal/disponibilidad?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al consultar la disponibilidad' }));
    throw new Error(error.message || 'Error al consultar la disponibilidad');
  }

  return response.json();
}

/**
 * Crea una nueva cita para el paciente autenticado
 * POST /api/portal/citas
 */
export async function solicitarNuevaCita(datos: NuevaCitaPaciente): Promise<CitaPaciente> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/portal/citas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al solicitar la cita' }));
    throw new Error(error.message || 'Error al solicitar la cita');
  }

  return response.json();
}

/**
 * Modifica una cita existente del paciente autenticado
 * PUT /api/portal/citas/:id
 */
export async function modificarMiCita(citaId: string, datos: ModificarCitaPaciente): Promise<CitaPaciente> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/portal/citas/${citaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al modificar la cita' }));
    throw new Error(error.message || 'Error al modificar la cita');
  }

  return response.json();
}

/**
 * Cancela una cita programada del paciente autenticado
 * DELETE /api/portal/citas/:id
 */
export async function cancelarMiCita(citaId: string): Promise<{ message: string }> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/portal/citas/${citaId}`, {
    method: 'DELETE',
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



