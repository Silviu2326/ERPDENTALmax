// API para gestión de horarios y turnos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface HorarioProfesional {
  _id?: string;
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  sede: {
    _id: string;
    nombre: string;
  };
  fechaInicio: string;
  fechaFin: string;
  tipo: 'trabajo' | 'ausencia_justificada' | 'vacaciones' | 'bloqueo';
  notas?: string;
  creadoPor: {
    _id: string;
    nombre: string;
  };
  modificadoPor?: {
    _id: string;
    nombre: string;
  };
}

export interface PlantillaHorario {
  _id?: string;
  nombre: string;
  descripcion?: string;
  turnos: Array<{
    diaSemana: number; // 0 = Domingo, 1 = Lunes, etc.
    horaInicio: string; // Formato "HH:mm"
    horaFin: string; // Formato "HH:mm"
  }>;
  sede?: {
    _id: string;
    nombre: string;
  };
}

export interface SolicitudAusencia {
  _id?: string;
  profesional: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  gestionadoPor?: {
    _id: string;
    nombre: string;
  };
  fechaGestion?: string;
}

export interface FiltrosHorarios {
  fechaInicio: string;
  fechaFin: string;
  profesionalId?: string;
  sedeId?: string;
  tipo?: string;
}

/**
 * Obtiene los horarios/turnos de los profesionales filtrados por sede y rango de fechas
 */
export async function obtenerHorarios(filtros: FiltrosHorarios): Promise<HorarioProfesional[]> {
  try {
    const params = new URLSearchParams();
    params.append('fechaInicio', filtros.fechaInicio);
    params.append('fechaFin', filtros.fechaFin);
    if (filtros.profesionalId) params.append('profesionalId', filtros.profesionalId);
    if (filtros.sedeId) params.append('sedeId', filtros.sedeId);
    if (filtros.tipo) params.append('tipo', filtros.tipo);

    const response = await fetch(`${API_BASE_URL}/horarios?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener horarios: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    throw error;
  }
}

/**
 * Crea un nuevo turno o bloque de horario para un profesional
 */
export async function crearHorario(horario: {
  profesionalId: string;
  sedeId: string;
  fechaInicio: string;
  fechaFin: string;
  tipo: 'trabajo' | 'ausencia' | 'vacaciones';
  notas?: string;
}): Promise<HorarioProfesional> {
  try {
    const response = await fetch(`${API_BASE_URL}/horarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(horario),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear horario: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear horario:', error);
    throw error;
  }
}

/**
 * Actualiza un turno o bloque de horario existente
 */
export async function actualizarHorario(
  horarioId: string,
  cambios: {
    fechaInicio?: string;
    fechaFin?: string;
    tipo?: 'trabajo' | 'ausencia_justificada' | 'vacaciones' | 'bloqueo';
    notas?: string;
  }
): Promise<HorarioProfesional> {
  try {
    const response = await fetch(`${API_BASE_URL}/horarios/${horarioId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(cambios),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar horario: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    throw error;
  }
}

/**
 * Elimina un turno o bloque de horario
 */
export async function eliminarHorario(horarioId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/horarios/${horarioId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al eliminar horario: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    throw error;
  }
}

/**
 * Obtiene todas las plantillas de horarios disponibles
 */
export async function obtenerPlantillasHorario(): Promise<PlantillaHorario[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/horarios/plantillas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener plantillas: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    throw error;
  }
}

/**
 * Crea una nueva plantilla de horarios
 */
export async function crearPlantillaHorario(plantilla: {
  nombre: string;
  descripcion?: string;
  turnos: Array<{
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
  }>;
  sedeId?: string;
}): Promise<PlantillaHorario> {
  try {
    const response = await fetch(`${API_BASE_URL}/horarios/plantillas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plantilla),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear plantilla: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear plantilla:', error);
    throw error;
  }
}

/**
 * Aplica una plantilla de horarios a un profesional para un rango de fechas
 */
export async function aplicarPlantillaHorario(
  profesionalId: string,
  sedeId: string,
  plantillaId: string,
  fechaInicio: string,
  fechaFin: string
): Promise<HorarioProfesional[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/horarios/plantillas/aplicar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        profesionalId,
        sedeId,
        plantillaId,
        fechaInicio,
        fechaFin,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al aplicar plantilla: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al aplicar plantilla:', error);
    throw error;
  }
}

/**
 * Obtiene las solicitudes de ausencia
 */
export async function obtenerSolicitudesAusencia(filtros?: {
  estado?: 'pendiente' | 'aprobada' | 'rechazada';
  profesionalId?: string;
}): Promise<SolicitudAusencia[]> {
  try {
    const params = new URLSearchParams();
    if (filtros?.estado) params.append('estado', filtros.estado);
    if (filtros?.profesionalId) params.append('profesionalId', filtros.profesionalId);

    const response = await fetch(`${API_BASE_URL}/horarios/solicitudes-ausencia?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener solicitudes: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    throw error;
  }
}

/**
 * Crea una nueva solicitud de ausencia
 */
export async function crearSolicitudAusencia(solicitud: {
  profesionalId: string;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
}): Promise<SolicitudAusencia> {
  try {
    const response = await fetch(`${API_BASE_URL}/horarios/solicitudes-ausencia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(solicitud),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    throw error;
  }
}

/**
 * Aprueba o rechaza una solicitud de ausencia
 */
export async function gestionarSolicitudAusencia(
  solicitudId: string,
  accion: 'aprobada' | 'rechazada'
): Promise<SolicitudAusencia> {
  try {
    const response = await fetch(`${API_BASE_URL}/horarios/solicitudes-ausencia/${solicitudId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ estado: accion }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al gestionar solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al gestionar solicitud:', error);
    throw error;
  }
}


