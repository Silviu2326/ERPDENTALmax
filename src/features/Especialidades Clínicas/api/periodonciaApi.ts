const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface MedicionDiente {
  diente: number;
  profundidadSondaje: number[]; // 6 valores para las 6 superficies
  sangradoAlSondaje: boolean[]; // 6 valores
  supuracion: boolean[]; // 6 valores
  placaVisible: boolean[]; // 6 valores
  nivelInsercion: number[]; // 6 valores
  movilidad: number; // 0-3
  afectacionFurca: string; // I, II, III, o vacío
}

export interface SesionMantenimientoPeriodontal {
  _id?: string;
  paciente: string;
  profesional: string;
  fechaSesion: Date | string;
  indicePlacaGeneral?: number;
  indiceSangradoGeneral?: number;
  observaciones?: string;
  mediciones: MedicionDiente[];
  planProximaVisita?: string;
  intervaloRecomendado?: number; // en meses
}

/**
 * Obtiene el historial completo de sesiones de mantenimiento periodontal para un paciente
 */
export async function obtenerSesionesMantenimiento(
  pacienteId: string
): Promise<SesionMantenimientoPeriodontal[]> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/periodoncia/mantenimiento`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las sesiones de mantenimiento');
  }

  return response.json();
}

/**
 * Crea un nuevo registro de sesión de mantenimiento periodontal para un paciente
 */
export async function crearSesionMantenimiento(
  pacienteId: string,
  datos: Omit<SesionMantenimientoPeriodontal, '_id' | 'paciente'>
): Promise<SesionMantenimientoPeriodontal> {
  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/periodoncia/mantenimiento`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la sesión de mantenimiento');
  }

  return response.json();
}

/**
 * Obtiene los detalles completos de una sesión de mantenimiento específica por su ID
 */
export async function obtenerDetalleSesion(
  sesionId: string
): Promise<SesionMantenimientoPeriodontal> {
  const response = await fetch(`${API_BASE_URL}/periodoncia/mantenimiento/${sesionId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los detalles de la sesión');
  }

  return response.json();
}

/**
 * Actualiza los datos de una sesión de mantenimiento existente
 */
export async function actualizarSesionMantenimiento(
  sesionId: string,
  datos: Partial<SesionMantenimientoPeriodontal>
): Promise<SesionMantenimientoPeriodontal> {
  const response = await fetch(`${API_BASE_URL}/periodoncia/mantenimiento/${sesionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la sesión de mantenimiento');
  }

  return response.json();
}

/**
 * Calcula el índice de placa general a partir de las mediciones
 */
export function calcularIndicePlaca(mediciones: MedicionDiente[]): number {
  if (mediciones.length === 0) return 0;
  
  let totalSitios = 0;
  let sitiosConPlaca = 0;
  
  mediciones.forEach(medicion => {
    medicion.placaVisible.forEach(placa => {
      totalSitios++;
      if (placa) sitiosConPlaca++;
    });
  });
  
  return totalSitios > 0 ? (sitiosConPlaca / totalSitios) * 100 : 0;
}

/**
 * Calcula el índice de sangrado general (BOP) a partir de las mediciones
 */
export function calcularIndiceSangrado(mediciones: MedicionDiente[]): number {
  if (mediciones.length === 0) return 0;
  
  let totalSitios = 0;
  let sitiosConSangrado = 0;
  
  mediciones.forEach(medicion => {
    medicion.sangradoAlSondaje.forEach(sangrado => {
      totalSitios++;
      if (sangrado) sitiosConSangrado++;
    });
  });
  
  return totalSitios > 0 ? (sitiosConSangrado / totalSitios) * 100 : 0;
}



