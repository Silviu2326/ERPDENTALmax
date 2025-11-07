// API para gestión de órdenes de prótesis
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export type EstadoProtesis = 
  | 'Prescrita' 
  | 'Enviada a Laboratorio' 
  | 'Recibida de Laboratorio' 
  | 'Prueba en Paciente' 
  | 'Ajustes en Laboratorio' 
  | 'Instalada' 
  | 'Cancelada';

export interface ArchivoAdjunto {
  _id?: string;
  nombreArchivo: string;
  url: string;
  subidoPor: {
    _id: string;
    nombre: string;
  };
  fechaSubida: string;
}

export interface HistorialEstado {
  _id?: string;
  estado: EstadoProtesis;
  fecha: string;
  usuario: {
    _id: string;
    nombre: string;
  };
  nota?: string;
}

export interface NotaComunicacion {
  _id?: string;
  contenido: string;
  autor: {
    _id: string;
    nombre: string;
    rol: string;
  };
  fecha: string;
  tipo: 'clinica' | 'laboratorio';
}

export interface Protesis {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    dni?: string;
    telefono?: string;
  };
  odontologo: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  laboratorio: {
    _id: string;
    nombre: string;
    contacto?: string;
    telefono?: string;
  };
  tratamiento: {
    _id: string;
    nombre: string;
  };
  tipoProtesis: string;
  material: string;
  color: string;
  estado: EstadoProtesis;
  fechaCreacion: string;
  fechaEnvioLab?: string;
  fechaPrevistaEntrega?: string;
  fechaRecepcionClinica?: string;
  notasClinica?: string;
  notasLaboratorio?: string;
  archivosAdjuntos: ArchivoAdjunto[];
  historialEstados: HistorialEstado[];
  notasComunicacion?: NotaComunicacion[];
}

export interface FiltrosProtesis {
  pacienteId?: string;
  estado?: EstadoProtesis;
  laboratorioId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  odontologoId?: string;
  tipoProtesis?: string;
}

export interface PaginacionProtesis {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RespuestaProtesis {
  protesis: Protesis[];
  paginacion: PaginacionProtesis;
}

export interface CrearOrdenProtesisData {
  pacienteId: string;
  tratamientoId: string;
  laboratorioId: string;
  tipoProtesis: string;
  material: string;
  color: string;
  fechaPrevistaEntrega?: string;
  notasClinica?: string;
  especificaciones?: {
    [key: string]: any;
  };
}

export interface ActualizarEstadoProtesisData {
  nuevoEstado: EstadoProtesis;
  nota?: string;
}

/**
 * Obtiene una lista paginada de todas las órdenes de prótesis
 */
export async function obtenerProtesis(
  filtros: FiltrosProtesis = {},
  page: number = 1,
  limit: number = 20
): Promise<RespuestaProtesis> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(filtros.pacienteId && { pacienteId: filtros.pacienteId }),
    ...(filtros.estado && { estado: filtros.estado }),
    ...(filtros.laboratorioId && { laboratorioId: filtros.laboratorioId }),
    ...(filtros.fechaInicio && { fechaInicio: filtros.fechaInicio }),
    ...(filtros.fechaFin && { fechaFin: filtros.fechaFin }),
    ...(filtros.odontologoId && { odontologoId: filtros.odontologoId }),
    ...(filtros.tipoProtesis && { tipoProtesis: filtros.tipoProtesis }),
  });

  const response = await fetch(`${API_BASE_URL}/protesis?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las órdenes de prótesis');
  }

  return response.json();
}

/**
 * Obtiene los detalles completos de una orden de prótesis específica
 */
export async function obtenerProtesisPorId(id: string): Promise<Protesis> {
  const response = await fetch(`${API_BASE_URL}/protesis/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener la orden de prótesis');
  }

  return response.json();
}

/**
 * Crea una nueva orden de prótesis
 */
export async function crearOrdenProtesis(
  data: CrearOrdenProtesisData
): Promise<Protesis> {
  const response = await fetch(`${API_BASE_URL}/protesis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la orden de prótesis');
  }

  return response.json();
}

/**
 * Actualiza el estado de una orden de prótesis
 */
export async function actualizarEstadoProtesis(
  id: string,
  data: ActualizarEstadoProtesisData
): Promise<Protesis> {
  const response = await fetch(`${API_BASE_URL}/protesis/${id}/estado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el estado de la prótesis');
  }

  return response.json();
}

/**
 * Sube uno o más archivos y los asocia a una orden de prótesis
 */
export async function subirArchivoProtesis(
  id: string,
  archivos: File[]
): Promise<Protesis> {
  const formData = new FormData();
  archivos.forEach((archivo) => {
    formData.append('archivos', archivo);
  });

  const response = await fetch(`${API_BASE_URL}/protesis/${id}/archivos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al subir los archivos');
  }

  return response.json();
}

/**
 * Añade una nota de comunicación a una orden de prótesis
 */
export async function añadirNotaComunicacion(
  id: string,
  contenido: string,
  tipo: 'clinica' | 'laboratorio'
): Promise<Protesis> {
  const response = await fetch(`${API_BASE_URL}/protesis/${id}/notas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ contenido, tipo }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al añadir la nota');
  }

  return response.json();
}



