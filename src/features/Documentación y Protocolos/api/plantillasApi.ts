// API para gestión de plantillas de documentos según especificación del módulo
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface DocumentoPlantilla {
  _id?: string;
  nombre: string;
  tipo: 'consentimiento' | 'prescripcion' | 'informe' | 'justificante' | 'presupuesto' | 'otro';
  contenidoHTML: string;
  sedeId?: string | null; // Null para plantillas globales
  activa: boolean;
  version: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Placeholder {
  key: string;
  desc: string;
}

export interface PlaceholdersDisponibles {
  paciente: Placeholder[];
  tratamiento?: Placeholder[];
  doctor?: Placeholder[];
  clinica?: Placeholder[];
  cita?: Placeholder[];
}

export interface PlantillasResponse {
  plantillas: DocumentoPlantilla[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PlantillasQueryParams {
  page?: number;
  limit?: number;
  tipo?: string;
  sedeId?: string;
}

/**
 * GET /api/documentacion/plantillas
 * Obtiene una lista paginada de todas las plantillas de documentos
 */
export async function obtenerPlantillas(params?: PlantillasQueryParams): Promise<PlantillasResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.tipo) queryParams.append('tipo', params.tipo);
    if (params?.sedeId) queryParams.append('sedeId', params.sedeId);

    const url = `${API_BASE_URL}/documentacion/plantillas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener plantillas');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    throw error;
  }
}

/**
 * POST /api/documentacion/plantillas
 * Crea una nueva plantilla de documento
 */
export async function crearPlantilla(plantilla: Omit<DocumentoPlantilla, '_id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<DocumentoPlantilla> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentacion/plantillas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plantilla),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al crear plantilla');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear plantilla:', error);
    throw error;
  }
}

/**
 * GET /api/documentacion/plantillas/:id
 * Obtiene los detalles completos de una plantilla específica por su ID
 */
export async function obtenerPlantillaPorId(id: string): Promise<DocumentoPlantilla> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentacion/plantillas/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener plantilla');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener plantilla:', error);
    throw error;
  }
}

/**
 * PUT /api/documentacion/plantillas/:id
 * Actualiza una plantilla de documento existente
 */
export async function actualizarPlantilla(
  id: string,
  plantilla: Partial<Omit<DocumentoPlantilla, '_id' | 'version' | 'createdAt' | 'updatedAt'>>
): Promise<DocumentoPlantilla> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentacion/plantillas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(plantilla),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al actualizar plantilla');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar plantilla:', error);
    throw error;
  }
}

/**
 * DELETE /api/documentacion/plantillas/:id
 * Elimina una plantilla de documento (borrado lógico recomendado)
 */
export async function eliminarPlantilla(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentacion/plantillas/${id}`, {
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

/**
 * GET /api/documentacion/placeholders
 * Devuelve una lista estructurada de todos los placeholders disponibles
 */
export async function obtenerPlaceholdersDisponibles(): Promise<PlaceholdersDisponibles> {
  try {
    const response = await fetch(`${API_BASE_URL}/documentacion/placeholders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener placeholders');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener placeholders:', error);
    throw error;
  }
}



