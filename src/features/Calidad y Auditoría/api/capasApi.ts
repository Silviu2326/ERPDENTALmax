// API para gestión de Acciones Correctivas y Preventivas (CAPA)
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface AccionCorrectiva {
  descripcion: string;
  id_responsable: string;
  fecha_limite: string;
  fecha_completado?: string;
}

export interface AccionPreventiva {
  descripcion: string;
  id_responsable: string;
  fecha_limite: string;
  fecha_completado?: string;
}

export interface VerificacionEfectividad {
  descripcion: string;
  id_verificador: string;
  fecha: string;
  resultado: 'Efectiva' | 'No Efectiva' | 'Pendiente';
}

export interface HistorialCapa {
  _id?: string;
  fecha: string;
  usuario: {
    _id: string;
    nombre: string;
    apellidos?: string;
  };
  accion: string;
  comentario?: string;
  cambios?: Record<string, any>;
}

export interface Capa {
  _id?: string;
  id_capa: string;
  titulo: string;
  descripcion_incidente: string;
  fecha_deteccion: string;
  fuente: 'Auditoría Interna' | 'Queja de Paciente' | 'Revisión de Equipo' | 'Otro';
  id_clinica: string;
  clinica?: {
    _id: string;
    nombre: string;
  };
  id_responsable_investigacion?: string;
  responsable_investigacion?: {
    _id: string;
    nombre: string;
    apellidos?: string;
  };
  analisis_causa_raiz?: string;
  accion_correctiva?: AccionCorrectiva;
  accion_preventiva?: AccionPreventiva;
  verificacion_efectividad?: VerificacionEfectividad;
  estado: 'Abierta' | 'En Investigación' | 'Acciones Definidas' | 'En Implementación' | 'Pendiente de Verificación' | 'Cerrada';
  historial: HistorialCapa[];
  documentos_adjuntos: string[];
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NuevaCapa {
  titulo: string;
  descripcion_incidente: string;
  fecha_deteccion: string;
  fuente: Capa['fuente'];
  id_clinica: string;
}

export interface ActualizarCapa {
  titulo?: string;
  descripcion_incidente?: string;
  fecha_deteccion?: string;
  fuente?: Capa['fuente'];
  id_responsable_investigacion?: string;
  analisis_causa_raiz?: string;
  accion_correctiva?: AccionCorrectiva;
  accion_preventiva?: AccionPreventiva;
  verificacion_efectividad?: VerificacionEfectividad;
  estado?: Capa['estado'];
}

export interface FiltrosCapas {
  id_clinica?: string;
  estado?: string;
  id_responsable?: string;
  fechaInicio?: string;
  fechaFin?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
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

// Obtener listado paginado de CAPAs
export async function obtenerCapas(filtros: FiltrosCapas = {}): Promise<RespuestaPaginada<Capa>> {
  const params = new URLSearchParams();

  if (filtros.id_clinica) params.append('id_clinica', filtros.id_clinica);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.id_responsable) params.append('id_responsable', filtros.id_responsable);
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.sortBy) params.append('sortBy', filtros.sortBy);

  const response = await fetch(`${API_BASE_URL}/capas?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las CAPAs');
  }

  return response.json();
}

// Crear una nueva CAPA
export async function crearCapa(datos: NuevaCapa): Promise<Capa> {
  const response = await fetch(`${API_BASE_URL}/capas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la CAPA' }));
    throw new Error(error.message || 'Error al crear la CAPA');
  }

  return response.json();
}

// Obtener detalle de una CAPA
export async function obtenerCapaPorId(id: string): Promise<Capa> {
  const response = await fetch(`${API_BASE_URL}/capas/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la CAPA');
  }

  return response.json();
}

// Actualizar una CAPA
export async function actualizarCapa(id: string, datos: ActualizarCapa): Promise<Capa> {
  const response = await fetch(`${API_BASE_URL}/capas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar la CAPA' }));
    throw new Error(error.message || 'Error al actualizar la CAPA');
  }

  return response.json();
}

// Eliminar (soft delete) una CAPA
export async function eliminarCapa(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/capas/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la CAPA');
  }
}

// Subir documentos adjuntos a una CAPA
export async function subirAdjuntosCapa(id: string, archivos: File[]): Promise<string[]> {
  const formData = new FormData();
  archivos.forEach((archivo) => {
    formData.append('archivos', archivo);
  });

  const response = await fetch(`${API_BASE_URL}/capas/${id}/adjuntos`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al subir los archivos' }));
    throw new Error(error.message || 'Error al subir los archivos');
  }

  const resultado = await response.json();
  return resultado.urls || [];
}



