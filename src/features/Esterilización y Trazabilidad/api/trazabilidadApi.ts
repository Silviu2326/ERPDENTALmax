// API para gestión de trazabilidad y asignación de bandejas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface PacienteActivo {
  _id: string;
  nombre: string;
  apellidos: string;
  dni?: string;
  telefono?: string;
}

export interface BandejaEsteril {
  _id: string;
  codigoUnico: string;
  nombre: string;
  cicloEsterilizacionId?: string;
  fechaEsterilizacion: string;
  fechaVencimiento: string;
  estado: 'Disponible' | 'En uso' | 'Contaminada' | 'En proceso';
  createdAt?: string;
}

export interface AsignacionBandeja {
  _id: string;
  pacienteId: string;
  paciente: PacienteActivo;
  bandejaId: string;
  bandeja: BandejaEsteril;
  citaId?: string;
  cita?: {
    _id: string;
    fecha_hora_inicio: string;
    tratamiento?: {
      nombre: string;
    };
  };
  usuarioAsignaId: string;
  usuarioAsigna?: {
    _id: string;
    nombre: string;
  };
  fechaAsignacion: string;
  createdAt: string;
}

export interface NuevaAsignacion {
  pacienteId: string;
  bandejaId: string;
  citaId?: string;
}

/**
 * Obtiene una lista de pacientes que tienen una cita 'En curso' o 'En sala de espera'
 */
export async function obtenerPacientesActivos(): Promise<PacienteActivo[]> {
  const response = await fetch(
    `${API_BASE_URL}/pacientes/activos?estado=en-curso,en-espera`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener pacientes activos' }));
    throw new Error(errorData.message || 'Error al obtener pacientes activos');
  }

  return response.json();
}

/**
 * Busca una bandeja por su código único (obtenido del QR)
 * Valida su estado ('Disponible') y fechas de esterilización/vencimiento
 */
export async function buscarBandejaPorCodigo(codigoUnico: string): Promise<BandejaEsteril> {
  const response = await fetch(
    `${API_BASE_URL}/esterilizacion/bandejas/codigo/${encodeURIComponent(codigoUnico)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Bandeja no encontrada');
    }
    if (response.status === 409) {
      throw new Error('La bandeja no está disponible para asignación');
    }
    const errorData = await response.json().catch(() => ({ message: 'Error al buscar la bandeja' }));
    throw new Error(errorData.message || 'Error al buscar la bandeja');
  }

  return response.json();
}

/**
 * Crea el registro de asignación. Vincula una bandeja a un paciente, una cita y el usuario que realiza la operación.
 * Cambia el estado de la bandeja a 'En uso'.
 */
export async function crearAsignacion(datos: NuevaAsignacion): Promise<AsignacionBandeja> {
  const response = await fetch(
    `${API_BASE_URL}/trazabilidad/asignaciones`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(datos),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al crear la asignación' }));
    throw new Error(errorData.message || 'Error al crear la asignación');
  }

  return response.json();
}

/**
 * Obtiene un listado de las últimas asignaciones realizadas en la clínica
 */
export async function obtenerAsignacionesRecientes(limit: number = 10): Promise<AsignacionBandeja[]> {
  const response = await fetch(
    `${API_BASE_URL}/trazabilidad/asignaciones/recientes?limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener asignaciones recientes' }));
    throw new Error(errorData.message || 'Error al obtener asignaciones recientes');
  }

  return response.json();
}


