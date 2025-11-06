// API para gestión de transferencias entre almacenes
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Almacen {
  _id: string;
  nombre: string;
  ubicacion?: string;
  esPrincipal?: boolean;
}

export interface ProductoInventario {
  _id: string;
  nombre: string;
  sku?: string;
  stockDisponible?: number;
}

export interface ProductoTransferencia {
  productoId: string;
  cantidad: number;
  lote?: string;
  producto?: ProductoInventario;
}

export interface Usuario {
  _id: string;
  name: string;
  email?: string;
}

export type EstadoTransferencia = 'Pendiente' | 'Completada' | 'Cancelada';

export interface TransferenciaAlmacen {
  _id?: string;
  codigo: string;
  almacenOrigen: Almacen;
  almacenDestino: Almacen;
  estado: EstadoTransferencia;
  productos: Array<{
    producto: ProductoInventario;
    cantidad: number;
    lote?: string;
  }>;
  usuarioSolicitante?: Usuario;
  usuarioReceptor?: Usuario;
  fechaCreacion: string;
  fechaCompletado?: string;
  notas?: string;
}

export interface NuevaTransferencia {
  almacenOrigenId: string;
  almacenDestinoId: string;
  productos: Array<{
    productoId: string;
    cantidad: number;
    lote?: string;
  }>;
  notas?: string;
}

export interface FiltrosTransferencias {
  page?: number;
  limit?: number;
  estado?: EstadoTransferencia;
  origenId?: string;
  destinoId?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface RespuestaTransferencias {
  transferencias: TransferenciaAlmacen[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

/**
 * Obtiene una lista paginada de transferencias con filtros opcionales
 */
export async function listarTransferencias(filtros: FiltrosTransferencias = {}): Promise<RespuestaTransferencias> {
  const params = new URLSearchParams();
  
  if (filtros.page) {
    params.append('page', filtros.page.toString());
  }
  if (filtros.limit) {
    params.append('limit', filtros.limit.toString());
  }
  if (filtros.estado) {
    params.append('estado', filtros.estado);
  }
  if (filtros.origenId) {
    params.append('origenId', filtros.origenId);
  }
  if (filtros.destinoId) {
    params.append('destinoId', filtros.destinoId);
  }
  if (filtros.fechaInicio) {
    params.append('fechaInicio', filtros.fechaInicio);
  }
  if (filtros.fechaFin) {
    params.append('fechaFin', filtros.fechaFin);
  }

  const response = await fetch(`${API_BASE_URL}/transferencias-almacen?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener las transferencias' }));
    throw new Error(error.message || 'Error al obtener las transferencias');
  }

  return response.json();
}

/**
 * Crea una nueva solicitud de transferencia en estado 'Pendiente'
 */
export async function crearTransferencia(transferencia: NuevaTransferencia): Promise<TransferenciaAlmacen> {
  const response = await fetch(`${API_BASE_URL}/transferencias-almacen`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(transferencia),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la transferencia' }));
    throw new Error(error.message || 'Error al crear la transferencia');
  }

  return response.json();
}

/**
 * Obtiene los detalles completos de una transferencia específica
 */
export async function obtenerTransferenciaPorId(id: string): Promise<TransferenciaAlmacen> {
  const response = await fetch(`${API_BASE_URL}/transferencias-almacen/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener la transferencia' }));
    throw new Error(error.message || 'Error al obtener la transferencia');
  }

  return response.json();
}

/**
 * Confirma la recepción de una transferencia
 * Cambia el estado a 'Completada' y actualiza el stock
 */
export async function confirmarRecepcionTransferencia(id: string): Promise<TransferenciaAlmacen> {
  const response = await fetch(`${API_BASE_URL}/transferencias-almacen/${id}/confirmar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al confirmar la recepción' }));
    throw new Error(error.message || 'Error al confirmar la recepción');
  }

  return response.json();
}

/**
 * Cancela una transferencia en estado 'Pendiente'
 */
export async function cancelarTransferencia(id: string): Promise<TransferenciaAlmacen> {
  const response = await fetch(`${API_BASE_URL}/transferencias-almacen/${id}/cancelar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al cancelar la transferencia' }));
    throw new Error(error.message || 'Error al cancelar la transferencia');
  }

  return response.json();
}

/**
 * Obtiene el stock disponible de un producto en un almacén específico
 */
export async function obtenerStockProducto(almacenId: string, productoId: string): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/almacenes/${almacenId}/stock/${productoId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    // Si no hay stock, retornar 0 en lugar de lanzar error
    return 0;
  }

  const data = await response.json();
  return data.cantidad || 0;
}


