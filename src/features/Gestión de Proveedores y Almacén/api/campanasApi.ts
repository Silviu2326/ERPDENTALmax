// API para gestión de campañas de marketing
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Campana {
  _id?: string;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  presupuesto: number;
  costoReal?: number;
  canal: string;
  estado: 'Planificada' | 'Activa' | 'Finalizada' | 'Archivada';
  clinicaId: string;
  pacientesAsociados?: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NuevaCampana {
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  presupuesto: number;
  canal: string;
  clinicaId: string;
}

export interface FiltrosCampana {
  status?: string;
  clinicaId?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface EstadisticasDashboard {
  inversionTotal: number;
  totalPacientesCaptados: number;
  cpaPromedio: number;
  roiGlobal: number;
  ingresosGenerados: number;
}

export interface CampanaConMetricas extends Campana {
  pacientesAsociadosCount?: number;
  cpa?: number;
  roi?: number;
  ingresosGenerados?: number;
}

// Obtener todas las campañas con filtros opcionales
export async function obtenerCampanas(filtros?: FiltrosCampana): Promise<CampanaConMetricas[]> {
  const params = new URLSearchParams();
  
  if (filtros?.status) {
    params.append('status', filtros.status);
  }
  if (filtros?.clinicaId) {
    params.append('clinicaId', filtros.clinicaId);
  }
  if (filtros?.fechaInicio) {
    params.append('fechaInicio', filtros.fechaInicio);
  }
  if (filtros?.fechaFin) {
    params.append('fechaFin', filtros.fechaFin);
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/campanas${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las campañas');
  }

  return response.json();
}

// Obtener detalle de una campaña específica
export async function obtenerCampanaPorId(id: string): Promise<Campana> {
  const response = await fetch(`${API_BASE_URL}/campanas/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el detalle de la campaña');
  }

  return response.json();
}

// Crear una nueva campaña
export async function crearCampana(campana: NuevaCampana): Promise<Campana> {
  const response = await fetch(`${API_BASE_URL}/campanas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(campana),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la campaña');
  }

  return response.json();
}

// Actualizar una campaña existente
export async function actualizarCampana(id: string, campana: Partial<NuevaCampana>): Promise<Campana> {
  const response = await fetch(`${API_BASE_URL}/campanas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(campana),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la campaña');
  }

  return response.json();
}

// Eliminar o archivar una campaña
export async function eliminarCampana(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/campanas/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar la campaña');
  }
}

// Obtener estadísticas del dashboard
export async function obtenerEstadisticasDashboard(filtros?: { clinicaId?: string; dateRange?: string }): Promise<EstadisticasDashboard> {
  const params = new URLSearchParams();
  
  if (filtros?.clinicaId) {
    params.append('clinicaId', filtros.clinicaId);
  }
  if (filtros?.dateRange) {
    params.append('dateRange', filtros.dateRange);
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/campanas/stats/dashboard${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las estadísticas del dashboard');
  }

  return response.json();
}



