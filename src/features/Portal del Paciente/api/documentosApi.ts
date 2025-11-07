// API para gestionar documentos del paciente (consentimientos, recetas, etc.)

export interface Documento {
  _id: string;
  pacienteId: string;
  tipo: 'Consentimiento' | 'Receta' | 'PlanTratamiento' | 'Factura';
  nombreArchivo: string;
  urlAlmacenamiento: string;
  fechaCreacion: string;
  estado: 'Pendiente de Firma' | 'Firmado' | 'Generado';
  firmaDigital?: {
    data: string;
    fecha: string;
  };
  metadatos?: Record<string, any>;
}

export interface DocumentosResponse {
  documentos: Documento[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DescargaResponse {
  url: string;
  expiresIn: number;
}

const API_BASE_URL = '/api/portal/documentos';

// Obtener token del paciente desde localStorage
const getPatientToken = (): string | null => {
  return localStorage.getItem('patientToken');
};

// Headers para las peticiones autenticadas
const getAuthHeaders = (): HeadersInit => {
  const token = getPatientToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Obtiene una lista paginada de todos los documentos del paciente autenticado
 */
export const obtenerDocumentos = async (
  page: number = 1,
  limit: number = 10,
  tipo?: string
): Promise<DocumentosResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (tipo) {
    params.append('tipo', tipo);
  }

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener los documentos');
  }

  return response.json();
};

/**
 * Obtiene una URL de descarga segura para un documento específico
 */
export const obtenerUrlDescarga = async (
  documentoId: string
): Promise<DescargaResponse> => {
  const response = await fetch(`${API_BASE_URL}/${documentoId}/descargar`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener la URL de descarga');
  }

  return response.json();
};

/**
 * Descarga un documento directamente
 */
export const descargarDocumento = async (
  documentoId: string
): Promise<void> => {
  try {
    const { url } = await obtenerUrlDescarga(documentoId);
    
    // Crear un enlace temporal para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error al descargar el documento:', error);
    throw error;
  }
};

/**
 * Firma digitalmente un consentimiento
 */
export const firmarDocumento = async (
  documentoId: string,
  firmaData: string
): Promise<Documento> => {
  const response = await fetch(`${API_BASE_URL}/${documentoId}/firmar`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ firmaData }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al firmar el documento' }));
    throw new Error(error.message || 'Error al firmar el documento');
  }

  return response.json();
};



