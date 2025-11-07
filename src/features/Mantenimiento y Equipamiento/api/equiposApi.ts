// API para gestión de equipos clínicos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface EquipoClinico {
  _id?: string;
  nombre: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  fechaAdquisicion: string;
  costo: number;
  proveedor?: {
    _id: string;
    nombre: string;
  };
  ubicacion: {
    sede: {
      _id: string;
      nombre: string;
    };
    gabinete?: string;
  };
  estado: 'Operativo' | 'En Mantenimiento' | 'Fuera de Servicio' | 'De Baja';
  fechaUltimoMantenimiento?: string;
  fechaProximoMantenimiento?: string;
  garantiaHasta?: string;
  documentos?: Array<{
    nombre: string;
    url: string;
  }>;
  historialMantenimiento?: string[];
  notas?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FiltrosEquipos {
  page?: number;
  limit?: number;
  sedeId?: string;
  estado?: string;
  query?: string;
}

export interface PaginatedResponse<T> {
  equipos: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NuevoEquipo {
  nombre: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  fechaAdquisicion: string;
  costo: number;
  proveedor?: string;
  ubicacion: {
    sede: string;
    gabinete?: string;
  };
  estado: 'Operativo' | 'En Mantenimiento' | 'Fuera de Servicio' | 'De Baja';
  fechaUltimoMantenimiento?: string;
  fechaProximoMantenimiento?: string;
  garantiaHasta?: string;
  documentos?: Array<{
    nombre: string;
    url: string;
  }>;
  notas?: string;
}

// Obtener lista paginada de equipos con filtros
export async function obtenerEquipos(filtros: FiltrosEquipos = {}): Promise<PaginatedResponse<EquipoClinico>> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.sedeId) params.append('sedeId', filtros.sedeId);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.query) params.append('query', filtros.query);

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

// Obtener detalle de un equipo por ID
export async function obtenerEquipoPorId(id: string): Promise<EquipoClinico> {
  const response = await fetch(`${API_BASE_URL}/equipos/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el equipo');
  }

  return response.json();
}

// Crear un nuevo equipo
export async function crearEquipo(equipo: NuevoEquipo): Promise<EquipoClinico> {
  const response = await fetch(`${API_BASE_URL}/equipos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(equipo),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el equipo');
  }

  return response.json();
}

// Actualizar un equipo existente
export async function actualizarEquipo(id: string, equipo: Partial<NuevoEquipo>): Promise<EquipoClinico> {
  const response = await fetch(`${API_BASE_URL}/equipos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(equipo),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el equipo');
  }

  return response.json();
}

// Eliminar un equipo (borrado lógico)
export async function eliminarEquipo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/equipos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar el equipo');
  }
}



