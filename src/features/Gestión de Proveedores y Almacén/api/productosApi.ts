// API para gestión de productos médicos
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Proveedor {
  _id: string;
  nombreComercial: string;
}

export type CategoriaProducto = 'Consumible' | 'Instrumental' | 'Equipamiento' | 'Oficina';
export type UnidadMedida = 'unidad' | 'caja' | 'paquete' | 'litro';

export interface Producto {
  _id?: string;
  nombre: string;
  sku: string;
  descripcion?: string;
  categoria: CategoriaProducto;
  proveedorId?: string;
  proveedor?: Proveedor;
  costoUnitario: number;
  stockActual: number;
  stockMinimo: number;
  unidadMedida: UnidadMedida;
  lote?: string;
  fechaCaducidad?: string;
  activo?: boolean;
  clinicaId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FiltrosBusquedaProductos {
  page?: number;
  limit?: number;
  search?: string;
  categoria?: CategoriaProducto;
  proveedor?: string;
}

export interface RespuestaProductos {
  productos: Producto[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface NuevoProducto {
  nombre: string;
  sku: string;
  descripcion?: string;
  categoria: CategoriaProducto;
  proveedorId?: string;
  costoUnitario: number;
  stockActual?: number;
  stockMinimo: number;
  unidadMedida: UnidadMedida;
  lote?: string;
  fechaCaducidad?: string;
  activo?: boolean;
}

// Obtener lista de productos con paginación y filtros
export async function obtenerProductos(filtros: FiltrosBusquedaProductos = {}): Promise<RespuestaProductos> {
  const params = new URLSearchParams();
  
  if (filtros.page) {
    params.append('page', filtros.page.toString());
  }
  if (filtros.limit) {
    params.append('limit', filtros.limit.toString());
  }
  if (filtros.search) {
    params.append('search', filtros.search);
  }
  if (filtros.categoria) {
    params.append('categoria', filtros.categoria);
  }
  if (filtros.proveedor) {
    params.append('proveedor', filtros.proveedor);
  }

  const response = await fetch(`${API_BASE_URL}/productos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener los productos' }));
    throw new Error(error.message || 'Error al obtener los productos');
  }

  return response.json();
}

// Obtener detalle de un producto
export async function obtenerProductoPorId(id: string): Promise<Producto> {
  const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener el producto' }));
    throw new Error(error.message || 'Error al obtener el producto');
  }

  return response.json();
}

// Crear un nuevo producto
export async function crearProducto(producto: NuevoProducto): Promise<Producto> {
  const response = await fetch(`${API_BASE_URL}/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(producto),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el producto' }));
    throw new Error(error.message || 'Error al crear el producto');
  }

  return response.json();
}

// Actualizar un producto existente
export async function actualizarProducto(id: string, producto: Partial<NuevoProducto>): Promise<Producto> {
  const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(producto),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar el producto' }));
    throw new Error(error.message || 'Error al actualizar el producto');
  }

  return response.json();
}

// Eliminar (desactivar) un producto
export async function eliminarProducto(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al eliminar el producto' }));
    throw new Error(error.message || 'Error al eliminar el producto');
  }
}



