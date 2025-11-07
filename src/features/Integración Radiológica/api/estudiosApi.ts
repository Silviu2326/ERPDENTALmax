// API para gestión de estudios radiológicos según especificaciones del módulo
// Vista de TAC y Ortopantomografías

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface EstudioRadiologico {
  _id: string;
  paciente: string;
  tipoEstudio: 'TAC' | 'Ortopantomografía' | 'Periapical' | 'Cefalometría';
  fechaEstudio: string;
  descripcion?: string;
  tecnicoAsignado?: string;
  notas?: string;
  storagePath: string;
  anotaciones?: { [key: string]: any };
  createdAt?: string;
  updatedAt?: string;
}

export interface DetalleEstudioCompleto {
  _id: string;
  paciente: string;
  tipoEstudio: string;
  fechaEstudio: string;
  descripcion?: string;
  tecnicoAsignado?: string;
  notas?: string;
  storagePath: string;
  urlDicom: string; // URL firmada y temporal para acceso al archivo DICOM
  anotaciones?: { [key: string]: any };
  createdAt?: string;
  updatedAt?: string;
}

export interface AnotacionesEstudio {
  texto?: string;
  mediciones?: Array<{
    id: string;
    tipo: 'distancia' | 'angulo' | 'area';
    puntos: Array<{ x: number; y: number }>;
    valor?: number;
    unidad?: string;
  }>;
  marcadores?: Array<{
    id: string;
    x: number;
    y: number;
    texto?: string;
  }>;
  dibujos?: Array<{
    id: string;
    tipo: 'linea' | 'flecha' | 'rectangulo' | 'circulo';
    puntos: Array<{ x: number; y: number }>;
    color?: string;
  }>;
  [key: string]: any;
}

/**
 * GET /api/radiologia/estudios/paciente/:pacienteId
 * Obtiene una lista de todos los estudios radiológicos (metadatos) asociados a un ID de paciente específico.
 * Se usa para poblar la galería de estudios.
 */
export async function obtenerEstudiosPorPacienteId(
  pacienteId: string
): Promise<EstudioRadiologico[]> {
  const response = await fetch(`${API_BASE_URL}/radiologia/estudios/paciente/${pacienteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener estudios' }));
    throw new Error(error.message || 'Error al obtener estudios del paciente');
  }

  return response.json();
}

/**
 * GET /api/radiologia/estudios/:estudioId
 * Obtiene los detalles completos de un estudio radiológico específico,
 * incluyendo un enlace seguro y de corta duración (signed URL) para acceder al archivo DICOM.
 */
export async function obtenerEstudioPorId(
  estudioId: string
): Promise<DetalleEstudioCompleto> {
  const response = await fetch(`${API_BASE_URL}/radiologia/estudios/${estudioId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener estudio' }));
    throw new Error(error.message || 'Error al obtener detalle del estudio');
  }

  return response.json();
}

/**
 * POST /api/radiologia/estudios/:estudioId/anotaciones
 * Guarda las anotaciones (texto, mediciones, dibujos) realizadas por el odontólogo sobre un estudio.
 * Las anotaciones se almacenan como un objeto JSON.
 */
export async function guardarAnotacionesEstudio(
  estudioId: string,
  anotaciones: AnotacionesEstudio
): Promise<{ success: boolean; anotaciones: AnotacionesEstudio }> {
  const response = await fetch(`${API_BASE_URL}/radiologia/estudios/${estudioId}/anotaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ anotaciones }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al guardar anotaciones' }));
    throw new Error(error.message || 'Error al guardar anotaciones del estudio');
  }

  return response.json();
}



