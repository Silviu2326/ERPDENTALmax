// API para gestión de partes de avería y correctivos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Equipo {
  _id: string;
  nombre: string;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
}

export interface Usuario {
  _id: string;
  nombre: string;
  apellidos?: string;
  email?: string;
}

export interface Clinica {
  _id: string;
  nombre: string;
}

export interface AccionCorrectiva {
  fecha: string;
  descripcionAccion: string;
  realizadoPor: string;
  costeMateriales?: number;
  horasTrabajo?: number;
  _id?: string;
}

export type EstadoParteAveria = 'Abierto' | 'En Progreso' | 'Resuelto' | 'Cerrado';
export type PrioridadParteAveria = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export interface ParteAveria {
  _id?: string;
  equipoId: string;
  equipo?: Equipo;
  clinicaId: string;
  clinica?: Clinica;
  descripcionProblema: string;
  fechaAveria: string;
  reportadoPor: string;
  reportadoPorUsuario?: Usuario;
  estado: EstadoParteAveria;
  prioridad: PrioridadParteAveria;
  tecnicoAsignado?: string;
  costeTotal?: number;
  fechaResolucion?: string;
  historialCorrectivos: AccionCorrectiva[];
  notas?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FiltrosPartesAveria {
  page?: number;
  limit?: number;
  clinicaId?: string;
  estado?: EstadoParteAveria;
  prioridad?: PrioridadParteAveria;
  fechaInicio?: string;
  fechaFin?: string;
  equipoId?: string;
  search?: string;
}

export interface NuevoParteAveria {
  equipoId: string;
  clinicaId: string;
  descripcionProblema: string;
  reportadoPor: string;
  prioridad: PrioridadParteAveria;
  notas?: string;
}

export interface ActualizarParteAveria {
  estado?: EstadoParteAveria;
  prioridad?: PrioridadParteAveria;
  tecnicoAsignado?: string;
  notas?: string;
}

export interface NuevaAccionCorrectiva {
  descripcionAccion: string;
  costeMateriales?: number;
  horasTrabajo?: number;
  realizadoPor: string;
}

export interface RespuestaPaginada<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Obtener listado paginado de partes de avería
export async function obtenerPartesAveria(
  filtros: FiltrosPartesAveria = {}
): Promise<RespuestaPaginada<ParteAveria>> {
  const params = new URLSearchParams();

  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.clinicaId) params.append('clinicaId', filtros.clinicaId);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.prioridad) params.append('prioridad', filtros.prioridad);
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
  if (filtros.equipoId) params.append('equipoId', filtros.equipoId);
  if (filtros.search) params.append('search', filtros.search);

  const response = await fetch(`${API_BASE_URL}/partes-averia?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los partes de avería');
  }

  return response.json();
}

// Crear nuevo parte de avería
export async function crearParteAveria(
  parte: NuevoParteAveria
): Promise<ParteAveria> {
  const response = await fetch(`${API_BASE_URL}/partes-averia`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(parte),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el parte de avería' }));
    throw new Error(error.message || 'Error al crear el parte de avería');
  }

  return response.json();
}

// Obtener detalle de un parte de avería
export async function obtenerParteAveriaPorId(id: string): Promise<ParteAveria> {
  const response = await fetch(`${API_BASE_URL}/partes-averia/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el parte de avería');
  }

  return response.json();
}

// Actualizar parte de avería
export async function actualizarParteAveria(
  id: string,
  actualizacion: ActualizarParteAveria
): Promise<ParteAveria> {
  const response = await fetch(`${API_BASE_URL}/partes-averia/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(actualizacion),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el parte de avería' }));
    throw new Error(error.message || 'Error al actualizar el parte de avería');
  }

  return response.json();
}

// Agregar acción correctiva a un parte de avería
export async function agregarAccionCorrectiva(
  id: string,
  correctivo: NuevaAccionCorrectiva
): Promise<ParteAveria> {
  const response = await fetch(`${API_BASE_URL}/partes-averia/${id}/correctivos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(correctivo),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al agregar la acción correctiva' }));
    throw new Error(error.message || 'Error al agregar la acción correctiva');
  }

  return response.json();
}

// Eliminar (soft delete) parte de avería
export async function eliminarParteAveria(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/partes-averia/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el parte de avería');
  }
}

// Obtener equipos disponibles (para selector)
export async function obtenerEquiposDisponibles(clinicaId?: string): Promise<Equipo[]> {
  const params = new URLSearchParams();
  if (clinicaId) params.append('clinicaId', clinicaId);

  const response = await fetch(`${API_BASE_URL}/equipos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los equipos');
  }

  return response.json();
}


