// API para subida de imágenes radiológicas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface PacienteSimplificado {
  _id: string;
  nombre: string;
  apellido: string;
  dni: string;
}

export interface MetadataImagen {
  nombreOriginal: string;
  tipoImagen: string;
  notas?: string;
}

export interface ImagenSubida {
  _id: string;
  pacienteId: string;
  url: string;
  nombreArchivo: string;
  tipoImagen: string;
  fechaCaptura?: string;
  fechaSubida: string;
  subidoPor: string;
  notas?: string;
}

export interface RespuestaSubidaImagenes {
  mensaje: string;
  imagenes: ImagenSubida[];
}

/**
 * Busca pacientes por término de búsqueda (nombre, apellido, DNI)
 */
export async function buscarPacientes(termino: string): Promise<PacienteSimplificado[]> {
  const response = await fetch(`${API_BASE_URL}/pacientes/buscar?termino=${encodeURIComponent(termino)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al buscar pacientes' }));
    throw new Error(error.message || 'Error al buscar pacientes');
  }

  return response.json();
}

/**
 * Sube una o más imágenes radiológicas y las asocia a un paciente
 */
export async function subirImagenes(
  pacienteId: string,
  archivos: File[],
  metadatos: MetadataImagen[]
): Promise<RespuestaSubidaImagenes> {
  const formData = new FormData();
  formData.append('pacienteId', pacienteId);
  formData.append('metadata', JSON.stringify(metadatos));

  // Agregar todos los archivos
  archivos.forEach((archivo) => {
    formData.append('imagenes', archivo);
  });

  const response = await fetch(`${API_BASE_URL}/imagenes-radiologicas/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al subir imágenes' }));
    throw new Error(error.message || 'Error al subir las imágenes');
  }

  return response.json();
}

/**
 * Obtiene las imágenes radiológicas de un paciente
 */
export async function obtenerImagenesPorPaciente(pacienteId: string): Promise<ImagenSubida[]> {
  const response = await fetch(`${API_BASE_URL}/imagenes-radiologicas/paciente/${pacienteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener imágenes' }));
    throw new Error(error.message || 'Error al obtener imágenes del paciente');
  }

  return response.json();
}



