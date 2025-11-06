// API para gestión de prótesis removible: ajustes y entrega
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface AjusteProtesis {
  _id?: string;
  tratamientoId: string;
  odontologoId: string;
  fecha: string; // ISO Date
  descripcionAjuste: string;
  zonasAjustadas: string[];
  feedbackPaciente?: string;
  createdAt?: string;
}

export interface DetallesProtesis {
  tratamientoId: string;
  pacienteId: string;
  tipo: string;
  estadoProtesis: 'En Laboratorio' | 'En Prueba' | 'Ajustes' | 'Entregado';
  fechaEntregaReal?: string;
  notasEntrega?: string;
  ordenLaboratorioId?: string;
  paciente?: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
}

export interface NuevoAjuste {
  tratamientoId: string;
  odontologoId: string;
  fecha: string;
  descripcionAjuste: string;
  zonasAjustadas: string[];
  feedbackPaciente?: string;
}

export interface ConfirmacionEntrega {
  tratamientoId: string;
  fechaEntregaReal: string;
  notasFinales?: string;
}

/**
 * Obtiene el historial completo de ajustes para una prótesis asociada a un ID de tratamiento
 */
export async function obtenerHistorialAjustes(tratamientoId: string): Promise<AjusteProtesis[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/protesis/ajustes/tratamiento/${tratamientoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; // No hay ajustes aún
      }
      throw new Error(`Error al obtener historial de ajustes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener historial de ajustes:', error);
    throw error;
  }
}

/**
 * Registra una nueva sesión de ajuste para una prótesis
 */
export async function crearRegistroAjuste(ajuste: NuevoAjuste): Promise<AjusteProtesis> {
  try {
    const response = await fetch(`${API_BASE_URL}/protesis/ajustes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(ajuste),
    });

    if (!response.ok) {
      throw new Error(`Error al registrar ajuste: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al registrar ajuste:', error);
    throw error;
  }
}

/**
 * Marca la prótesis como entregada al paciente, actualizando el estado del tratamiento
 */
export async function confirmarEntregaProtesis(confirmacion: ConfirmacionEntrega): Promise<DetallesProtesis> {
  try {
    const response = await fetch(`${API_BASE_URL}/protesis/entrega/${confirmacion.tratamientoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        fechaEntregaReal: confirmacion.fechaEntregaReal,
        notasFinales: confirmacion.notasFinales,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al confirmar entrega: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al confirmar entrega:', error);
    throw error;
  }
}

/**
 * Obtiene los detalles generales de la prótesis y su estado actual
 */
export async function obtenerDetallesProtesis(tratamientoId: string): Promise<DetallesProtesis> {
  try {
    const response = await fetch(`${API_BASE_URL}/tratamientos/${tratamientoId}/detallesProtesis`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener detalles de prótesis: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener detalles de prótesis:', error);
    throw error;
  }
}


