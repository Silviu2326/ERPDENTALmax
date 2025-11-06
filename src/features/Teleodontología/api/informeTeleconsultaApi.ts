// API para gestión de informes de teleconsulta
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface TeleconsultaDetalle {
  _id: string;
  pacienteId: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    telefono?: string;
    email?: string;
    fechaNacimiento?: string;
    dni?: string;
  };
  odontologoId: string;
  odontologo: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  fechaHoraInicio: string;
  fechaHoraFin?: string;
  estado: 'Programada' | 'Confirmada' | 'En Curso' | 'Completada' | 'Cancelada' | 'No Asistió' | 'Informe Pendiente';
  motivoConsulta?: string;
  notasPrevias?: string;
  informe?: InformeTeleconsulta;
}

export interface InformeTeleconsulta {
  diagnosticoPresuntivo?: string;
  observaciones?: string;
  planTratamientoRecomendado?: string;
  prescripciones?: Prescripcion[];
  archivosAdjuntos?: ArchivoAdjunto[];
  fechaCreacion?: string;
  fechaActualizacion?: string;
  firmaDigital?: string;
  esBorrador?: boolean;
}

export interface Prescripcion {
  medicamento: string;
  dosis?: string;
  frecuencia?: string;
  duracion?: string;
  instrucciones?: string;
}

export interface ArchivoAdjunto {
  _id?: string;
  nombre: string;
  url: string;
  tipo?: string;
  tamano?: number;
  fechaSubida?: string;
}

export interface CrearInformeData {
  diagnosticoPresuntivo?: string;
  observaciones?: string;
  planTratamientoRecomendado?: string;
  prescripciones?: Prescripcion[];
  firmaDigital?: string;
  esBorrador?: boolean;
}

export interface ActualizarInformeData extends CrearInformeData {
  // Mismo formato que CrearInformeData
}

/**
 * Obtiene los detalles completos de una teleconsulta específica, incluyendo el informe si existe
 */
export async function obtenerTeleconsultaDetalle(id: string): Promise<TeleconsultaDetalle> {
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
 * Crea y guarda el informe final para una teleconsulta
 */
export async function crearInformeTeleconsulta(
  teleconsultaId: string,
  datos: CrearInformeData
): Promise<InformeTeleconsulta> {
  try {
    const response = await fetch(`${API_BASE_URL}/teleconsultas/${teleconsultaId}/informe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear informe: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear informe:', error);
    throw error;
  }
}

/**
 * Actualiza un informe que fue guardado previamente como borrador
 */
export async function actualizarInformeTeleconsulta(
  teleconsultaId: string,
  datos: ActualizarInformeData
): Promise<InformeTeleconsulta> {
  try {
    const response = await fetch(`${API_BASE_URL}/teleconsultas/${teleconsultaId}/informe`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar informe: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar informe:', error);
    throw error;
  }
}

/**
 * Sube y asocia uno o más archivos al informe de la teleconsulta
 */
export async function subirArchivosInforme(
  teleconsultaId: string,
  archivos: File[]
): Promise<ArchivoAdjunto[]> {
  try {
    const formData = new FormData();
    archivos.forEach((archivo) => {
      formData.append('archivos', archivo);
    });

    const response = await fetch(`${API_BASE_URL}/teleconsultas/${teleconsultaId}/informe/adjuntos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al subir archivos: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al subir archivos:', error);
    throw error;
  }
}

/**
 * Elimina un archivo adjunto del informe
 */
export async function eliminarArchivoAdjunto(
  teleconsultaId: string,
  archivoId: string
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/teleconsultas/${teleconsultaId}/informe/adjuntos/${archivoId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al eliminar archivo: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    throw error;
  }
}


