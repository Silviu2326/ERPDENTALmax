// API para gestión de registros postoperatorios de cirugía oral
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface MedicacionPrescrita {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
}

export interface SeguimientoPostoperatorio {
  _id?: string;
  fecha: Date | string;
  notasEvolucion: string;
  profesional: {
    _id: string;
    nombre: string;
    apellidos?: string;
  };
  adjuntos: string[];
}

export interface Postoperatorio {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos?: string;
  };
  tratamiento: {
    _id: string;
    nombre?: string;
    descripcion?: string;
  };
  fechaInicio: Date | string;
  indicacionesGenerales: string;
  medicacionPrescrita: MedicacionPrescrita[];
  seguimientos: SeguimientoPostoperatorio[];
  estado: 'Activo' | 'Finalizado';
  notasIniciales?: string;
  fechaCreacion?: Date | string;
  fechaActualizacion?: Date | string;
}

export interface CrearPostoperatorioRequest {
  pacienteId: string;
  tratamientoId: string;
  indicacionesGenerales: string;
  medicacionPrescrita: MedicacionPrescrita[];
  notasIniciales?: string;
}

export interface ActualizarIndicacionesRequest {
  indicacionesGenerales: string;
  medicacionPrescrita: MedicacionPrescrita[];
}

export interface AgregarSeguimientoRequest {
  fecha: Date | string;
  notasEvolucion: string;
  profesionalId: string;
  adjuntos?: string[];
}

/**
 * Obtiene el registro postoperatorio completo asociado a un tratamiento quirúrgico específico
 */
export async function obtenerPostoperatorioPorTratamiento(
  tratamientoId: string
): Promise<Postoperatorio | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/postoperatorios/tratamiento/${tratamientoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No existe registro aún
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener postoperatorio: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener postoperatorio:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al obtener postoperatorio');
  }
}

/**
 * Crea un nuevo registro de seguimiento postoperatorio para un paciente y un tratamiento
 */
export async function crearRegistroPostoperatorio(
  datos: CrearPostoperatorioRequest
): Promise<Postoperatorio> {
  try {
    const response = await fetch(`${API_BASE_URL}/postoperatorios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear registro postoperatorio: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear registro postoperatorio:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al crear registro postoperatorio');
  }
}

/**
 * Añade una nueva entrada al historial de seguimiento de un registro postoperatorio existente
 */
export async function agregarEntradaSeguimiento(
  postoperatorioId: string,
  seguimiento: AgregarSeguimientoRequest
): Promise<Postoperatorio> {
  try {
    const response = await fetch(`${API_BASE_URL}/postoperatorios/${postoperatorioId}/seguimiento`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(seguimiento),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al agregar seguimiento: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al agregar seguimiento:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al agregar seguimiento');
  }
}

/**
 * Actualiza las indicaciones generales y la medicación prescrita en un registro postoperatorio
 */
export async function actualizarIndicaciones(
  postoperatorioId: string,
  datos: ActualizarIndicacionesRequest
): Promise<Postoperatorio> {
  try {
    const response = await fetch(`${API_BASE_URL}/postoperatorios/${postoperatorioId}/indicaciones`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar indicaciones: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar indicaciones:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al actualizar indicaciones');
  }
}

/**
 * Actualiza el estado del postoperatorio (Activo/Finalizado)
 */
export async function actualizarEstadoPostoperatorio(
  postoperatorioId: string,
  estado: 'Activo' | 'Finalizado'
): Promise<Postoperatorio> {
  try {
    const response = await fetch(`${API_BASE_URL}/postoperatorios/${postoperatorioId}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar estado: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al actualizar estado');
  }
}



