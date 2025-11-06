// API para análisis de radiografías con IA (DentIA)
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface AnalisisRadiograficoIA {
  _id: string;
  radiografiaId: string;
  pacienteId: string;
  solicitadoPor: string;
  status: 'en_cola' | 'procesando' | 'completado' | 'error';
  hallazgos?: HallazgoIA[];
  rawResponse?: any;
  createdAt: string;
  completedAt?: string;
}

export interface HallazgoIA {
  tipo: string;
  coordenadas: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  confianza: number;
  descripcion?: string;
  dienteAfectado?: string;
}

export interface SolicitudAnalisis {
  radiografiaId: string;
  pacienteId: string;
}

export interface RespuestaSolicitudAnalisis {
  analisisId: string;
  status: 'en_cola';
}

/**
 * Inicia un nuevo proceso de análisis de IA para una radiografía existente en el sistema
 */
export async function solicitarAnalisisIA(
  solicitud: SolicitudAnalisis
): Promise<RespuestaSolicitudAnalisis> {
  const response = await fetch(`${API_BASE_URL}/radiologia/ia/analizar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(solicitud),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al solicitar análisis' }));
    throw new Error(error.message || 'Error al solicitar análisis de IA');
  }

  return response.json();
}

/**
 * Obtiene el estado y los resultados de un análisis de IA específico
 */
export async function obtenerEstadoYResultadosAnalisis(
  analisisId: string
): Promise<AnalisisRadiograficoIA> {
  const response = await fetch(`${API_BASE_URL}/radiologia/ia/analisis/${analisisId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener análisis' }));
    throw new Error(error.message || 'Error al obtener estado del análisis');
  }

  return response.json();
}

/**
 * Recupera un historial de todos los análisis de IA realizados para un paciente específico
 */
export async function listarAnalisisPorPaciente(
  pacienteId: string
): Promise<AnalisisRadiograficoIA[]> {
  const response = await fetch(`${API_BASE_URL}/radiologia/ia/paciente/${pacienteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener historial' }));
    throw new Error(error.message || 'Error al obtener historial de análisis');
  }

  return response.json();
}


