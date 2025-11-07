// API para gestión de recetas médicas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Medicamento {
  _id?: string;
  nombre_generico: string;
  nombre_comercial?: string;
  presentacion: string;
  concentracion?: string;
}

export interface MedicamentoReceta {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  indicaciones_especificas?: string;
}

export interface Receta {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    dni?: string;
  };
  odontologo: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  clinica: {
    _id: string;
    nombre: string;
  };
  fecha: string;
  folio: string;
  medicamentos: MedicamentoReceta[];
  indicaciones_generales?: string;
  estado: 'Activa' | 'Anulada';
  fechaCreacion?: string;
}

export interface DatosCrearReceta {
  pacienteId: string;
  odontologoId: string;
  medicamentos: MedicamentoReceta[];
  indicaciones_generales?: string;
}

/**
 * Crea una nueva receta médica
 */
export async function crearReceta(datos: DatosCrearReceta): Promise<Receta> {
  try {
    const response = await fetch(`${API_BASE_URL}/recetas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al crear la receta');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear receta:', error);
    throw error;
  }
}

/**
 * Obtiene el historial de recetas de un paciente
 */
export async function obtenerRecetasPorPaciente(pacienteId: string): Promise<Receta[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/recetas/paciente/${pacienteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al obtener las recetas del paciente');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener recetas por paciente:', error);
    throw error;
  }
}

/**
 * Obtiene los detalles de una receta específica por su ID
 */
export async function obtenerRecetaPorId(recetaId: string): Promise<Receta> {
  try {
    const response = await fetch(`${API_BASE_URL}/recetas/${recetaId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al obtener la receta');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener receta por ID:', error);
    throw error;
  }
}

/**
 * Anula una receta (soft delete)
 */
export async function anularReceta(recetaId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/recetas/${recetaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al anular la receta');
    }
  } catch (error) {
    console.error('Error al anular receta:', error);
    throw error;
  }
}

/**
 * Busca medicamentos en el Vademecum
 */
export async function buscarMedicamentos(termino: string): Promise<Medicamento[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/medicamentos/buscar?q=${encodeURIComponent(termino)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      // Fallback: retornar array vacío si hay error
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error al buscar medicamentos:', error);
    // En caso de error, retornar array vacío para no bloquear la UI
    return [];
  }
}

/**
 * Genera el PDF de una receta
 */
export async function generarPDFReceta(recetaId: string): Promise<Blob> {
  try {
    const response = await fetch(`${API_BASE_URL}/recetas/${recetaId}/pdf`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al generar el PDF de la receta');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error al generar PDF de receta:', error);
    throw error;
  }
}



