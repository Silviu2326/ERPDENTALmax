// API para gestión de imágenes clínicas del Portal del Paciente
// Endpoints: /api/portal/pacientes/me/imagenes
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export type TipoImagen = 'RX_PERIAPICAL' | 'RX_BITEWING' | 'RX_PANORAMICA' | 'FOTO_INTRAORAL' | 'FOTO_EXTRAORAL' | 'TOMOGRAFIA' | 'OTRO';

export interface ImagenClinica {
  id: string;
  nombre: string;
  tipo: TipoImagen;
  fecha_captura: string; // ISO Date
  descripcion?: string;
  url_thumbnail: string;
  url_archivo?: string;
  nombre_archivo?: string;
}

export interface FiltrosImagenes {
  page?: number;
  limit?: number;
  tipo?: TipoImagen;
  fechaDesde?: string; // ISO Date
  fechaHasta?: string; // ISO Date
}

export interface PaginatedImagenesResponse {
  data: ImagenClinica[];
  total: number;
  pages: number;
  page: number;
  limit: number;
}

/**
 * Obtiene una lista paginada de imágenes del paciente autenticado
 * GET /api/portal/pacientes/me/imagenes
 */
export async function obtenerMisImagenes(filtros: FiltrosImagenes = {}): Promise<PaginatedImagenesResponse> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const params = new URLSearchParams();
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.tipo) params.append('tipo', filtros.tipo);
  if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
  if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);

  const url = `${API_BASE_URL}/portal/pacientes/me/imagenes${params.toString() ? `?${params.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener las imágenes' }));
    throw new Error(error.message || 'Error al obtener las imágenes');
  }

  return response.json();
}

/**
 * Descarga una imagen específica del paciente autenticado
 * GET /api/portal/pacientes/me/imagenes/:id/descargar
 */
export async function descargarMiImagen(imagenId: string): Promise<Blob> {
  const token = localStorage.getItem('patientToken');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/portal/pacientes/me/imagenes/${imagenId}/descargar`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al descargar la imagen' }));
    throw new Error(error.message || 'Error al descargar la imagen');
  }

  return response.blob();
}

/**
 * Obtiene la URL de una imagen para visualización
 * Esta función construye la URL para acceder a la imagen a través del endpoint de descarga
 * Nota: El token se envía en los headers, no en la URL por seguridad
 */
export function obtenerUrlImagen(imagenId: string): string {
  const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';
  return `${API_BASE_URL}/portal/pacientes/me/imagenes/${imagenId}/descargar`;
}

