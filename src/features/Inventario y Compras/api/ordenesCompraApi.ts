// API para gestión de órdenes de compra
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Proveedor {
  _id: string;
  nombreComercial: string;
  razonSocial: string;
  nif: string;
  contacto: {
    nombre: string;
    email: string;
    telefono: string;
  };
  direccion: {
    calle: string;
    ciudad: string;
    codigoPostal: string;
  };
}

export interface Producto {
  _id: string;
  nombre: string;
  sku: string;
  descripcion?: string;
  categoria?: string;
  stockActual?: number;
  proveedorHabitual?: string;
}

export interface ItemOrdenCompra {
  producto: string | Producto;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface OrdenCompra {
  _id?: string;
  numeroOrden: string;
  proveedor: string | Proveedor;
  sucursal: string | {
    _id: string;
    nombre: string;
  };
  fechaCreacion: string;
  fechaEntregaEstimada: string;
  items: ItemOrdenCompra[];
  subtotal: number;
  impuestos: number;
  total: number;
  estado: 'Borrador' | 'Enviada' | 'Recibida Parcial' | 'Recibida Completa' | 'Cancelada';
  creadoPor: string | {
    _id: string;
    nombre: string;
  };
  notas?: string;
  historialEstados?: Array<{
    estado: string;
    fecha: string;
    usuario: string;
  }>;
}

export interface FiltrosOrdenesCompra {
  page?: number;
  limit?: number;
  estado?: string;
  proveedorId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  sucursalId?: string;
}

export interface NuevaOrdenCompra {
  proveedorId: string;
  sucursalId: string;
  fechaEntregaEstimada?: string;
  items: Array<{
    productoId: string;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
  }>;
  notas?: string;
}

export interface RespuestaListadoOrdenesCompra {
  ordenes: OrdenCompra[];
  total: number;
  paginas: number;
  paginaActual: number;
}

// Obtener listado paginado de órdenes de compra
export async function obtenerOrdenesCompra(
  filtros: FiltrosOrdenesCompra = {}
): Promise<RespuestaListadoOrdenesCompra> {
  const params = new URLSearchParams();

  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.proveedorId) params.append('proveedorId', filtros.proveedorId);
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
  if (filtros.sucursalId) params.append('sucursalId', filtros.sucursalId);

  const response = await fetch(`${API_BASE_URL}/ordenes-compra?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las órdenes de compra');
  }

  return response.json();
}

// Obtener detalle de una orden de compra
export async function obtenerOrdenCompraPorId(id: string): Promise<OrdenCompra> {
  const response = await fetch(`${API_BASE_URL}/ordenes-compra/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la orden de compra');
  }

  return response.json();
}

// Crear una nueva orden de compra
export async function crearOrdenCompra(data: NuevaOrdenCompra): Promise<OrdenCompra> {
  const response = await fetch(`${API_BASE_URL}/ordenes-compra`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la orden de compra' }));
    throw new Error(error.message || 'Error al crear la orden de compra');
  }

  return response.json();
}

// Actualizar una orden de compra
export async function actualizarOrdenCompra(
  id: string,
  data: Partial<NuevaOrdenCompra>
): Promise<OrdenCompra> {
  const response = await fetch(`${API_BASE_URL}/ordenes-compra/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar la orden de compra' }));
    throw new Error(error.message || 'Error al actualizar la orden de compra');
  }

  return response.json();
}

// Cambiar estado de una orden de compra
export async function cambiarEstadoOrdenCompra(
  id: string,
  nuevoEstado: 'Enviada' | 'Recibida Parcial' | 'Recibida Completa' | 'Cancelada'
): Promise<OrdenCompra> {
  const response = await fetch(`${API_BASE_URL}/ordenes-compra/${id}/estado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ nuevoEstado }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al cambiar el estado de la orden' }));
    throw new Error(error.message || 'Error al cambiar el estado de la orden');
  }

  return response.json();
}

// Eliminar una orden de compra
export async function eliminarOrdenCompra(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/ordenes-compra/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al eliminar la orden de compra' }));
    throw new Error(error.message || 'Error al eliminar la orden de compra');
  }
}

// Obtener proveedores (para selección)
export async function obtenerProveedores(): Promise<Proveedor[]> {
  const response = await fetch(`${API_BASE_URL}/proveedores`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    // Retornar array vacío si falla (para desarrollo)
    return [];
  }

  return response.json();
}

// Buscar productos para agregar a la orden
export async function buscarProductos(termino: string): Promise<Producto[]> {
  const params = new URLSearchParams({ q: termino });

  const response = await fetch(`${API_BASE_URL}/productos/buscar?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    // Retornar array vacío si falla (para desarrollo)
    return [];
  }

  return response.json();
}



