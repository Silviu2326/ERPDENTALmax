// API para gestión de aplicaciones preventivas de odontopediatría (flúor y selladores)
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface DienteTratado {
  diente: number;
  superficie: string;
}

export interface AplicacionPreventiva {
  _id?: string;
  paciente: string;
  profesional: string;
  fechaAplicacion: string;
  tipoAplicacion: 'Fluor' | 'Sellador';
  productoUtilizado: string;
  dientesTratados: DienteTratado[];
  notas?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearAplicacionData {
  fechaAplicacion: string;
  tipoAplicacion: 'Fluor' | 'Sellador';
  productoUtilizado: string;
  dientesTratados: DienteTratado[];
  notas?: string;
  profesionalId: string;
}

export interface ActualizarAplicacionData {
  fechaAplicacion?: string;
  tipoAplicacion?: 'Fluor' | 'Sellador';
  productoUtilizado?: string;
  dientesTratados?: DienteTratado[];
  notas?: string;
}

/**
 * Obtiene el historial completo de aplicaciones de flúor y selladores para un paciente específico
 */
export async function obtenerAplicacionesPorPaciente(pacienteId: string): Promise<AplicacionPreventiva[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/odontopediatria/aplicaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener aplicaciones: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al obtener aplicaciones:', error);
    throw error;
  }
}

/**
 * Crea un nuevo registro de aplicación de flúor o sellador para un paciente
 */
export async function crearNuevaAplicacion(
  pacienteId: string,
  datos: CrearAplicacionData
): Promise<AplicacionPreventiva> {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/odontopediatria/aplicaciones`, {
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
      throw new Error(errorData.message || `Error al crear aplicación: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al crear aplicación:', error);
    throw error;
  }
}

/**
 * Actualiza un registro de aplicación existente
 */
export async function actualizarAplicacionExistente(
  pacienteId: string,
  aplicacionId: string,
  datos: ActualizarAplicacionData
): Promise<AplicacionPreventiva> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/pacientes/${pacienteId}/odontopediatria/aplicaciones/${aplicacionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(datos),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar aplicación: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al actualizar aplicación:', error);
    throw error;
  }
}

/**
 * Elimina un registro de aplicación (soft delete)
 */
export async function eliminarAplicacion(
  pacienteId: string,
  aplicacionId: string
): Promise<{ message: string }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/pacientes/${pacienteId}/odontopediatria/aplicaciones/${aplicacionId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al eliminar aplicación: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al eliminar aplicación:', error);
    throw error;
  }
}


