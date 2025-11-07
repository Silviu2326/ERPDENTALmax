// API para gestión de fichas pediátricas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface AnamnesisPediatrica {
  historiaNacimiento?: string;
  tipoParto?: 'normal' | 'cesarea' | 'instrumental';
  semanasGestacion?: number;
  pesoNacimiento?: number;
  alimentacion?: string;
  tipoLactancia?: 'materna' | 'artificial' | 'mixta';
  tiempoLactancia?: number; // meses
  historialMedico?: string;
  enfermedadesInfantiles?: string[];
  alergias?: string[];
  medicamentosActuales?: string[];
  observaciones?: string;
}

export interface Habito {
  nombre: string;
  activo: boolean;
  observaciones?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface DienteOdontograma {
  numero: number;
  tipo: 'temporal' | 'permanente' | 'mixto';
  estado: 'sano' | 'caries' | 'ausente' | 'sellado' | 'extraido' | 'en_erupcion' | 'obturado';
  observaciones?: string;
}

export interface Odontograma {
  dientes: DienteOdontograma[];
}

export interface RiesgoCaries {
  nivel: 'bajo' | 'medio' | 'alto' | 'muy_alto';
  fechaEvaluacion: string;
  factoresRiesgo?: string[];
  observaciones?: string;
}

export interface Traumatismo {
  _id?: string;
  fecha: string;
  diente: number;
  descripcion: string;
  tipoTraumatismo?: string;
  tratamientoRealizado?: string;
}

export interface NotaEvolucion {
  _id?: string;
  fecha: string;
  nota: string;
  profesionalId: string;
  profesionalNombre?: string;
  tipo?: 'consulta' | 'control' | 'tratamiento' | 'prevencion';
}

export interface FichaPediatrica {
  _id?: string;
  pacienteId: string;
  anamnesisPediatrica: AnamnesisPediatrica;
  habitos: Habito[];
  odontograma: Odontograma;
  riesgoCaries?: RiesgoCaries;
  traumatismos: Traumatismo[];
  evolucion: NotaEvolucion[];
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

/**
 * Obtiene la ficha pediátrica completa de un paciente específico
 */
export async function obtenerFichaPorPacienteId(pacienteId: string): Promise<FichaPediatrica | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/fichas-pediatricas/paciente/${pacienteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No existe ficha aún
      }
      throw new Error(`Error al obtener ficha pediátrica: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener ficha pediátrica:', error);
    throw error;
  }
}

/**
 * Crea una nueva ficha pediátrica para un paciente
 */
export async function crearFichaPediatrica(
  ficha: Omit<FichaPediatrica, '_id' | 'fechaCreacion' | 'fechaActualizacion'>
): Promise<FichaPediatrica> {
  try {
    const response = await fetch(`${API_BASE_URL}/fichas-pediatricas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(ficha),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear ficha pediátrica: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear ficha pediátrica:', error);
    throw error;
  }
}

/**
 * Actualiza la información general o secciones completas de una ficha pediátrica existente
 */
export async function actualizarFichaCompleta(
  fichaId: string,
  datosActualizacion: Partial<Pick<FichaPediatrica, 'anamnesisPediatrica' | 'habitos' | 'riesgoCaries'>>
): Promise<FichaPediatrica> {
  try {
    const response = await fetch(`${API_BASE_URL}/fichas-pediatricas/${fichaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datosActualizacion),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar ficha pediátrica: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar ficha pediátrica:', error);
    throw error;
  }
}

/**
 * Actualiza específicamente el estado del odontograma pediátrico
 */
export async function actualizarOdontograma(
  fichaId: string,
  odontograma: Odontograma
): Promise<FichaPediatrica> {
  try {
    const response = await fetch(`${API_BASE_URL}/fichas-pediatricas/${fichaId}/odontograma`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(odontograma),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar odontograma: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar odontograma:', error);
    throw error;
  }
}

/**
 * Añade una nueva nota de evolución o seguimiento a la ficha del paciente
 */
export async function agregarNotaEvolucion(
  fichaId: string,
  nota: Omit<NotaEvolucion, '_id'>
): Promise<NotaEvolucion[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/fichas-pediatricas/${fichaId}/evolucion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(nota),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al agregar nota de evolución: ${response.statusText}`);
    }

    const data = await response.json();
    return data.evolucion || data;
  } catch (error) {
    console.error('Error al agregar nota de evolución:', error);
    throw error;
  }
}

/**
 * Registra un nuevo traumatismo dental
 */
export async function registrarTraumatismo(
  fichaId: string,
  traumatismo: Omit<Traumatismo, '_id'>
): Promise<FichaPediatrica> {
  try {
    const response = await fetch(`${API_BASE_URL}/fichas-pediatricas/${fichaId}/traumatismos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(traumatismo),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al registrar traumatismo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al registrar traumatismo:', error);
    throw error;
  }
}



