// API para gestión de publicaciones en redes sociales
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export type EstadoPublicacion = 'borrador' | 'programado' | 'publicado' | 'error' | 'archivado';
export type PlataformaSocial = 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok';

export interface PublicacionSocial {
  _id?: string;
  contenido: string;
  mediaUrls: string[];
  plataformas: PlataformaSocial[];
  estado: EstadoPublicacion;
  fechaProgramacion?: string;
  fechaPublicacionReal?: string;
  creadoPor?: {
    _id: string;
    nombre: string;
  };
  metricas?: {
    likes: number;
    comentarios: number;
    compartidos: number;
  };
  idPublicacionPlataforma?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface FiltrosPublicaciones {
  fechaInicio?: string;
  fechaFin?: string;
  estado?: EstadoPublicacion;
  plataforma?: PlataformaSocial;
}

export interface CrearPublicacionData {
  contenido: string;
  mediaUrls: string[];
  plataformas: PlataformaSocial[];
  estado: EstadoPublicacion;
  fechaProgramacion?: string;
}

export interface ActualizarPublicacionData {
  contenido?: string;
  mediaUrls?: string[];
  plataformas?: PlataformaSocial[];
  estado?: EstadoPublicacion;
  fechaProgramacion?: string;
}

// GET /api/marketing/publicaciones
export async function obtenerPublicaciones(
  filtros: FiltrosPublicaciones = {}
): Promise<PublicacionSocial[]> {
  const params = new URLSearchParams();

  if (filtros.fechaInicio) {
    params.append('fechaInicio', filtros.fechaInicio);
  }
  if (filtros.fechaFin) {
    params.append('fechaFin', filtros.fechaFin);
  }
  if (filtros.estado) {
    params.append('estado', filtros.estado);
  }
  if (filtros.plataforma) {
    params.append('plataforma', filtros.plataforma);
  }

  const response = await fetch(`${API_BASE_URL}/marketing/publicaciones?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener las publicaciones' }));
    throw new Error(error.message || 'Error al obtener las publicaciones');
  }

  return response.json();
}

// POST /api/marketing/publicaciones
export async function crearPublicacion(
  datos: CrearPublicacionData
): Promise<PublicacionSocial> {
  const response = await fetch(`${API_BASE_URL}/marketing/publicaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la publicación' }));
    throw new Error(error.message || 'Error al crear la publicación');
  }

  return response.json();
}

// GET /api/marketing/publicaciones/:id
export async function obtenerPublicacionPorId(id: string): Promise<PublicacionSocial> {
  const response = await fetch(`${API_BASE_URL}/marketing/publicaciones/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener la publicación' }));
    throw new Error(error.message || 'Error al obtener la publicación');
  }

  return response.json();
}

// PUT /api/marketing/publicaciones/:id
export async function actualizarPublicacion(
  id: string,
  datos: ActualizarPublicacionData
): Promise<PublicacionSocial> {
  const response = await fetch(`${API_BASE_URL}/marketing/publicaciones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar la publicación' }));
    throw new Error(error.message || 'Error al actualizar la publicación');
  }

  return response.json();
}

// DELETE /api/marketing/publicaciones/:id
export async function eliminarPublicacion(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/marketing/publicaciones/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al eliminar la publicación' }));
    throw new Error(error.message || 'Error al eliminar la publicación');
  }
}


