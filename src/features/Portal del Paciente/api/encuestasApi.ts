// API para gestión de encuestas de satisfacción
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Tipos de pregunta
export type TipoPregunta = 'estrellas' | 'multiple' | 'abierta';

// Pregunta de una encuesta
export interface Pregunta {
  _id?: string;
  texto: string;
  tipo: TipoPregunta;
  opciones?: string[]; // Para tipo 'multiple'
  orden?: number;
}

// Plantilla de encuesta
export interface EncuestaPlantilla {
  _id?: string;
  titulo: string;
  descripcion: string;
  activa: boolean;
  preguntas: Pregunta[];
  creadoPor?: {
    _id: string;
    nombre: string;
  };
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

// Respuesta a una pregunta
export interface RespuestaPregunta {
  preguntaId: string;
  preguntaTexto: string;
  respuestaValor: any; // string, number, o array según el tipo
}

// Instancia de respuesta de encuesta
export interface EncuestaRespuesta {
  _id?: string;
  plantilla: string | EncuestaPlantilla;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  cita?: {
    _id: string;
    fecha_hora_inicio: string;
  };
  estado: 'pendiente' | 'completada';
  respuestas: RespuestaPregunta[];
  fechaCompletada?: string;
  fechaCreacion?: string;
}

// Resultados agregados de una encuesta
export interface ResultadosEncuesta {
  plantillaId: string;
  titulo: string;
  totalRespuestas: number;
  promedioGeneral?: number;
  estadisticas: {
    preguntaId: string;
    preguntaTexto: string;
    tipo: TipoPregunta;
    promedio?: number; // Para tipo estrellas
    distribucion?: { [key: string]: number }; // Para tipo multiple
    respuestasAbiertas?: string[]; // Para tipo abierta
  }[];
  fechaInicio?: string;
  fechaFin?: string;
}

// Obtener encuestas pendientes para el paciente autenticado
export async function obtenerEncuestasPendientes(): Promise<EncuestaRespuesta[]> {
  const token = localStorage.getItem('patientToken') || localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/encuestas/pendientes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener encuestas pendientes');
  }

  return response.json();
}

// Obtener la plantilla de una encuesta por ID
export async function obtenerPlantillaEncuesta(plantillaId: string): Promise<EncuestaPlantilla> {
  const token = localStorage.getItem('patientToken') || localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/encuestas/plantilla/${plantillaId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener la plantilla de la encuesta');
  }

  return response.json();
}

// Enviar respuestas de una encuesta
export async function enviarRespuestasEncuesta(
  respuestaId: string,
  respuestas: RespuestaPregunta[]
): Promise<{ mensaje: string; success: boolean }> {
  const token = localStorage.getItem('patientToken') || localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/encuestas/responder/${respuestaId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ respuestas }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al enviar las respuestas');
  }

  return response.json();
}

// Obtener todas las plantillas de encuestas (para Marketing/CRM)
export async function obtenerPlantillasEncuestas(): Promise<EncuestaPlantilla[]> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/encuestas/plantillas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las plantillas de encuestas');
  }

  return response.json();
}

// Crear una nueva plantilla de encuesta (para Marketing/CRM)
export async function crearPlantillaEncuesta(
  plantilla: Omit<EncuestaPlantilla, '_id' | 'fechaCreacion' | 'fechaActualizacion' | 'creadoPor'>
): Promise<EncuestaPlantilla> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/encuestas/plantillas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(plantilla),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la plantilla de encuesta');
  }

  return response.json();
}

// Actualizar una plantilla de encuesta (para Marketing/CRM)
export async function actualizarPlantillaEncuesta(
  plantillaId: string,
  plantilla: Partial<EncuestaPlantilla>
): Promise<EncuestaPlantilla> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/encuestas/plantillas/${plantillaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(plantilla),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la plantilla de encuesta');
  }

  return response.json();
}

// Eliminar una plantilla de encuesta (para Marketing/CRM)
export async function eliminarPlantillaEncuesta(plantillaId: string): Promise<void> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/encuestas/plantillas/${plantillaId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar la plantilla de encuesta');
  }
}

// Obtener resultados agregados de una encuesta (para Marketing/CRM)
export async function obtenerResultadosEncuesta(
  plantillaId: string,
  filtros?: {
    fechaInicio?: string;
    fechaFin?: string;
    profesionalId?: string;
  }
): Promise<ResultadosEncuesta> {
  const token = localStorage.getItem('token');
  
  const queryParams = new URLSearchParams();
  if (filtros?.fechaInicio) queryParams.append('fechaInicio', filtros.fechaInicio);
  if (filtros?.fechaFin) queryParams.append('fechaFin', filtros.fechaFin);
  if (filtros?.profesionalId) queryParams.append('profesionalId', filtros.profesionalId);
  
  const url = `${API_BASE_URL}/encuestas/resultados/${plantillaId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los resultados de la encuesta');
  }

  return response.json();
}


