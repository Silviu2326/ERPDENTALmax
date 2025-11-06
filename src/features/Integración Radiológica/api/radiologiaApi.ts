// API para gestión de estudios radiológicos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces según el documento Markdown
export interface Radiologia {
  _id: string;
  paciente: string | { _id: string; nombre: string };
  odontologo?: string | { _id: string; nombre: string };
  tipoRadiografia: 'Periapical' | 'Bitewing' | 'Oclusal' | 'Panorámica' | 'CBCT';
  fechaToma: string;
  urlArchivo: string;
  nombreArchivoOriginal: string;
  tamañoArchivo: number;
  notas?: string;
  diagnosticoAsociado?: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
}

export interface RadiografiaEstudio {
  _id: string;
  paciente: string;
  fechaEstudio: string;
  tipoEstudio: 'Panorámica' | 'Periapical' | 'CBCT' | 'Cefalometría' | 'Oclusal' | 'Aleta de mordida';
  descripcion?: string;
  dicomStudyInstanceUID: string;
  series?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RadiografiaSerie {
  _id: string;
  estudio: string;
  modalidad: 'DX' | 'CT';
  dicomSeriesInstanceUID: string;
  imagenes?: string[];
  createdAt?: string;
}

export interface RadiografiaImagen {
  _id: string;
  serie: string;
  dicomSOPInstanceUID: string;
  numeroImagen: number;
  storagePath: string;
  anotaciones?: AnotacionImagen[];
  createdAt?: string;
}

export interface AnotacionImagen {
  _id?: string;
  tipo: 'texto' | 'medida' | 'dibujo' | 'flecha';
  datos: {
    texto?: string;
    coordenadas?: { x: number; y: number }[];
    medida?: number;
    unidad?: string;
    [key: string]: any;
  };
  creadoPor: string;
  fecha: string;
}

export interface DetalleEstudio {
  _id: string;
  paciente: string;
  fechaEstudio: string;
  tipoEstudio: string;
  descripcion?: string;
  dicomStudyInstanceUID: string;
  series: Array<{
    _id: string;
    modalidad: string;
    dicomSeriesInstanceUID: string;
    imagenes: Array<{
      _id: string;
      dicomSOPInstanceUID: string;
      numeroImagen: number;
      storagePath: string;
      anotaciones?: AnotacionImagen[];
    }>;
  }>;
}

/**
 * Obtiene la lista de estudios radiológicos de un paciente
 */
export async function obtenerEstudiosPorPaciente(pacienteId: string): Promise<RadiografiaEstudio[]> {
  const response = await fetch(`${API_BASE_URL}/radiologia/pacientes/${pacienteId}/estudios`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener estudios' }));
    throw new Error(error.message || 'Error al obtener estudios del paciente');
  }

  return response.json();
}

/**
 * Obtiene los detalles completos de un estudio radiológico
 */
export async function obtenerDetalleEstudio(estudioId: string): Promise<DetalleEstudio> {
  const response = await fetch(`${API_BASE_URL}/radiologia/estudios/${estudioId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener detalle del estudio' }));
    throw new Error(error.message || 'Error al obtener detalle del estudio');
  }

  return response.json();
}

/**
 * Descarga el archivo DICOM de una imagen específica
 */
export async function obtenerArchivoDicom(imagenId: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/radiologia/imagenes/${imagenId}/archivo`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener archivo DICOM' }));
    throw new Error(error.message || 'Error al descargar archivo DICOM');
  }

  return response.blob();
}

/**
 * Crea una nueva anotación sobre una imagen
 */
export async function crearAnotacion(
  imagenId: string,
  anotacion: Omit<AnotacionImagen, '_id' | 'fecha'>
): Promise<AnotacionImagen> {
  const response = await fetch(`${API_BASE_URL}/radiologia/imagenes/${imagenId}/anotaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(anotacion),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear anotación' }));
    throw new Error(error.message || 'Error al guardar anotación');
  }

  return response.json();
}

/**
 * Obtiene una lista paginada de todos los registros radiológicos de un paciente específico
 * Permite filtrar por tipo de radiografía y rango de fechas
 */
export interface FiltrosRadiologias {
  page?: number;
  limit?: number;
  tipo?: Radiologia['tipoRadiografia'];
  fechaDesde?: string; // YYYY-MM-DD
  fechaHasta?: string; // YYYY-MM-DD
}

export interface RespuestaRadiologias {
  radiologias: Radiologia[];
  paginacion: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function obtenerRadiologiasPorPaciente(
  pacienteId: string,
  filtros?: FiltrosRadiologias
): Promise<RespuestaRadiologias> {
  const params = new URLSearchParams();
  if (filtros?.page) params.append('page', filtros.page.toString());
  if (filtros?.limit) params.append('limit', filtros.limit.toString());
  if (filtros?.tipo) params.append('tipo', filtros.tipo);
  if (filtros?.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
  if (filtros?.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/pacientes/${pacienteId}/radiologias${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener radiologías' }));
    throw new Error(error.message || 'Error al obtener radiologías del paciente');
  }

  return response.json();
}

/**
 * Sube un nuevo archivo de imagen radiológica y crea su registro de metadatos
 */
export interface DatosCargaRadiografia {
  file: File;
  tipoRadiografia: Radiologia['tipoRadiografia'];
  fechaToma: string; // YYYY-MM-DD
  notas?: string;
}

export async function crearRadiologia(
  pacienteId: string,
  datos: DatosCargaRadiografia
): Promise<Radiologia> {
  const formData = new FormData();
  formData.append('file', datos.file);
  formData.append('tipoRadiografia', datos.tipoRadiografia);
  formData.append('fechaToma', datos.fechaToma);
  if (datos.notas) {
    formData.append('notas', datos.notas);
  }

  const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/radiologias`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al subir radiografía' }));
    throw new Error(error.message || 'Error al subir radiografía');
  }

  return response.json();
}

/**
 * Obtiene los detalles completos y metadatos de un único registro radiológico
 */
export async function obtenerRadiologiaPorId(radiologiaId: string): Promise<Radiologia> {
  const response = await fetch(`${API_BASE_URL}/radiologias/${radiologiaId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener radiografía' }));
    throw new Error(error.message || 'Error al obtener radiografía');
  }

  return response.json();
}

/**
 * Actualiza los metadatos de un registro radiológico existente
 */
export interface DatosActualizacionRadiologia {
  notas?: string;
  diagnosticoAsociado?: string;
}

export async function actualizarRadiologia(
  radiologiaId: string,
  datos: DatosActualizacionRadiologia
): Promise<Radiologia> {
  const response = await fetch(`${API_BASE_URL}/radiologias/${radiologiaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar radiografía' }));
    throw new Error(error.message || 'Error al actualizar radiografía');
  }

  return response.json();
}

/**
 * Elimina un registro radiológico y su archivo asociado del almacenamiento
 */
export async function eliminarRadiologia(radiologiaId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/radiologias/${radiologiaId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al eliminar radiografía' }));
    throw new Error(error.message || 'Error al eliminar radiografía');
  }
}

