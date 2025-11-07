// API para gestión de protocolos de carga inmediata
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Implante {
  posicion: string;
  marca: string;
  diametro: number;
  longitud: number;
  torqueInsercion?: number;
  lote?: string;
}

export interface Diagnostico {
  notas?: string;
  archivos?: string[];
}

export interface Planificacion {
  software?: string;
  guiaQuirurgica?: string;
  implantes?: Implante[];
}

export interface Cirugia {
  fecha?: string;
  notas?: string;
  implantes?: Implante[];
  biomateriales?: string[];
}

export interface FaseProtesica {
  fechaColocacion?: string;
  tipoProtesis?: string;
  material?: string;
  notas?: string;
  archivos?: string[];
}

export interface HistorialAccion {
  fecha: string;
  accion: string;
  usuario: string;
}

export type EstadoProtocolo = 'Diagnóstico' | 'Planificación' | 'Cirugía' | 'Protésico' | 'Finalizado';

export interface ProtocoloCargaInmediata {
  _id?: string;
  pacienteId: string;
  odontologoId: string;
  fechaCreacion?: string;
  estado: EstadoProtocolo;
  diagnostico?: Diagnostico;
  planificacion?: Planificacion;
  cirugia?: Cirugia;
  faseProtesica?: FaseProtesica;
  historial?: HistorialAccion[];
}

export interface DatosInicialesProtocolo {
  diagnostico?: Diagnostico;
}

/**
 * Crea un nuevo protocolo de carga inmediata para un paciente
 */
export async function crearProtocoloCargaInmediata(
  pacienteId: string,
  odontologoId: string,
  datosIniciales?: DatosInicialesProtocolo
): Promise<ProtocoloCargaInmediata> {
  try {
    const response = await fetch(`${API_BASE_URL}/protocolos/carga-inmediata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        pacienteId,
        odontologoId,
        datosIniciales: datosIniciales || {},
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al crear protocolo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear protocolo de carga inmediata:', error);
    throw error;
  }
}

/**
 * Obtiene todos los protocolos de carga inmediata asociados a un paciente
 */
export async function obtenerProtocolosPorPaciente(
  pacienteId: string
): Promise<ProtocoloCargaInmediata[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/protocolos/carga-inmediata/paciente/${pacienteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener protocolos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener protocolos de carga inmediata:', error);
    throw error;
  }
}

/**
 * Obtiene los detalles completos de un protocolo específico
 */
export async function obtenerProtocoloPorId(
  protocoloId: string
): Promise<ProtocoloCargaInmediata> {
  try {
    const response = await fetch(`${API_BASE_URL}/protocolos/carga-inmediata/${protocoloId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener protocolo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener protocolo de carga inmediata:', error);
    throw error;
  }
}

/**
 * Actualiza la información de un protocolo existente
 */
export async function actualizarFaseProtocolo(
  protocoloId: string,
  fase: EstadoProtocolo,
  datosFase: Partial<ProtocoloCargaInmediata>
): Promise<ProtocoloCargaInmediata> {
  try {
    const response = await fetch(`${API_BASE_URL}/protocolos/carga-inmediata/${protocoloId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        fase,
        datosFase,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar protocolo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar protocolo de carga inmediata:', error);
    throw error;
  }
}

/**
 * Sube y asocia archivos clínicos a un protocolo específico
 */
export async function agregarArchivoAProtocolo(
  protocoloId: string,
  archivo: File
): Promise<{ archivo: { url: string; nombre: string; tipo: string }; protocolo: ProtocoloCargaInmediata }> {
  try {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const response = await fetch(`${API_BASE_URL}/protocolos/carga-inmediata/${protocoloId}/archivos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error al subir archivo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al agregar archivo al protocolo:', error);
    throw error;
  }
}



