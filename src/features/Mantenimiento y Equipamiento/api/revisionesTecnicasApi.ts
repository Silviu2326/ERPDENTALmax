// API para gestión de revisiones técnicas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface RevisionTecnica {
  _id?: string;
  equipo: {
    _id: string;
    nombre: string;
    marca?: string;
    modelo?: string;
    numeroSerie?: string;
  };
  sede: {
    _id: string;
    nombre: string;
  };
  fechaProgramada: string;
  fechaRealizacion?: string;
  estado: 'Programada' | 'Completada' | 'Retrasada' | 'Cancelada';
  tecnicoResponsable: string;
  descripcionTrabajo?: string;
  notas?: string;
  costo?: number;
  documentosAdjuntos?: Array<{
    nombre: string;
    url: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface FiltrosRevisiones {
  startDate?: string;
  endDate?: string;
  sedeId?: string;
  equipoId?: string;
  estado?: 'Programada' | 'Completada' | 'Retrasada' | 'Cancelada';
}

export interface NuevaRevisionTecnica {
  equipoId: string;
  sedeId: string;
  fechaProgramada: string;
  tecnicoResponsable: string;
  descripcionTrabajo?: string;
  notas?: string;
  costo?: number;
}

export interface ActualizarRevisionTecnica {
  fechaProgramada?: string;
  fechaRealizacion?: string;
  estado?: 'Programada' | 'Completada' | 'Retrasada' | 'Cancelada';
  tecnicoResponsable?: string;
  descripcionTrabajo?: string;
  notas?: string;
  costo?: number;
  documentosAdjuntos?: Array<{
    nombre: string;
    url: string;
  }>;
}

// Obtener lista de revisiones técnicas con filtros
export async function obtenerRevisionesTecnicas(filtros: FiltrosRevisiones = {}): Promise<RevisionTecnica[]> {
  const params = new URLSearchParams();
  
  if (filtros.startDate) params.append('startDate', filtros.startDate);
  if (filtros.endDate) params.append('endDate', filtros.endDate);
  if (filtros.sedeId) params.append('sedeId', filtros.sedeId);
  if (filtros.equipoId) params.append('equipoId', filtros.equipoId);
  if (filtros.estado) params.append('estado', filtros.estado);

  const response = await fetch(`${API_BASE_URL}/revisiones-tecnicas?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las revisiones técnicas');
  }

  return response.json();
}

// Obtener detalle de una revisión técnica por ID
export async function obtenerRevisionTecnicaPorId(id: string): Promise<RevisionTecnica> {
  const response = await fetch(`${API_BASE_URL}/revisiones-tecnicas/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la revisión técnica');
  }

  return response.json();
}

// Crear una nueva revisión técnica
export async function crearRevisionTecnica(revision: NuevaRevisionTecnica): Promise<RevisionTecnica> {
  const response = await fetch(`${API_BASE_URL}/revisiones-tecnicas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(revision),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la revisión técnica');
  }

  return response.json();
}

// Actualizar una revisión técnica existente
export async function actualizarRevisionTecnica(
  id: string,
  revision: ActualizarRevisionTecnica
): Promise<RevisionTecnica> {
  const response = await fetch(`${API_BASE_URL}/revisiones-tecnicas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(revision),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la revisión técnica');
  }

  return response.json();
}

// Eliminar una revisión técnica
export async function eliminarRevisionTecnica(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/revisiones-tecnicas/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar la revisión técnica');
  }
}



