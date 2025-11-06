const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface MedicionOsteointegracion {
  _id?: string;
  fecha: Date | string;
  tipoMedicion: 'ISQ' | 'Periotest' | 'Clinica';
  valor: string;
  observaciones?: string;
  registradoPor: string;
}

export interface Implante {
  _id?: string;
  pacienteId: string;
  odontologoId: string;
  fechaColocacion: Date | string;
  piezaDental: number;
  marca: string;
  modelo: string;
  longitud: number;
  diametro: number;
  estadoOsteointegracion: 'En Espera' | 'En Progreso' | 'Osteointegrado' | 'Fallido';
  mediciones: MedicionOsteointegracion[];
  ultimaMedicion?: MedicionOsteointegracion;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Obtiene una lista de todos los implantes registrados para un paciente específico
 */
export async function obtenerImplantesPorPaciente(
  pacienteId: string
): Promise<Implante[]> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/implantes`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los implantes del paciente');
  }

  return response.json();
}

/**
 * Recupera el historial completo de mediciones de osteointegración para un implante específico
 */
export async function obtenerMedicionesPorImplante(
  implanteId: string
): Promise<MedicionOsteointegracion[]> {
  const response = await fetch(`${API_BASE_URL}/implantes/${implanteId}/mediciones`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las mediciones del implante');
  }

  return response.json();
}

/**
 * Registra una nueva medición de estabilidad (ej. ISQ) para un implante
 */
export async function registrarMedicion(
  implanteId: string,
  medicion: {
    fecha: Date | string;
    tipoMedicion: 'ISQ' | 'Periotest' | 'Clinica';
    valor: string;
    observaciones?: string;
  }
): Promise<Implante> {
  const response = await fetch(`${API_BASE_URL}/implantes/${implanteId}/mediciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(medicion),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar la medición');
  }

  return response.json();
}

/**
 * Actualiza el estado general del proceso de osteointegración de un implante
 */
export async function actualizarEstadoImplante(
  implanteId: string,
  estado: 'En Espera' | 'En Progreso' | 'Osteointegrado' | 'Fallido'
): Promise<Implante> {
  const response = await fetch(`${API_BASE_URL}/implantes/${implanteId}/estado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ estado }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el estado del implante');
  }

  return response.json();
}

/**
 * Crea un nuevo implante para un paciente
 */
export async function crearImplante(
  pacienteId: string,
  implante: {
    fechaColocacion: Date | string;
    piezaDental: number;
    marca: string;
    modelo: string;
    longitud: number;
    diametro: number;
    estadoOsteointegracion?: 'En Espera' | 'En Progreso' | 'Osteointegrado' | 'Fallido';
  }
): Promise<Implante> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/implantes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(implante),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el implante');
  }

  return response.json();
}

/**
 * Obtiene los detalles de un implante específico
 */
export async function obtenerImplantePorId(
  implanteId: string
): Promise<Implante> {
  const response = await fetch(`${API_BASE_URL}/implantes/${implanteId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el implante');
  }

  return response.json();
}


