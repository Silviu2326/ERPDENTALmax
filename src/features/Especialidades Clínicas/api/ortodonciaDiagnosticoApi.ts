// API para gestión de registros de diagnóstico ortodóntico
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface ArchivoDiagnostico {
  _id?: string;
  nombreArchivo: string;
  url: string;
  tipo: string; // 'Foto Intraoral' | 'Foto Extraoral' | 'Radiografía' | 'Modelo 3D'
  subtipo?: string; // 'Oclusal Superior' | 'Oclusal Inferior' | 'Frontal' | 'Perfil' | 'Cefalométrica' | 'Panorámica' | 'STL' | 'OBJ'
  fechaSubida?: string;
}

export interface OrtodonciaDiagnostico {
  _id?: string;
  pacienteId: string;
  fecha: string;
  etapa: 'Inicial' | 'Progreso' | 'Final' | 'Retención';
  notas?: string;
  archivos: ArchivoDiagnostico[];
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

/**
 * Obtiene todos los conjuntos de registros de diagnóstico ortodóntico para un paciente específico
 */
export async function obtenerDiagnosticosPorPaciente(
  pacienteId: string
): Promise<OrtodonciaDiagnostico[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/ortodoncia/diagnosticos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener diagnósticos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener diagnósticos de ortodoncia:', error);
    throw error;
  }
}

/**
 * Crea un nuevo conjunto de registros de diagnóstico con múltiples archivos
 */
export async function crearDiagnosticoConArchivos(
  pacienteId: string,
  diagnostico: {
    fecha: Date;
    etapa: 'Inicial' | 'Progreso' | 'Final' | 'Retención';
    notas?: string;
    archivos: File[];
  }
): Promise<OrtodonciaDiagnostico> {
  try {
    const formData = new FormData();
    formData.append('fecha', diagnostico.fecha.toISOString());
    formData.append('etapa', diagnostico.etapa);
    if (diagnostico.notas) {
      formData.append('notas', diagnostico.notas);
    }
    
    // Agregar todos los archivos
    diagnostico.archivos.forEach((archivo, index) => {
      formData.append(`archivos`, archivo);
    });

    const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/ortodoncia/diagnosticos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // No establecer Content-Type para FormData, el navegador lo hace automáticamente
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error al crear diagnóstico: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear diagnóstico de ortodoncia:', error);
    throw error;
  }
}

/**
 * Elimina un conjunto completo de registros de diagnóstico
 */
export async function eliminarDiagnosticoCompleto(
  diagnosticoId: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/ortodoncia/diagnosticos/${diagnosticoId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar diagnóstico: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al eliminar diagnóstico de ortodoncia:', error);
    throw error;
  }
}

/**
 * Actualiza la metadata de un archivo específico
 */
export async function actualizarMetadataArchivo(
  diagnosticoId: string,
  archivoId: string,
  metadata: {
    tipo?: string;
    subtipo?: string;
  }
): Promise<OrtodonciaDiagnostico> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ortodoncia/diagnosticos/${diagnosticoId}/archivos/${archivoId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al actualizar metadata del archivo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar metadata del archivo:', error);
    throw error;
  }
}

/**
 * Elimina un único archivo de un conjunto de diagnóstico
 */
export async function eliminarArchivo(
  diagnosticoId: string,
  archivoId: string
): Promise<OrtodonciaDiagnostico> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ortodoncia/diagnosticos/${diagnosticoId}/archivos/${archivoId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al eliminar archivo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    throw error;
  }
}


