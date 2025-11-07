// API para gestión de órdenes de fabricación
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export type EstadoFabricacion = 
  | 'Pendiente de Aceptación'
  | 'Recibido en laboratorio'
  | 'En Proceso'
  | 'Diseño CAD'
  | 'Fresado/Impresión'
  | 'Acabado y Pulido'
  | 'Control de Calidad'
  | 'Enviado a clínica'
  | 'Lista para Entrega'
  | 'Recibido en Clínica'
  | 'Cancelada';

export interface ArchivoAdjuntoFabricacion {
  _id?: string;
  nombre: string;
  url: string;
  fechaSubida?: string;
}

export interface HistorialEstadoFabricacion {
  _id?: string;
  estado: EstadoFabricacion;
  fecha: string;
  usuarioId: {
    _id: string;
    nombre: string;
  };
  notas?: string;
}

export interface EspecificacionesFabricacion {
  tipoProtesis: string;
  material: string;
  color: string;
  notasAdicionales?: string;
  [key: string]: any;
}

export interface OrdenFabricacion {
  _id?: string;
  pacienteId: {
    _id: string;
    nombre: string;
    apellidos: string;
    dni?: string;
    telefono?: string;
  };
  odontologoId: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  laboratorioId: {
    _id: string;
    nombre: string;
    contacto?: string;
    telefono?: string;
  };
  tratamientoId: {
    _id: string;
    nombre: string;
  };
  fechaCreacion: string;
  fechaEntregaEstimada?: string;
  especificaciones: EspecificacionesFabricacion;
  estadoActual: EstadoFabricacion;
  historialEstados: HistorialEstadoFabricacion[];
  archivosAdjuntos: ArchivoAdjuntoFabricacion[];
}

export interface FiltrosFabricacion {
  estado?: EstadoFabricacion;
  pacienteId?: string;
  laboratorioId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  odontologoId?: string;
}

export interface PaginacionFabricacion {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RespuestaFabricacion {
  ordenes: OrdenFabricacion[];
  paginacion: PaginacionFabricacion;
}

export interface CrearOrdenFabricacionData {
  pacienteId: string;
  tratamientoId: string;
  odontologoId: string;
  laboratorioId: string;
  especificaciones: EspecificacionesFabricacion;
  fechaEntregaEstimada?: string;
}

export interface ActualizarEstadoFabricacionData {
  nuevoEstado: EstadoFabricacion;
  notas?: string;
  usuarioId: string;
}

/**
 * Obtiene una lista paginada y filtrada de todas las órdenes de fabricación
 */
export async function obtenerOrdenesFabricacion(
  filtros: FiltrosFabricacion = {},
  page: number = 1,
  limit: number = 20
): Promise<RespuestaFabricacion> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(filtros.estado && { estado: filtros.estado }),
    ...(filtros.pacienteId && { pacienteId: filtros.pacienteId }),
    ...(filtros.laboratorioId && { laboratorioId: filtros.laboratorioId }),
    ...(filtros.fechaInicio && { fechaInicio: filtros.fechaInicio }),
    ...(filtros.fechaFin && { fechaFin: filtros.fechaFin }),
    ...(filtros.odontologoId && { odontologoId: filtros.odontologoId }),
  });

  const response = await fetch(`${API_BASE_URL}/fabricacion?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las órdenes de fabricación');
  }

  return response.json();
}

/**
 * Obtiene los detalles completos de una orden de fabricación específica, incluyendo su historial de estados
 */
export async function obtenerOrdenFabricacionPorId(id: string): Promise<OrdenFabricacion> {
  const response = await fetch(`${API_BASE_URL}/fabricacion/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener la orden de fabricación');
  }

  return response.json();
}

/**
 * Crea una nueva orden de fabricación
 */
export async function crearOrdenFabricacion(
  data: CrearOrdenFabricacionData
): Promise<OrdenFabricacion> {
  const response = await fetch(`${API_BASE_URL}/fabricacion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la orden de fabricación');
  }

  return response.json();
}

/**
 * Actualiza el estado de una orden de fabricación. Añade una nueva entrada al historial de estados.
 */
export async function actualizarEstadoFabricacion(
  id: string,
  data: ActualizarEstadoFabricacionData
): Promise<OrdenFabricacion> {
  const response = await fetch(`${API_BASE_URL}/fabricacion/${id}/estado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el estado de la orden');
  }

  return response.json();
}



