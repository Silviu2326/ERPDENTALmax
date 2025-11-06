// API para gestión de incidencias y no conformidades
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface AccionCorrectiva {
  _id?: string;
  descripcion: string;
  responsable: string;
  fecha_limite: string;
  completada: boolean;
  fecha_completada?: string;
  observaciones?: string;
}

export interface AccionPreventiva {
  _id?: string;
  descripcion: string;
  responsable: string;
  fecha_limite: string;
  completada: boolean;
  fecha_completada?: string;
  observaciones?: string;
}

export interface EvidenciaAdjunta {
  _id?: string;
  url: string;
  nombre_archivo: string;
  fecha_subida: string;
  tipo_archivo?: string;
}

export interface Incidencia {
  _id?: string;
  folio: string;
  tipo: 'No Conformidad Producto' | 'Incidencia Clínica' | 'Queja Paciente' | 'Incidente Seguridad';
  descripcion_detallada: string;
  fecha_deteccion: string;
  fecha_cierre?: string;
  estado: 'Abierta' | 'En Investigación' | 'Resuelta' | 'Cerrada';
  clinica: {
    _id: string;
    nombre: string;
  };
  reportado_por: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  analisis_causa_raiz?: string;
  acciones_correctivas: AccionCorrectiva[];
  acciones_preventivas: AccionPreventiva[];
  evidencia_adjunta: EvidenciaAdjunta[];
  area_afectada?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FiltrosIncidencias {
  clinicaId?: string;
  estado?: string;
  tipo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface EstadisticasIncidencias {
  totalAbiertas: number;
  totalEnInvestigacion: number;
  totalResueltas: number;
  totalCerradas: number;
  cerradasUltimoMes: number;
  porTipo: Array<{
    tipo: string;
    cantidad: number;
  }>;
  porClinica: Array<{
    clinicaId: string;
    clinicaNombre: string;
    cantidad: number;
  }>;
}

export interface NuevaIncidencia {
  tipo: Incidencia['tipo'];
  descripcion_detallada: string;
  fecha_deteccion: string;
  clinicaId: string;
  reportado_por: string;
  area_afectada?: string;
}

export interface ActualizarIncidencia {
  tipo?: Incidencia['tipo'];
  descripcion_detallada?: string;
  fecha_deteccion?: string;
  estado?: Incidencia['estado'];
  analisis_causa_raiz?: string;
  acciones_correctivas?: AccionCorrectiva[];
  acciones_preventivas?: AccionPreventiva[];
  evidencia_adjunta?: EvidenciaAdjunta[];
  area_afectada?: string;
  fecha_cierre?: string;
}

export interface RespuestaPaginada<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Crear una nueva incidencia
export async function crearIncidencia(datos: NuevaIncidencia): Promise<Incidencia> {
  const response = await fetch(`${API_BASE_URL}/incidencias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la incidencia' }));
    throw new Error(error.message || 'Error al crear la incidencia');
  }

  return response.json();
}

// Obtener listado paginado de incidencias
export async function obtenerIncidencias(filtros: FiltrosIncidencias = {}): Promise<RespuestaPaginada<Incidencia>> {
  const params = new URLSearchParams();

  if (filtros.clinicaId) params.append('clinicaId', filtros.clinicaId);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.tipo) params.append('tipo', filtros.tipo);
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.sortBy) params.append('sortBy', filtros.sortBy);
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

  const response = await fetch(`${API_BASE_URL}/incidencias?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las incidencias');
  }

  return response.json();
}

// Obtener detalle de una incidencia
export async function obtenerIncidenciaPorId(id: string): Promise<Incidencia> {
  const response = await fetch(`${API_BASE_URL}/incidencias/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la incidencia');
  }

  return response.json();
}

// Actualizar una incidencia
export async function actualizarIncidencia(id: string, datos: ActualizarIncidencia): Promise<Incidencia> {
  const response = await fetch(`${API_BASE_URL}/incidencias/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar la incidencia' }));
    throw new Error(error.message || 'Error al actualizar la incidencia');
  }

  return response.json();
}

// Eliminar (soft delete) una incidencia
export async function eliminarIncidencia(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/incidencias/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la incidencia');
  }
}

// Obtener estadísticas para el dashboard
export async function obtenerEstadisticasIncidencias(filtros: {
  clinicaId?: string;
  fechaInicio?: string;
  fechaFin?: string;
} = {}): Promise<EstadisticasIncidencias> {
  const params = new URLSearchParams();

  if (filtros.clinicaId) params.append('clinicaId', filtros.clinicaId);
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

  const response = await fetch(`${API_BASE_URL}/incidencias/stats/dashboard?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las estadísticas de incidencias');
  }

  return response.json();
}


