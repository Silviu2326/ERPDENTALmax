// API para gestión de plantillas de cartas al paciente
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface PlantillaCarta {
  _id?: string;
  nombre: string;
  asunto: string;
  cuerpoHTML: string;
  tipo: string; // 'bienvenida', 'marketing', 'recordatorio', 'post-operatorio', 'cumpleaños', etc.
  placeholdersDisponibles: string[]; // ['nombre_paciente', 'fecha_proxima_cita', etc.]
  createdAt?: string;
  updatedAt?: string;
}

// Obtener todas las plantillas de cartas
export async function obtenerTodasLasPlantillas(tipo?: string): Promise<PlantillaCarta[]> {
  try {
    const url = tipo 
      ? `${API_BASE_URL}/plantillas-carta?tipo=${tipo}`
      : `${API_BASE_URL}/plantillas-carta`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener plantillas de cartas');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener plantillas de cartas:', error);
    throw error;
  }
}

// Obtener una plantilla por ID
export async function obtenerPlantillaPorId(id: string): Promise<PlantillaCarta> {
  try {
    const response = await fetch(`${API_BASE_URL}/plantillas-carta/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la plantilla');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener la plantilla:', error);
    throw error;
  }
}

// Crear una nueva plantilla de carta
export async function crearPlantilla(plantilla: Omit<PlantillaCarta, '_id' | 'createdAt' | 'updatedAt'>): Promise<PlantillaCarta> {
  try {
    const response = await fetch(`${API_BASE_URL}/plantillas-carta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plantilla),
    });

    if (!response.ok) {
      throw new Error('Error al crear plantilla');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear plantilla:', error);
    throw error;
  }
}

// Actualizar una plantilla de carta existente
export async function actualizarPlantilla(
  id: string,
  plantilla: Partial<PlantillaCarta>
): Promise<PlantillaCarta> {
  try {
    const response = await fetch(`${API_BASE_URL}/plantillas-carta/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plantilla),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar plantilla');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar plantilla:', error);
    throw error;
  }
}

// Eliminar una plantilla de carta
export async function eliminarPlantilla(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/plantillas-carta/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar plantilla');
    }
  } catch (error) {
    console.error('Error al eliminar plantilla:', error);
    throw error;
  }
}


