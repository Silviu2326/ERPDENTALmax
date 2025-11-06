// API para gestión de informes de acreditación y normativas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface PlantillaInforme {
  id: string;
  nombre: string;
  descripcion: string;
  filtrosDisponibles: string[];
}

export interface FiltrosInforme {
  fechaInicio: Date;
  fechaFin: Date;
  clinicaId?: string;
  [key: string]: any;
}

export interface SolicitudGeneracionInforme {
  plantillaId: string;
  filtros: FiltrosInforme;
}

export interface RespuestaGeneracionInforme {
  jobId: string;
  mensaje: string;
}

export interface EstadoInforme {
  jobId: string;
  estado: 'procesando' | 'completado' | 'error';
  progreso: number;
  urlDescarga: string | null;
  error?: string;
}

export interface InformeGenerado {
  id: string;
  nombreInforme: string;
  fechaGeneracion: Date;
  estado: string;
  urlDescarga: string;
  plantillaId?: string;
  parametros?: Record<string, any>;
}

export interface PaginacionInformes {
  page: number;
  limit: number;
  sortBy?: string;
}

export interface RespuestaListaInformes {
  informes: InformeGenerado[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Obtiene la lista de todas las plantillas de informes disponibles
 */
export async function obtenerPlantillasInformes(): Promise<PlantillaInforme[]> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/calidad/informes/plantillas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener plantillas de informes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerPlantillasInformes:', error);
    throw error;
  }
}

/**
 * Inicia la generación asíncrona de un informe
 */
export async function solicitarGeneracionInforme(
  solicitud: SolicitudGeneracionInforme
): Promise<RespuestaGeneracionInforme> {
  try {
    const token = localStorage.getItem('token');
    
    // Convertir fechas a formato ISO string para el backend
    const body = {
      ...solicitud,
      filtros: {
        ...solicitud.filtros,
        fechaInicio: solicitud.filtros.fechaInicio.toISOString(),
        fechaFin: solicitud.filtros.fechaFin.toISOString(),
      },
    };

    const response = await fetch(`${API_BASE_URL}/calidad/informes/generar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al solicitar generación de informe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en solicitarGeneracionInforme:', error);
    throw error;
  }
}

/**
 * Consulta el estado de un trabajo de generación de informe
 */
export async function consultarEstadoInforme(jobId: string): Promise<EstadoInforme> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/calidad/informes/generados/${jobId}/estado`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al consultar estado del informe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en consultarEstadoInforme:', error);
    throw error;
  }
}

/**
 * Obtiene una lista paginada del historial de informes generados
 */
export async function listarInformesGenerados(
  paginacion?: PaginacionInformes
): Promise<RespuestaListaInformes> {
  try {
    const token = localStorage.getItem('token');
    
    const params = new URLSearchParams();
    if (paginacion) {
      params.append('page', paginacion.page.toString());
      params.append('limit', paginacion.limit.toString());
      if (paginacion.sortBy) {
        params.append('sortBy', paginacion.sortBy);
      }
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/calidad/informes/generados${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al listar informes generados');
    }

    const data = await response.json();
    
    // Convertir fechaGeneracion de string a Date
    if (data.informes && Array.isArray(data.informes)) {
      data.informes = data.informes.map((informe: InformeGenerado) => ({
        ...informe,
        fechaGeneracion: new Date(informe.fechaGeneracion),
      }));
    }

    return data;
  } catch (error) {
    console.error('Error en listarInformesGenerados:', error);
    throw error;
  }
}

/**
 * Descarga un informe generado usando su URL
 */
export async function descargarInforme(urlDescarga: string, nombreArchivo?: string): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(urlDescarga, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al descargar el informe');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo || 'informe.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error en descargarInforme:', error);
    throw error;
  }
}


