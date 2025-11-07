// API para gestión de evaluaciones de ATM y Dolor Orofacial
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface PalpacionMuscular {
  musculo: string;
  lado: 'izquierdo' | 'derecho' | 'bilateral';
  dolor: number; // Escala 0-10
}

export interface RuidoArticular {
  tipo: 'clic' | 'crepito' | 'ninguno';
  lado: 'izquierdo' | 'derecho' | 'bilateral';
}

export interface RangosMovimiento {
  aperturaSinDolor: number; // mm
  aperturaMaxima: number; // mm
  lateralidadDerecha: number; // mm
  lateralidadIzquierda: number; // mm
  protrusion: number; // mm
}

export interface MapaDolor {
  [key: string]: {
    x: number;
    y: number;
    intensidad: number;
    lado: 'izquierdo' | 'derecho' | 'bilateral';
  };
}

export interface Diagnostico {
  codigo: string;
  descripcion: string;
}

export interface NotaSeguimiento {
  fecha: string;
  nota: string;
}

export interface AtmEvaluacion {
  _id?: string;
  paciente: string;
  odontologo: string;
  fechaEvaluacion: string;
  motivoConsulta?: string;
  anamnesis: {
    indiceFonseca?: number;
    detalles?: string;
  };
  examenClinico: {
    palpacionMuscular: PalpacionMuscular[];
    ruidosArticulares: RuidoArticular[];
    rangosMovimiento: RangosMovimiento;
    mapaDolor?: MapaDolor;
  };
  diagnostico: Diagnostico[];
  planTratamiento?: string;
  notasSeguimiento?: NotaSeguimiento[];
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

/**
 * Crea una nueva evaluación de ATM para un paciente
 */
export async function crearEvaluacionATM(
  pacienteId: string,
  evaluacion: Omit<AtmEvaluacion, '_id' | 'paciente' | 'odontologo' | 'fechaCreacion' | 'fechaActualizacion'>
): Promise<AtmEvaluacion> {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/atm-evaluaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(evaluacion),
    });

    if (!response.ok) {
      throw new Error(`Error al crear evaluación: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear evaluación ATM:', error);
    throw error;
  }
}

/**
 * Obtiene todas las evaluaciones de ATM de un paciente
 */
export async function obtenerEvaluacionesPorPaciente(pacienteId: string): Promise<AtmEvaluacion[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/atm-evaluaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener evaluaciones: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener evaluaciones ATM:', error);
    throw error;
  }
}

/**
 * Obtiene los detalles completos de una evaluación específica
 */
export async function obtenerEvaluacionPorId(evaluacionId: string): Promise<AtmEvaluacion> {
  try {
    const response = await fetch(`${API_BASE_URL}/atm-evaluaciones/${evaluacionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener evaluación: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener evaluación ATM:', error);
    throw error;
  }
}

/**
 * Actualiza una evaluación de ATM existente
 */
export async function actualizarEvaluacionATM(
  evaluacionId: string,
  datosActualizacion: Partial<AtmEvaluacion>
): Promise<AtmEvaluacion> {
  try {
    const response = await fetch(`${API_BASE_URL}/atm-evaluaciones/${evaluacionId}`, {
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
      throw new Error(`Error al actualizar evaluación: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar evaluación ATM:', error);
    throw error;
  }
}

/**
 * Calcula el índice de Fonseca basado en las respuestas del cuestionario
 */
export function calcularIndiceFonseca(respuestas: { [key: string]: number }): number {
  // El índice de Fonseca evalúa 10 preguntas con valores de 0-4
  // 0 = nunca, 1 = rara vez, 2 = a veces, 3 = frecuentemente, 4 = siempre
  const totalPuntos = Object.values(respuestas).reduce((sum, val) => sum + val, 0);
  const porcentaje = (totalPuntos / 40) * 100;
  
  return porcentaje;
}

/**
 * Interpreta el índice de Fonseca
 */
export function interpretarIndiceFonseca(indice: number): {
  nivel: 'sin' | 'leve' | 'moderado' | 'severo';
  descripcion: string;
} {
  if (indice < 15) {
    return {
      nivel: 'sin',
      descripcion: 'Sin disfunción temporomandibular',
    };
  } else if (indice < 35) {
    return {
      nivel: 'leve',
      descripcion: 'Disfunción temporomandibular leve',
    };
  } else if (indice < 50) {
    return {
      nivel: 'moderado',
      descripcion: 'Disfunción temporomandibular moderada',
    };
  } else {
    return {
      nivel: 'severo',
      descripcion: 'Disfunción temporomandibular severa',
    };
  }
}



