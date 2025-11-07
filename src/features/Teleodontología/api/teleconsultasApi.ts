// API para gestión de teleconsultas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Teleconsulta {
  _id?: string;
  pacienteId: string;
  paciente?: {
    _id: string;
    nombre: string;
    apellidos: string;
    telefono?: string;
    email?: string;
  };
  odontologoId: string;
  odontologo?: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  fechaHoraInicio: string;
  fechaHoraFin?: string;
  estado: 'Programada' | 'Confirmada' | 'En Curso' | 'Completada' | 'Cancelada' | 'No Asistió';
  motivoConsulta?: string;
  notasPrevias?: string;
  enlaceVideollamada?: string;
  idSesionVideo?: string;
  creadoPor?: {
    _id: string;
    nombre: string;
  };
}

export interface FiltrosTeleconsultas {
  fechaInicio?: string;
  fechaFin?: string;
  odontologoId?: string;
  pacienteId?: string;
  estado?: string;
}

export interface CrearTeleconsultaData {
  pacienteId: string;
  odontologoId: string;
  fechaHoraInicio: string;
  motivoConsulta?: string;
}

export interface ActualizarTeleconsultaData {
  fechaHoraInicio?: string;
  estado?: Teleconsulta['estado'];
  notasPrevias?: string;
}

export interface EnlaceVideollamada {
  url: string;
}

/**
 * Obtiene una lista de teleconsultas con filtros opcionales
 */
export async function obtenerTeleconsultas(filtros?: FiltrosTeleconsultas): Promise<Teleconsulta[]> {
  try {
    const params = new URLSearchParams();
    
    if (filtros?.fechaInicio) {
      params.append('fechaInicio', filtros.fechaInicio);
    }
    if (filtros?.fechaFin) {
      params.append('fechaFin', filtros.fechaFin);
    }
    if (filtros?.odontologoId) {
      params.append('odontologoId', filtros.odontologoId);
    }
    if (filtros?.pacienteId) {
      params.append('pacienteId', filtros.pacienteId);
    }
    if (filtros?.estado) {
      params.append('estado', filtros.estado);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/teleconsultas${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener teleconsultas: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener teleconsultas:', error);
    throw error;
  }
}

/**
 * Obtiene los detalles de una teleconsulta específica
 */
export async function obtenerTeleconsultaPorId(id: string): Promise<Teleconsulta> {
  try {
    const response = await fetch(`${API_BASE_URL}/teleconsultas/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener teleconsulta: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener teleconsulta:', error);
    throw error;
  }
}

/**
 * Crea una nueva teleconsulta
 */
export async function crearTeleconsulta(datos: CrearTeleconsultaData): Promise<Teleconsulta> {
  try {
    const response = await fetch(`${API_BASE_URL}/teleconsultas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear teleconsulta: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear teleconsulta:', error);
    throw error;
  }
}

/**
 * Actualiza una teleconsulta existente
 */
export async function actualizarTeleconsulta(
  id: string,
  datos: ActualizarTeleconsultaData
): Promise<Teleconsulta> {
  try {
    const response = await fetch(`${API_BASE_URL}/teleconsultas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar teleconsulta: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar teleconsulta:', error);
    throw error;
  }
}

/**
 * Elimina/cancela una teleconsulta
 */
export async function eliminarTeleconsulta(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/teleconsultas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al eliminar teleconsulta: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al eliminar teleconsulta:', error);
    throw error;
  }
}

/**
 * Inicia una sesión de videollamada para una teleconsulta
 */
export async function iniciarSesionVideollamada(id: string): Promise<EnlaceVideollamada> {
  try {
    const response = await fetch(`${API_BASE_URL}/teleconsultas/${id}/iniciar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al iniciar videollamada: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al iniciar videollamada:', error);
    throw error;
  }
}



