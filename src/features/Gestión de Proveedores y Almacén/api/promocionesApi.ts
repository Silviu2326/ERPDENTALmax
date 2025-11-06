// API para gestión de promociones y ofertas
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Promocion {
  _id?: string;
  nombre: string;
  descripcion: string;
  tipo: 'porcentaje' | 'fijo' | '2x1' | 'paquete';
  valor: number;
  fechaInicio: string;
  fechaFin: string;
  codigo?: string;
  condiciones?: string;
  tratamientosAplicables?: Array<{
    _id: string;
    nombre: string;
  }>;
  productosAplicables?: Array<{
    _id: string;
    nombre: string;
  }>;
  estado: 'activa' | 'inactiva' | 'expirada';
  usosMaximos?: number;
  usosActuales?: number;
  soloNuevosPacientes?: boolean;
  creadoPor?: {
    _id: string;
    nombre: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface FiltrosPromociones {
  estado?: 'activa' | 'inactiva' | 'expirada';
  tipo?: 'porcentaje' | 'fijo' | '2x1' | 'paquete';
  fechaInicio?: string;
  fechaFin?: string;
  search?: string;
}

export interface PromocionesAplicablesParams {
  tratamientos?: string[];
  productos?: string[];
}

// Obtener todas las promociones
export async function obtenerPromociones(filtros?: FiltrosPromociones): Promise<Promocion[]> {
  const params = new URLSearchParams();
  
  if (filtros?.estado) {
    params.append('estado', filtros.estado);
  }
  if (filtros?.tipo) {
    params.append('tipo', filtros.tipo);
  }
  if (filtros?.fechaInicio) {
    params.append('fechaInicio', filtros.fechaInicio);
  }
  if (filtros?.fechaFin) {
    params.append('fechaFin', filtros.fechaFin);
  }
  if (filtros?.search) {
    params.append('search', filtros.search);
  }

  const response = await fetch(`${API_BASE_URL}/promociones?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener las promociones');
  }

  return response.json();
}

// Crear una nueva promoción
export async function crearPromocion(promocion: Omit<Promocion, '_id' | 'createdAt' | 'updatedAt' | 'usosActuales'>): Promise<Promocion> {
  const response = await fetch(`${API_BASE_URL}/promociones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(promocion),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al crear la promoción' }));
    throw new Error(error.message || 'Error al crear la promoción');
  }

  return response.json();
}

// Obtener una promoción por ID
export async function obtenerPromocionPorId(id: string): Promise<Promocion> {
  const response = await fetch(`${API_BASE_URL}/promociones/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la promoción');
  }

  return response.json();
}

// Actualizar una promoción
export async function actualizarPromocion(id: string, promocion: Partial<Promocion>): Promise<Promocion> {
  const response = await fetch(`${API_BASE_URL}/promociones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(promocion),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar la promoción' }));
    throw new Error(error.message || 'Error al actualizar la promoción');
  }

  return response.json();
}

// Eliminar una promoción
export async function eliminarPromocion(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/promociones/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la promoción');
  }
}

// Buscar promociones aplicables
export async function buscarPromocionesAplicables(params: PromocionesAplicablesParams): Promise<Promocion[]> {
  const queryParams = new URLSearchParams();
  
  if (params.tratamientos && params.tratamientos.length > 0) {
    params.tratamientos.forEach(id => queryParams.append('tratamientos', id));
  }
  if (params.productos && params.productos.length > 0) {
    params.productos.forEach(id => queryParams.append('productos', id));
  }

  const response = await fetch(`${API_BASE_URL}/promociones/aplicables?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al buscar promociones aplicables');
  }

  return response.json();
}


