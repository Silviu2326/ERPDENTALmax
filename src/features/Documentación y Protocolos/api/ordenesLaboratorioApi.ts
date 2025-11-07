// API para gestión de órdenes de laboratorio
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export type EstadoOrden = 
  | 'Borrador' 
  | 'Enviada' 
  | 'Recibida' 
  | 'En Proceso' 
  | 'Control Calidad' 
  | 'Enviada a Clínica' 
  | 'Recibida en Clínica' 
  | 'Completada';

export interface ArchivoAdjunto {
  _id?: string;
  nombreArchivo: string;
  url: string;
  fechaSubida: string;
  tipo?: string;
  tamaño?: number;
}

export interface HistorialEstado {
  _id?: string;
  estado: EstadoOrden;
  fecha: string;
  usuario: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  notas?: string;
}

export interface OrdenLaboratorio {
  _id?: string;
  paciente: {
    _id: string;
    nombre: string;
    apellidos: string;
    dni?: string;
  };
  odontologo: {
    _id: string;
    nombre: string;
    apellidos: string;
  };
  laboratorio: {
    _id: string;
    nombre: string;
    personaContacto?: string;
    email?: string;
    telefono?: string;
  };
  tratamientoAsociado?: {
    _id: string;
    nombre: string;
  };
  fechaCreacion: string;
  fechaEnvio?: string;
  fechaEntregaPrevista?: string;
  fechaEntregaReal?: string;
  estado: EstadoOrden;
  tipoTrabajo: string;
  materiales?: string;
  color?: string;
  instrucciones?: string;
  adjuntos: ArchivoAdjunto[];
  historialEstados: HistorialEstado[];
}

export interface NuevaOrdenLaboratorio {
  pacienteId: string;
  laboratorioId: string;
  odontologoId: string;
  tratamientoAsociadoId?: string;
  tipoTrabajo: string;
  materiales?: string;
  color?: string;
  instrucciones?: string;
  fechaEntregaPrevista?: string;
  estado?: EstadoOrden;
}

export interface FiltrosOrdenes {
  page?: number;
  limit?: number;
  estado?: EstadoOrden;
  pacienteId?: string;
  laboratorioId?: string;
  odontologoId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface RespuestaPaginada {
  ordenes: OrdenLaboratorio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Obtener lista paginada de órdenes
export async function obtenerOrdenes(filtros: FiltrosOrdenes = {}): Promise<RespuestaPaginada> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.pacienteId) params.append('pacienteId', filtros.pacienteId);
  if (filtros.laboratorioId) params.append('laboratorioId', filtros.laboratorioId);
  if (filtros.odontologoId) params.append('odontologoId', filtros.odontologoId);
  if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
  if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);

  const response = await fetch(`${API_BASE_URL}/ordenes-laboratorio?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las órdenes de laboratorio');
  }

  return response.json();
}

// Obtener detalle de una orden
export async function obtenerOrdenPorId(id: string): Promise<OrdenLaboratorio> {
  const response = await fetch(`${API_BASE_URL}/ordenes-laboratorio/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la orden de laboratorio');
  }

  return response.json();
}

// Crear nueva orden
export async function crearOrden(orden: NuevaOrdenLaboratorio): Promise<OrdenLaboratorio> {
  const response = await fetch(`${API_BASE_URL}/ordenes-laboratorio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(orden),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la orden' }));
    throw new Error(error.message || 'Error al crear la orden de laboratorio');
  }

  return response.json();
}

// Actualizar orden
export async function actualizarOrden(
  id: string,
  datos: Partial<NuevaOrdenLaboratorio>
): Promise<OrdenLaboratorio> {
  const response = await fetch(`${API_BASE_URL}/ordenes-laboratorio/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la orden de laboratorio');
  }

  return response.json();
}

// Actualizar estado de una orden
export async function actualizarEstadoOrden(
  id: string,
  nuevoEstado: EstadoOrden,
  notas?: string
): Promise<OrdenLaboratorio> {
  const response = await fetch(`${API_BASE_URL}/ordenes-laboratorio/${id}/estado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ nuevoEstado, notas }),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el estado de la orden');
  }

  return response.json();
}

// Subir archivos adjuntos
export async function subirArchivosAdjuntos(
  id: string,
  archivos: File[]
): Promise<ArchivoAdjunto[]> {
  const formData = new FormData();
  archivos.forEach((archivo) => {
    formData.append('archivos', archivo);
  });

  const response = await fetch(`${API_BASE_URL}/ordenes-laboratorio/${id}/adjuntos`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error al subir los archivos adjuntos');
  }

  const resultado = await response.json();
  return resultado.adjuntos || resultado;
}

// Eliminar orden
export async function eliminarOrden(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/ordenes-laboratorio/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la orden de laboratorio');
  }
}

// Eliminar archivo adjunto
export async function eliminarArchivoAdjunto(
  ordenId: string,
  archivoId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/ordenes-laboratorio/${ordenId}/adjuntos/${archivoId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Error al eliminar el archivo adjunto');
  }
}



