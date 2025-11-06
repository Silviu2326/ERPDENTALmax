// API para gestión de tratamientos de blanqueamiento dental
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface SesionBlanqueamiento {
  fecha: string;
  duracionMinutos: number;
  notasSesion?: string;
  sensibilidadReportada: boolean;
}

export interface FotoBlanqueamiento {
  _id?: string;
  url: string;
  tipo: 'Antes' | 'Después';
  fechaSubida: string;
}

export interface Blanqueamiento {
  _id?: string;
  paciente: string;
  profesional: string;
  fechaInicio: string;
  tipoBlanqueamiento: 'En Clínica' | 'En Casa' | 'Combinado';
  productoUtilizado: string;
  concentracion?: string;
  tonoInicial: string;
  tonoFinal?: string;
  consentimientoFirmado: boolean;
  notasGenerales?: string;
  sesiones: SesionBlanqueamiento[];
  fotos: FotoBlanqueamiento[];
  estado: 'En Proceso' | 'Completado' | 'Cancelado';
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearBlanqueamientoData {
  pacienteId: string;
  odontologoId: string;
  fechaInicio: string;
  tipoBlanqueamiento: 'En Clínica' | 'En Casa' | 'Combinado';
  productoUtilizado: string;
  concentracion?: string;
  tonoInicial: string;
  notasGenerales?: string;
}

export interface ActualizarBlanqueamientoData {
  tipoBlanqueamiento?: 'En Clínica' | 'En Casa' | 'Combinado';
  productoUtilizado?: string;
  concentracion?: string;
  tonoFinal?: string;
  consentimientoFirmado?: boolean;
  notasGenerales?: string;
  estado?: 'En Proceso' | 'Completado' | 'Cancelado';
}

export interface NuevaSesionData {
  fecha: string;
  duracionMinutos: number;
  notasSesion?: string;
  sensibilidadReportada: boolean;
}

/**
 * Obtiene el historial de todos los tratamientos de blanqueamiento para un paciente específico
 */
export async function obtenerBlanqueamientosPorPaciente(
  pacienteId: string
): Promise<Blanqueamiento[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/blanqueamientos/paciente/${pacienteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener tratamientos: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al obtener tratamientos de blanqueamiento:', error);
    throw error;
  }
}

/**
 * Crea un nuevo registro de tratamiento de blanqueamiento para un paciente
 */
export async function crearNuevoBlanqueamiento(
  datos: CrearBlanqueamientoData
): Promise<Blanqueamiento> {
  try {
    const response = await fetch(`${API_BASE_URL}/blanqueamientos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear tratamiento: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al crear tratamiento de blanqueamiento:', error);
    throw error;
  }
}

/**
 * Obtiene los detalles completos de un tratamiento de blanqueamiento específico
 */
export async function obtenerBlanqueamientoPorId(
  tratamientoId: string
): Promise<Blanqueamiento> {
  try {
    const response = await fetch(`${API_BASE_URL}/blanqueamientos/${tratamientoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener tratamiento: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al obtener tratamiento de blanqueamiento:', error);
    throw error;
  }
}

/**
 * Añade una nueva sesión de seguimiento a un tratamiento de blanqueamiento existente
 */
export async function agregarNuevaSesion(
  tratamientoId: string,
  datos: NuevaSesionData
): Promise<Blanqueamiento> {
  try {
    const response = await fetch(`${API_BASE_URL}/blanqueamientos/${tratamientoId}/sesion`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al agregar sesión: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al agregar sesión:', error);
    throw error;
  }
}

/**
 * Sube una o más fotos (antes/después) para un tratamiento
 */
export async function subirFotos(
  tratamientoId: string,
  fotos: File[],
  tipo: 'Antes' | 'Después'
): Promise<Blanqueamiento> {
  try {
    const formData = new FormData();
    fotos.forEach((foto) => {
      formData.append('fotos', foto);
    });
    formData.append('tipo', tipo);

    const response = await fetch(`${API_BASE_URL}/blanqueamientos/${tratamientoId}/fotos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al subir fotos: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al subir fotos:', error);
    throw error;
  }
}

/**
 * Actualiza datos generales del tratamiento de blanqueamiento
 */
export async function actualizarBlanqueamiento(
  tratamientoId: string,
  datos: ActualizarBlanqueamientoData
): Promise<Blanqueamiento> {
  try {
    const response = await fetch(`${API_BASE_URL}/blanqueamientos/${tratamientoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar tratamiento: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al actualizar tratamiento de blanqueamiento:', error);
    throw error;
  }
}


