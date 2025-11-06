// API para gestión de cirugías orales y registros intraoperatorios
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface SignoVital {
  hora: Date;
  presionArterial: string;
  frecuenciaCardiaca: number;
  spo2: number;
}

export interface EventoIntraoperatorio {
  hora: Date;
  descripcion: string;
}

export interface MaterialUtilizado {
  producto: {
    _id: string;
    nombre: string;
    codigo?: string;
  };
  cantidad: number;
}

export interface RegistroIntraoperatorio {
  _id?: string;
  cirugia: string;
  horaInicio?: Date;
  horaFin?: Date;
  notas?: string;
  signosVitales: SignoVital[];
  eventos: EventoIntraoperatorio[];
  materialesUtilizados: MaterialUtilizado[];
  checklistCompletado?: boolean;
}

export interface Cirugia {
  _id: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    fechaNacimiento?: Date;
    alergias?: string[];
    medicacionCronica?: string[];
  };
  odontologo: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  fechaProgramada: Date;
  planQuirurgico: string;
  estado: 'Planificada' | 'En Curso' | 'Finalizada' | 'Cancelada';
  registroIntraoperatorio?: RegistroIntraoperatorio;
  imagenesDiagnosticas?: Array<{
    _id: string;
    tipo: 'radiografia' | 'tac' | 'cbct' | 'foto';
    url: string;
    descripcion?: string;
  }>;
}

export interface DatosPreoperatorios extends Cirugia {
  consentimientoInformado?: {
    firmado: boolean;
    fechaFirma?: Date;
    url?: string;
  };
  indicacionesPreoperatorias?: string;
}

/**
 * Obtiene los datos preoperatorios de una cirugía
 */
export async function obtenerDatosPreoperatorios(cirugiaId: string): Promise<DatosPreoperatorios> {
  try {
    const response = await fetch(`${API_BASE_URL}/cirugias/${cirugiaId}/preoperatorio`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Cirugía no encontrada');
      }
      throw new Error(`Error al obtener datos preoperatorios: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error en obtenerDatosPreoperatorios:', error);
    throw error;
  }
}

/**
 * Inicia el registro intraoperatorio para una cirugía
 */
export async function iniciarRegistroIntraoperatorio(cirugiaId: string): Promise<RegistroIntraoperatorio> {
  try {
    const response = await fetch(`${API_BASE_URL}/cirugias/${cirugiaId}/intraoperatorio/iniciar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al iniciar registro intraoperatorio: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error en iniciarRegistroIntraoperatorio:', error);
    throw error;
  }
}

/**
 * Actualiza el registro intraoperatorio (autoguardado)
 */
export async function actualizarRegistroIntraoperatorio(
  cirugiaId: string,
  datos: Partial<RegistroIntraoperatorio>
): Promise<RegistroIntraoperatorio> {
  try {
    const response = await fetch(`${API_BASE_URL}/cirugias/${cirugiaId}/intraoperatorio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar registro intraoperatorio: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error en actualizarRegistroIntraoperatorio:', error);
    throw error;
  }
}

/**
 * Agrega un evento al registro intraoperatorio
 */
export async function agregarEventoIntraoperatorio(
  cirugiaId: string,
  descripcion: string
): Promise<EventoIntraoperatorio[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cirugias/${cirugiaId}/intraoperatorio/eventos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify({ descripcion }),
    });

    if (!response.ok) {
      throw new Error(`Error al agregar evento: ${response.statusText}`);
    }

    const data = await response.json();
    return data.eventos || [];
  } catch (error) {
    console.error('Error en agregarEventoIntraoperatorio:', error);
    throw error;
  }
}

/**
 * Agrega un material utilizado al registro intraoperatorio
 */
export async function agregarMaterialUtilizado(
  cirugiaId: string,
  productoId: string,
  cantidad: number
): Promise<MaterialUtilizado[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cirugias/${cirugiaId}/intraoperatorio/materiales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify({ productoId, cantidad }),
    });

    if (!response.ok) {
      throw new Error(`Error al agregar material: ${response.statusText}`);
    }

    const data = await response.json();
    return data.materialesUtilizados || [];
  } catch (error) {
    console.error('Error en agregarMaterialUtilizado:', error);
    throw error;
  }
}

/**
 * Finaliza el registro intraoperatorio
 */
export async function finalizarRegistroIntraoperatorio(
  cirugiaId: string,
  datos: Partial<RegistroIntraoperatorio>
): Promise<RegistroIntraoperatorio> {
  try {
    const datosFinales = {
      ...datos,
      horaFin: new Date().toISOString(),
    };

    const response = await fetch(`${API_BASE_URL}/cirugias/${cirugiaId}/intraoperatorio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify(datosFinales),
    });

    if (!response.ok) {
      throw new Error(`Error al finalizar registro intraoperatorio: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error en finalizarRegistroIntraoperatorio:', error);
    throw error;
  }
}

/**
 * Obtiene productos disponibles para el inventario
 */
export async function buscarProductos(query: string): Promise<Array<{ _id: string; nombre: string; codigo?: string; stock: number }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/inventario/productos/buscar?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al buscar productos: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error en buscarProductos:', error);
    return [];
  }
}


