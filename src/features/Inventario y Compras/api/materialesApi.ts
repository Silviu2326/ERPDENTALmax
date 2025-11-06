// API para gestión de materiales dentales
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Material {
  _id?: string;
  codigoSKU: string;
  nombre: string;
  descripcion?: string;
  categoria?: {
    _id: string;
    nombre: string;
  };
  proveedorPrincipal?: {
    _id: string;
    nombre: string;
  };
  stockActual: number;
  stockMinimo: number;
  unidadMedida: string;
  costoUnitario: number;
  fechaCaducidad?: string;
  ubicacion?: string;
  estado: 'activo' | 'inactivo';
  createdAt?: string;
  updatedAt?: string;
}

export interface FiltrosMateriales {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  categoria?: string;
  estado?: 'en_stock' | 'bajo_stock' | 'agotado';
}

export interface RespuestaMateriales {
  data: Material[];
  total: number;
  page: number;
  limit: number;
}

// Obtener lista paginada y filtrada de materiales
export async function obtenerMateriales(filtros: FiltrosMateriales = {}): Promise<RespuestaMateriales> {
  const params = new URLSearchParams();
  
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.limit) params.append('limit', filtros.limit.toString());
  if (filtros.sortBy) params.append('sortBy', filtros.sortBy);
  if (filtros.sortOrder) params.append('sortOrder', filtros.sortOrder);
  if (filtros.search) params.append('search', filtros.search);
  if (filtros.categoria) params.append('categoria', filtros.categoria);
  if (filtros.estado) params.append('estado', filtros.estado);

  const response = await fetch(`${API_BASE_URL}/materiales?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los materiales');
  }

  return response.json();
}

// Obtener detalle de un material específico
export async function obtenerMaterialPorId(id: string): Promise<Material> {
  const response = await fetch(`${API_BASE_URL}/materiales/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el material');
  }

  return response.json();
}

// Desactivar un material (borrado lógico)
export async function desactivarMaterial(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/materiales/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al desactivar el material');
  }

  return response.json();
}

// Actualizar un material
export async function actualizarMaterial(id: string, datos: Partial<Material>): Promise<Material> {
  const response = await fetch(`${API_BASE_URL}/materiales/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el material');
  }

  return response.json();
}

// Función auxiliar para determinar el estado del stock
export function obtenerEstadoStock(material: Material): 'en_stock' | 'bajo_stock' | 'agotado' {
  if (material.stockActual <= 0) {
    return 'agotado';
  }
  if (material.stockActual < material.stockMinimo) {
    return 'bajo_stock';
  }
  return 'en_stock';
}

// Interfaces para crear material
export interface NuevoMaterial {
  nombre: string;
  sku: string;
  descripcion?: string;
  categoria: string; // ObjectId de CategoriaMaterial
  unidadMedida: string;
  stockMinimo: number;
  proveedorPreferido?: string; // ObjectId de Proveedor (opcional)
  costoUnitario: number;
}

export interface Proveedor {
  _id: string;
  nombre: string;
}

export interface CategoriaMaterial {
  _id: string;
  nombre: string;
}

// Crear un nuevo material
export async function crearMaterial(datos: NuevoMaterial): Promise<Material> {
  const response = await fetch(`${API_BASE_URL}/materiales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear el material' }));
    throw new Error(error.message || 'Error al crear el material');
  }

  return response.json();
}

// Obtener lista simplificada de proveedores (ID y nombre)
export async function obtenerProveedores(): Promise<Proveedor[]> {
  const response = await fetch(`${API_BASE_URL}/proveedores?minimal=true`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener los proveedores');
  }

  return response.json();
}

// Obtener lista de categorías de materiales
export async function obtenerCategoriasMaterial(): Promise<CategoriaMaterial[]> {
  const response = await fetch(`${API_BASE_URL}/categorias-material`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las categorías de materiales');
  }

  return response.json();
}

