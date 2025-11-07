// API para gestión de recepción de mercancías
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Proveedor {
  _id: string;
  nombreComercial: string;
  razonSocial: string;
  nif: string;
}

export interface Producto {
  _id: string;
  nombre: string;
  sku: string;
  descripcion?: string;
  categoria?: string;
}

export interface LineaPedidoCompra {
  producto: string | Producto;
  descripcion: string;
  cantidad: number;
  cantidadRecibida?: number;
  cantidadPendiente: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoCompra {
  _id: string;
  numeroOrden: string;
  proveedor: string | Proveedor;
  fechaCreacion: string;
  fechaEntregaEstimada: string;
  items: LineaPedidoCompra[];
  estado: 'abierto' | 'parcialmente_recibido' | 'recibido' | 'cancelado';
  creadoPor: string | {
    _id: string;
    nombre: string;
  };
  notas?: string;
}

export interface LineaRecepcion {
  productoId: string;
  cantidadRecibida: number;
  lote?: string;
  fechaCaducidad?: string;
}

export interface RecepcionMercancia {
  _id?: string;
  pedidoCompraId: string;
  fechaRecepcion: string;
  numeroAlbaran: string;
  notas?: string;
  lineas: LineaRecepcion[];
  creadoPor?: string;
  estadoPedidoResultante?: string;
}

export interface FiltrosBusquedaPedidos {
  estado?: string; // 'abierto,parcialmente_recibido'
  proveedor?: string; // ID del proveedor
  search?: string; // Búsqueda por número de pedido
}

// Obtener listado de pedidos de compra para recepción
export async function obtenerPedidosParaRecepcion(
  filtros: FiltrosBusquedaPedidos = {}
): Promise<PedidoCompra[]> {
  const params = new URLSearchParams();

  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.proveedor) params.append('proveedor', filtros.proveedor);
  if (filtros.search) params.append('search', filtros.search);

  const response = await fetch(`${API_BASE_URL}/pedidos-compra?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los pedidos de compra');
  }

  return response.json();
}

// Obtener detalle completo de un pedido de compra
export async function obtenerDetallePedido(id: string): Promise<PedidoCompra> {
  const response = await fetch(`${API_BASE_URL}/pedidos-compra/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el detalle del pedido');
  }

  return response.json();
}

// Crear una nueva recepción de mercancías
export async function crearRecepcion(data: RecepcionMercancia): Promise<RecepcionMercancia> {
  const response = await fetch(`${API_BASE_URL}/recepciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la recepción' }));
    throw new Error(error.message || 'Error al crear la recepción');
  }

  return response.json();
}

// Obtener listado de recepciones
export async function obtenerRecepciones(): Promise<RecepcionMercancia[]> {
  const response = await fetch(`${API_BASE_URL}/recepciones`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las recepciones');
  }

  return response.json();
}



