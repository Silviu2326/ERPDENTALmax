// API para gestión de registros de endodoncia
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface ConductoRadicular {
  nombreConducto: 'Mesiobucal' | 'Distobucal' | 'Palatino' | 'Vestibular' | 'Lingual' | 'Mesial' | 'Distal' | 'MV' | 'ML' | 'DV' | 'DL' | 'Otro';
  longitudTrabajo: number;
  instrumentoApical: string;
  conoMaestro: string;
  tecnicaObturacion?: string;
  sellador?: string;
  observacionesConducto?: string;
}

export interface RegistroEndodoncia {
  _id?: string;
  tratamientoId: string;
  pacienteId: string;
  odontologoId: string;
  numeroDiente: number;
  conductos: ConductoRadicular[];
  observacionesGenerales?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface AnatomiaDental {
  conductosSugeridos: string[];
  numeroDiente: number;
}

/**
 * Obtiene el registro de endodoncia asociado a un ID de tratamiento específico
 */
export async function obtenerRegistroPorTratamientoId(tratamientoId: string): Promise<RegistroEndodoncia | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/endodoncia/tratamiento/${tratamientoId}`, {
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
      throw new Error(`Error al obtener registro: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener registro de endodoncia:', error);
    throw error;
  }
}

/**
 * Crea un nuevo registro de endodoncia
 */
export async function crearRegistroEndodoncia(
  registro: Omit<RegistroEndodoncia, '_id' | 'fechaCreacion' | 'fechaActualizacion'>
): Promise<RegistroEndodoncia> {
  try {
    const response = await fetch(`${API_BASE_URL}/endodoncia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(registro),
    });

    if (!response.ok) {
      throw new Error(`Error al crear registro: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear registro de endodoncia:', error);
    throw error;
  }
}

/**
 * Actualiza un registro de endodoncia existente
 */
export async function actualizarRegistroEndodoncia(
  registroId: string,
  datosActualizacion: Partial<Pick<RegistroEndodoncia, 'conductos' | 'observacionesGenerales'>>
): Promise<RegistroEndodoncia> {
  try {
    const response = await fetch(`${API_BASE_URL}/endodoncia/${registroId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ...datosActualizacion,
        fechaActualizacion: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar registro: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar registro de endodoncia:', error);
    throw error;
  }
}

/**
 * Obtiene la anatomía radicular estándar de una pieza dental
 */
export async function obtenerAnatomiaDental(numeroDiente: number): Promise<AnatomiaDental> {
  try {
    const response = await fetch(`${API_BASE_URL}/dientes/anatomia/${numeroDiente}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      // Si no existe en la BD, devolver anatomía por defecto según el número de diente
      return obtenerAnatomiaPorDefecto(numeroDiente);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener anatomía dental:', error);
    // En caso de error, devolver anatomía por defecto
    return obtenerAnatomiaPorDefecto(numeroDiente);
  }
}

/**
 * Función auxiliar para obtener anatomía por defecto según el número de diente
 */
function obtenerAnatomiaPorDefecto(numeroDiente: number): AnatomiaDental {
  // Anatomía estándar según numeración dental
  const anatomias: { [key: number]: string[] } = {
    // Incisivos y caninos (1-3, 11-13, 21-23, 31-33) - 1 conducto
    11: ['Vestibular'],
    12: ['Vestibular'],
    13: ['Vestibular'],
    21: ['Vestibular'],
    22: ['Vestibular'],
    23: ['Vestibular'],
    31: ['Lingual'],
    32: ['Lingual'],
    33: ['Lingual'],
    41: ['Vestibular'],
    42: ['Vestibular'],
    43: ['Vestibular'],
    // Premolares superiores (14-15, 24-25) - 1-2 conductos
    14: ['Vestibular', 'Palatino'],
    15: ['Vestibular', 'Palatino'],
    24: ['Vestibular', 'Palatino'],
    25: ['Vestibular', 'Palatino'],
    // Premolares inferiores (34-35, 44-45) - 1 conducto
    34: ['Vestibular'],
    35: ['Vestibular'],
    44: ['Vestibular'],
    45: ['Vestibular'],
    // Molares superiores (16-17, 26-27) - 3 conductos
    16: ['Mesiobucal', 'Distobucal', 'Palatino'],
    17: ['Mesiobucal', 'Distobucal', 'Palatino'],
    26: ['Mesiobucal', 'Distobucal', 'Palatino'],
    27: ['Mesiobucal', 'Distobucal', 'Palatino'],
    // Molares inferiores (36-37, 46-47) - 2-3 conductos
    36: ['Mesial', 'Distal'],
    37: ['Mesial', 'Distal'],
    46: ['Mesial', 'Distal'],
    47: ['Mesial', 'Distal'],
  };

  const conductos = anatomias[numeroDiente] || ['Vestibular'];
  
  return {
    conductosSugeridos: conductos,
    numeroDiente,
  };
}


