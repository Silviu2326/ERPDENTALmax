// API para gestión de controles postoperatorios de endodoncia
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface AdjuntoRadiografia {
  url: string;
  nombreArchivo: string;
  fechaSubida: string;
}

export interface ControlEndodontico {
  _id?: string;
  tratamientoId: string;
  pacienteId: string;
  profesionalId: string;
  fechaControl: string;
  sintomatologia: 'Asintomático' | 'Dolor espontáneo' | 'Sensibilidad a la percusión' | 'Sensibilidad a la palpación';
  signosClinicos: 'Ninguno' | 'Fístula' | 'Edema' | 'Movilidad aumentada';
  hallazgosRadiograficos: string;
  diagnosticoEvolutivo: 'Éxito (curación)' | 'En progreso' | 'Dudoso' | 'Fracaso';
  observaciones?: string;
  adjuntos: AdjuntoRadiografia[];
  createdAt?: string;
}

export interface NuevoControlEndodontico {
  tratamientoId: string;
  pacienteId: string;
  fechaControl: string;
  sintomatologia: ControlEndodontico['sintomatologia'];
  signosClinicos: ControlEndodontico['signosClinicos'];
  hallazgosRadiograficos: string;
  diagnosticoEvolutivo: ControlEndodontico['diagnosticoEvolutivo'];
  observaciones?: string;
  adjuntos?: File[];
}

export interface ActualizarControlEndodontico {
  fechaControl?: string;
  sintomatologia?: ControlEndodontico['sintomatologia'];
  signosClinicos?: ControlEndodontico['signosClinicos'];
  hallazgosRadiograficos?: string;
  diagnosticoEvolutivo?: ControlEndodontico['diagnosticoEvolutivo'];
  observaciones?: string;
  adjuntos?: File[];
}

/**
 * Obtiene todos los controles postoperatorios asociados a un tratamiento de endodoncia
 */
export async function obtenerControlesPorTratamiento(
  tratamientoId: string
): Promise<ControlEndodontico[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/especialidades-clinicas/endodoncia/tratamientos/${tratamientoId}/controles`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return []; // No hay controles aún
      }
      throw new Error(`Error al obtener controles: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener controles postoperatorios:', error);
    throw error;
  }
}

/**
 * Crea un nuevo control postoperatorio
 */
export async function crearControlEndodontico(
  datos: NuevoControlEndodontico
): Promise<ControlEndodontico> {
  try {
    // Si hay archivos adjuntos, usar FormData
    if (datos.adjuntos && datos.adjuntos.length > 0) {
      const formData = new FormData();
      formData.append('tratamientoId', datos.tratamientoId);
      formData.append('pacienteId', datos.pacienteId);
      formData.append('fechaControl', datos.fechaControl);
      formData.append('sintomatologia', datos.sintomatologia);
      formData.append('signosClinicos', datos.signosClinicos);
      formData.append('hallazgosRadiograficos', datos.hallazgosRadiograficos);
      formData.append('diagnosticoEvolutivo', datos.diagnosticoEvolutivo);
      if (datos.observaciones) {
        formData.append('observaciones', datos.observaciones);
      }

      // Agregar archivos
      datos.adjuntos.forEach((archivo, index) => {
        formData.append(`adjuntos`, archivo);
      });

      const response = await fetch(
        `${API_BASE_URL}/especialidades-clinicas/endodoncia/controles`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error al crear control' }));
        throw new Error(error.message || 'Error al crear control postoperatorio');
      }

      return await response.json();
    } else {
      // Sin archivos, usar JSON
      const response = await fetch(
        `${API_BASE_URL}/especialidades-clinicas/endodoncia/controles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(datos),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error al crear control' }));
        throw new Error(error.message || 'Error al crear control postoperatorio');
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error al crear control postoperatorio:', error);
    throw error;
  }
}

/**
 * Actualiza un control postoperatorio existente
 */
export async function actualizarControlEndodontico(
  controlId: string,
  datos: ActualizarControlEndodontico
): Promise<ControlEndodontico> {
  try {
    // Si hay archivos adjuntos, usar FormData
    if (datos.adjuntos && datos.adjuntos.length > 0) {
      const formData = new FormData();
      
      if (datos.fechaControl) formData.append('fechaControl', datos.fechaControl);
      if (datos.sintomatologia) formData.append('sintomatologia', datos.sintomatologia);
      if (datos.signosClinicos) formData.append('signosClinicos', datos.signosClinicos);
      if (datos.hallazgosRadiograficos) formData.append('hallazgosRadiograficos', datos.hallazgosRadiograficos);
      if (datos.diagnosticoEvolutivo) formData.append('diagnosticoEvolutivo', datos.diagnosticoEvolutivo);
      if (datos.observaciones) formData.append('observaciones', datos.observaciones);

      // Agregar archivos
      datos.adjuntos.forEach((archivo) => {
        formData.append('adjuntos', archivo);
      });

      const response = await fetch(
        `${API_BASE_URL}/especialidades-clinicas/endodoncia/controles/${controlId}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error al actualizar control' }));
        throw new Error(error.message || 'Error al actualizar control postoperatorio');
      }

      return await response.json();
    } else {
      // Sin archivos, usar JSON
      const response = await fetch(
        `${API_BASE_URL}/especialidades-clinicas/endodoncia/controles/${controlId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(datos),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error al actualizar control' }));
        throw new Error(error.message || 'Error al actualizar control postoperatorio');
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error al actualizar control postoperatorio:', error);
    throw error;
  }
}

/**
 * Elimina un control postoperatorio (soft delete)
 */
export async function eliminarControlEndodontico(controlId: string): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/especialidades-clinicas/endodoncia/controles/${controlId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al eliminar control' }));
      throw new Error(error.message || 'Error al eliminar control postoperatorio');
    }
  } catch (error) {
    console.error('Error al eliminar control postoperatorio:', error);
    throw error;
  }
}


