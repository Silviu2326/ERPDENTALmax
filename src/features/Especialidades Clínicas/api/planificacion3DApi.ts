// API para gestión de planificaciones 3D de implantología
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Posicion3D {
  x: number;
  y: number;
  z: number;
}

export interface Rotacion3D {
  x: number;
  y: number;
  z: number;
}

export interface ImplanteEnPlanificacion {
  implanteVirtualId: string;
  posicion: Posicion3D;
  rotacion: Rotacion3D;
  observaciones?: string;
}

export interface Medicion {
  puntoInicio: Posicion3D;
  puntoFin: Posicion3D;
  distancia: number;
  unidad: 'mm';
  descripcion?: string;
}

export interface TrazadoNervio {
  puntos: Posicion3D[];
  nombre: string;
  color?: string;
}

export interface DatosPlanificacion {
  implantes: ImplanteEnPlanificacion[];
  mediciones: Medicion[];
  trazadoNervios: TrazadoNervio[];
  notas?: string;
}

export interface PlanificacionImplantologia3D {
  _id?: string;
  pacienteId: string;
  creadoPor: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  descripcion?: string;
  estadoProcesamiento: 'pendiente' | 'procesando' | 'completado' | 'error';
  archivosDicomPaths?: string[];
  modeloProcesadoPath?: string;
  datosPlanificacion?: DatosPlanificacion;
}

export interface ImplanteVirtual {
  _id: string;
  marca: string;
  sistema: string;
  modelo: string;
  longitud: number;
  diametro: number;
  tipoConexion: string;
  archivoModelo3DPath?: string;
}

export interface CrearPlanificacionRequest {
  pacienteId: string;
  descripcion?: string;
  archivosDicom: File[];
}

/**
 * Crea una nueva planificación 3D y sube los archivos DICOM
 */
export async function crearPlanificacion(
  pacienteId: string,
  descripcion: string,
  archivosDicom: File[]
): Promise<PlanificacionImplantologia3D> {
  const formData = new FormData();
  formData.append('descripcion', descripcion || '');
  archivosDicom.forEach((archivo) => {
    formData.append('archivosDicom', archivo);
  });

  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/planificaciones-3d`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error al crear planificación: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Obtiene todas las planificaciones 3D de un paciente
 */
export async function obtenerPlanificacionesPorPaciente(
  pacienteId: string
): Promise<PlanificacionImplantologia3D[]> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/planificaciones-3d`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener planificaciones: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Obtiene los detalles completos de una planificación 3D específica
 */
export async function obtenerPlanificacionPorId(
  planId: string
): Promise<PlanificacionImplantologia3D> {
  const response = await fetch(`${API_BASE_URL}/planificaciones-3d/${planId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Planificación no encontrada');
    }
    throw new Error(`Error al obtener planificación: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Actualiza una planificación 3D con los datos de planificación (implantes, mediciones, etc.)
 */
export async function actualizarPlanificacion(
  planId: string,
  datosPlanificacion: DatosPlanificacion
): Promise<PlanificacionImplantologia3D> {
  const response = await fetch(`${API_BASE_URL}/planificaciones-3d/${planId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ datosPlanificacion }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error al actualizar planificación: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Obtiene la lista de implantes virtuales disponibles en la biblioteca
 */
export async function obtenerImplantesVirtuales(
  filtros?: { marca?: string; diametro?: number }
): Promise<ImplanteVirtual[]> {
  const queryParams = new URLSearchParams();
  if (filtros?.marca) {
    queryParams.append('marca', filtros.marca);
  }
  if (filtros?.diametro) {
    queryParams.append('diametro', filtros.diametro.toString());
  }

  const url = `${API_BASE_URL}/biblioteca/implantes-virtuales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener implantes virtuales: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}


