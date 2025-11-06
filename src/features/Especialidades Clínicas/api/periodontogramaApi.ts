const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface DatosDiente {
  profundidadSondaje: number[]; // 6 valores para las 6 superficies
  nivelInsercion: number[]; // 6 valores
  sangrado: boolean[]; // 6 valores
  supuracion: boolean[]; // 6 valores
  movilidad: number; // 0-3
  afectacionFurca: number; // 0-3
  placa: boolean[]; // 6 valores
  recesion: number[]; // 6 valores
}

export interface Periodontograma {
  _id?: string;
  pacienteId: string;
  profesionalId: string;
  fecha: Date;
  observaciones?: string;
  datosDientes: Map<string, DatosDiente> | { [key: string]: DatosDiente };
}

export interface PeriodontogramaResumen {
  _id: string;
  fecha: Date;
  porcentajeSangrado?: number;
  porcentajePlaca?: number;
  totalSitios?: number;
}

/**
 * Crea un nuevo periodontograma para un paciente
 */
export async function crearPeriodontograma(
  pacienteId: string,
  datos: Omit<Periodontograma, '_id' | 'pacienteId'>
): Promise<Periodontograma> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/periodontogramas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      ...datos,
      datosDientes: convertirMapaAObjeto(datos.datosDientes),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el periodontograma');
  }

  return response.json();
}

/**
 * Obtiene todos los periodontogramas históricos de un paciente
 */
export async function obtenerPeriodontogramasPorPaciente(
  pacienteId: string
): Promise<PeriodontogramaResumen[]> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/periodontogramas`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los periodontogramas');
  }

  return response.json();
}

/**
 * Obtiene un periodontograma específico por su ID
 */
export async function obtenerPeriodontogramaPorId(id: string): Promise<Periodontograma> {
  const response = await fetch(`${API_BASE_URL}/periodontogramas/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el periodontograma');
  }

  const data = await response.json();
  // Convertir objeto de datosDientes a Map si es necesario
  if (data.datosDientes && !(data.datosDientes instanceof Map)) {
    data.datosDientes = convertirObjetoAMapa(data.datosDientes);
  }
  return data;
}

/**
 * Actualiza un periodontograma existente
 */
export async function actualizarPeriodontograma(
  id: string,
  datos: Partial<Periodontograma>
): Promise<Periodontograma> {
  const body: any = { ...datos };
  if (body.datosDientes) {
    body.datosDientes = convertirMapaAObjeto(body.datosDientes);
  }

  const response = await fetch(`${API_BASE_URL}/periodontogramas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el periodontograma');
  }

  const data = await response.json();
  if (data.datosDientes && !(data.datosDientes instanceof Map)) {
    data.datosDientes = convertirObjetoAMapa(data.datosDientes);
  }
  return data;
}

/**
 * Convierte un Map a un objeto para serialización JSON
 */
function convertirMapaAObjeto(
  datosDientes: Map<string, DatosDiente> | { [key: string]: DatosDiente }
): { [key: string]: DatosDiente } {
  if (datosDientes instanceof Map) {
    const objeto: { [key: string]: DatosDiente } = {};
    datosDientes.forEach((valor, clave) => {
      objeto[clave] = valor;
    });
    return objeto;
  }
  return datosDientes;
}

/**
 * Convierte un objeto a Map para uso en el frontend
 */
function convertirObjetoAMapa(datosDientes: { [key: string]: DatosDiente }): Map<string, DatosDiente> {
  const mapa = new Map<string, DatosDiente>();
  Object.entries(datosDientes).forEach(([clave, valor]) => {
    mapa.set(clave, valor);
  });
  return mapa;
}


