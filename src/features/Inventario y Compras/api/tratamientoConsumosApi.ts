// API para gestión de consumos por tratamiento
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Tratamiento {
  _id: string;
  nombre: string;
  codigo?: string;
  precio: number;
  consumos?: ConsumoTratamiento[];
  totalConsumos?: number; // Resumen de cuántos items tiene
}

export interface ConsumoTratamiento {
  producto: {
    _id: string;
    nombre: string;
    unidadMedida: string;
    sku?: string;
  };
  cantidad: number;
}

export interface ProductoInventario {
  _id: string;
  nombre: string;
  sku: string;
  unidadMedida: string;
  descripcion?: string;
}

export interface ConsumoRequest {
  productoId: string;
  cantidad: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface FiltrosTratamientos {
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Obtiene una lista paginada de todos los tratamientos
 */
export async function obtenerTratamientos(
  filtros: FiltrosTratamientos = {}
): Promise<PaginatedResponse<Tratamiento>> {
  const params = new URLSearchParams();
  
  if (filtros.search) {
    params.append('search', filtros.search);
  }
  if (filtros.page) {
    params.append('page', filtros.page.toString());
  }
  if (filtros.limit) {
    params.append('limit', filtros.limit.toString());
  }

  const response = await fetch(`${API_BASE_URL}/tratamientos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener tratamientos: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Obtiene la lista detallada de consumos de un tratamiento específico
 */
export async function obtenerConsumosPorTratamiento(
  tratamientoId: string
): Promise<ConsumoTratamiento[]> {
  const response = await fetch(`${API_BASE_URL}/tratamientos/${tratamientoId}/consumos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener consumos del tratamiento: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Actualiza la lista de consumos de un tratamiento
 */
export async function actualizarConsumosTratamiento(
  tratamientoId: string,
  consumos: ConsumoRequest[]
): Promise<Tratamiento> {
  const response = await fetch(`${API_BASE_URL}/tratamientos/${tratamientoId}/consumos`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ consumos }),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar consumos: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Busca productos del inventario por nombre o SKU
 */
export async function buscarProductosInventario(
  search: string
): Promise<ProductoInventario[]> {
  if (!search || search.trim().length === 0) {
    return [];
  }

  const params = new URLSearchParams();
  params.append('search', search.trim());

  const response = await fetch(`${API_BASE_URL}/inventario/productos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al buscar productos: ${response.statusText}`);
  }

  return response.json();
}



