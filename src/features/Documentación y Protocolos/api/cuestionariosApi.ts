// API para gestión de cuestionarios médicos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface PreguntaCuestionario {
  _id?: string;
  texto: string;
  tipo: 'texto_corto' | 'opcion_unica' | 'opcion_multiple' | 'si_no';
  opciones?: string[]; // Para opcion_unica y opcion_multiple
  es_alerta: boolean; // Si la respuesta genera una alerta médica
  requerido: boolean;
}

export interface CuestionarioPlantilla {
  _id?: string;
  nombre: string;
  descripcion: string;
  preguntas: PreguntaCuestionario[];
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  version?: number; // Para versionado de plantillas
}

export interface RespuestaCuestionario {
  preguntaId: string;
  valor: string | string[]; // Puede ser string o array para opciones múltiples
}

export interface CuestionarioPaciente {
  _id?: string;
  paciente: string; // ObjectId del paciente
  plantilla: string; // ObjectId de la plantilla
  estado: 'pendiente' | 'completado';
  fechaAsignacion: string;
  fechaCompletado?: string;
  respuestas: RespuestaCuestionario[];
  firmaProfesional?: string;
  versionPlantilla?: number; // Versión de la plantilla al momento de asignar
}

// Obtener todas las plantillas de cuestionarios
export async function obtenerPlantillasCuestionarios(): Promise<CuestionarioPlantilla[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cuestionarios/plantillas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener plantillas de cuestionarios');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener plantillas de cuestionarios:', error);
    throw error;
  }
}

// Obtener una plantilla por ID
export async function obtenerPlantillaCuestionarioPorId(plantillaId: string): Promise<CuestionarioPlantilla> {
  try {
    const response = await fetch(`${API_BASE_URL}/cuestionarios/plantillas/${plantillaId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la plantilla de cuestionario');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener la plantilla de cuestionario:', error);
    throw error;
  }
}

// Crear una nueva plantilla de cuestionario
export async function crearPlantillaCuestionario(
  plantilla: Omit<CuestionarioPlantilla, '_id' | 'fechaCreacion' | 'fechaActualizacion' | 'version'>
): Promise<CuestionarioPlantilla> {
  try {
    const response = await fetch(`${API_BASE_URL}/cuestionarios/plantillas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plantilla),
    });

    if (!response.ok) {
      throw new Error('Error al crear plantilla de cuestionario');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear plantilla de cuestionario:', error);
    throw error;
  }
}

// Actualizar una plantilla de cuestionario existente
export async function actualizarPlantillaCuestionario(
  plantillaId: string,
  plantilla: Partial<CuestionarioPlantilla>
): Promise<CuestionarioPlantilla> {
  try {
    const response = await fetch(`${API_BASE_URL}/cuestionarios/plantillas/${plantillaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plantilla),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar plantilla de cuestionario');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar plantilla de cuestionario:', error);
    throw error;
  }
}

// Eliminar una plantilla de cuestionario
export async function eliminarPlantillaCuestionario(plantillaId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/cuestionarios/plantillas/${plantillaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar plantilla de cuestionario');
    }
  } catch (error) {
    console.error('Error al eliminar plantilla de cuestionario:', error);
    throw error;
  }
}

// Obtener todos los cuestionarios de un paciente (pendientes y completados)
export async function obtenerCuestionariosPorPaciente(pacienteId: string): Promise<CuestionarioPaciente[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cuestionarios/paciente/${pacienteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener cuestionarios del paciente');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener cuestionarios del paciente:', error);
    throw error;
  }
}

// Asignar un cuestionario a un paciente
export async function asignarCuestionarioAPaciente(
  pacienteId: string,
  plantillaId: string
): Promise<CuestionarioPaciente> {
  try {
    const response = await fetch(`${API_BASE_URL}/cuestionarios/asignar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        pacienteId,
        plantillaId,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al asignar cuestionario al paciente');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al asignar cuestionario al paciente:', error);
    throw error;
  }
}

// Guardar o actualizar las respuestas de un cuestionario
export async function guardarRespuestasCuestionario(
  cuestionarioPacienteId: string,
  respuestas: RespuestaCuestionario[]
): Promise<CuestionarioPaciente> {
  try {
    const response = await fetch(`${API_BASE_URL}/cuestionarios/respuestas/${cuestionarioPacienteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        respuestas,
        estado: 'completado',
      }),
    });

    if (!response.ok) {
      throw new Error('Error al guardar respuestas del cuestionario');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al guardar respuestas del cuestionario:', error);
    throw error;
  }
}

// Obtener un cuestionario de paciente por ID
export async function obtenerCuestionarioPacientePorId(
  cuestionarioPacienteId: string
): Promise<CuestionarioPaciente> {
  try {
    const response = await fetch(`${API_BASE_URL}/cuestionarios/respuestas/${cuestionarioPacienteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el cuestionario del paciente');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener el cuestionario del paciente:', error);
    throw error;
  }
}


